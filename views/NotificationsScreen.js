import { View, Text, FlatList, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebaseConfig'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'
import { LanguageContext } from '../helpers/LanguageContext'

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true)

      // Crear una referencia a la subcolección 'notifications'
      const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications')

      // Crear una consulta que ordene los documentos por 'createdAt' en orden descendente
      const q = query(notificationsRef, orderBy('createdAt', 'desc'))

      const notificationsSnapshot = await getDocs(q)
      const notificationsData = notificationsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))

      console.log(notificationsData);

      setNotifications(notificationsData)
      setLoading(false)
    }

    getNotifications()
    console.log('Cuantas notificaciones hay?', notifications.length);
  }, [])

  const { texts } = useContext(LanguageContext)

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {
        notifications.length !== 0 ?
          <FlatList
            data={notifications}
            renderItem={({ item }) =>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: 'white',
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgrey',
                }}
              >
                <Image
                  source={{ uri: item.outfitImageUrl }}
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: 'lightgrey',
                    marginRight: 10,
                    borderRadius: 10,
                  }}
                />
                <Ionicons
                  name="heart"
                  size={26}
                  color="red"
                  style={{
                    marginRight: 10,
                  }}
                />

                <View
                  style={{
                    flex: 1, // agregar esta línea
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      @{item.byUsername}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {texts.likedYourOutfit}
                  </Text>
                </View>
              </View>
            }
            keyExtractor={item => item.id}
          /> :
          <View
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ?
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'grey',
                }}
              >
                {texts.loadingNotifications}
              </Text> :
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'grey',
                }}
              >
                {texts.noNotifications}
              </Text>}
          </View>
      }
    </View>
  )
}

export default NotificationsScreen