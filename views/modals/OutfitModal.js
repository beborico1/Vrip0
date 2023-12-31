import { Animated, Dimensions, Image, Modal, TouchableOpacity, View, Text, Alert, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { containerStyles } from '../../helpers/styles'
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { auth, db } from '../../firebaseConfig';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // Añadir esta línea para importar iconos
import { LanguageContext } from '../../helpers/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const OutfitModal = ({outfit, isVisible, closeOutfitModal, handleFilterReport }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUsername, setLoadingUsername] = useState(true);

  const { texts } = useContext(LanguageContext);

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  

  useEffect(() => {
    const fetchLikes = async () => {
      if (!auth.currentUser) {
        return;
      }

      try {
        if (outfit) {
          // Get the user's like document

          const likeDoc = doc(db, 'outfits', outfit.id, 'likes', auth.currentUser.uid);
          // Get the document
          const likeDocSnapshot = await getDoc(likeDoc);

          // If the document exists
          const userHasLiked = likeDocSnapshot.exists();

          // Update likes state
          setLiked(userHasLiked);

          setLikeCount(outfit.likeCount);
        }
      } catch (error) {
        console.log('Error fetching likes: ', error);
      }
    };

    const registerView = async () => {
      if (!auth.currentUser) {
        return;
      }

      try {
        if (outfit) {
          // Get the user's view document
          const viewDoc = doc(db, 'outfits', outfit.id, 'views', auth.currentUser.uid);
          // Get the document
          const viewDocSnapshot = await getDoc(viewDoc);

          // If the document doesn't exist
          if (!viewDocSnapshot.exists()) {
            // Create the document
            await setDoc(viewDoc, { viewed: true });
          }
        }
      } catch (error) {
        console.log('Error registering view: ', error);
      }
    };

    fetchLikes();
    registerView();

  }, [outfit]);


  const windowWidth = Dimensions.get('window').width;

   // Crear una nueva instancia de Animated.Value para el desplazamiento en Y
   const translateY = new Animated.Value(0)

   // Manejar el gesto de desplazamiento
   const onGestureEvent = Animated.event([{ nativeEvent: { translationY: translateY } }], { useNativeDriver: true })
   
   // Manejar el final del gesto de desplazamiento
   const onHandlerStateChange = ({ nativeEvent }) => {
     if (nativeEvent.oldState === State.ACTIVE) {
       Animated.timing(translateY, {
         toValue: 0,
         duration: 200,
         useNativeDriver: true,
       }).start()
       // Si el desplazamiento en Y es mayor que 50, cerrar el modal
       if (nativeEvent.translationY > 50) {
         closeOutfitModal();
       }
     }
   };

   const handleLikePress = async () => {
      try {
        // Get the like document
        const likeDoc = doc(db, 'outfits', outfit.id, 'likes', auth.currentUser.uid);
        // Get the user document
        const userDoc = doc(db, 'users', auth.currentUser.uid, 'likes', outfit.id)
        // Update the like document

        if (liked) {
          setLiked(false)
          setLikeCount(likeCount - 1)
          await deleteDoc(likeDoc);
          await deleteDoc(userDoc);
        } else {
          setLiked(true)
          setLikeCount(likeCount + 1)
          await setDoc(likeDoc, { liked: true });
          await setDoc(userDoc, { liked: true });
        }
      } catch (error) {
        console.log('Error updating like: ', error);
      }
   }

   const handleDeletePress = async () => {
      try {
        Alert.alert(
          texts.confirmDeleteAlertTitle,
          texts.confirmDeleteAlertMessage,
          [
            {
              text: texts.cancelDeleteAlertButton,
              style: 'cancel',
            },
            {
              text: texts.deleteDeleteAlertButton,
              style: 'destructive',
              onPress: async () => {
                // Get the like document
                const outfitDoc = doc(db, 'outfits', outfit.id);

                await deleteDoc(outfitDoc);
                //await deleteDoc(userDoc);

                closeOutfitModal();
              },
            },
          ],
          { cancelable: true }
        );
      } catch (error) {
        console.log('Error deleting outfit: ', error);
      }
    }

    const handleReportPress = async () => {
      try {
        Alert.alert(
          texts.confirmReportAlertTitle,
          texts.confirmReportAlertMessage,
          [
            {
              text: texts.cancelReportAlertButton,
              style: 'cancel',
            },
            {
              text: texts.reportReportAlertButton,
              style: 'destructive',
              onPress: async () => {
                const outfitDoc = doc(db, 'outfits', outfit.id);
                await setDoc(outfitDoc, { reported: true }, { merge: true });
    
                handleFilterReport();
    
                closeOutfitModal();
              },
            },
          ],
          { cancelable: true }
        );
      } catch (error) {
        console.log('Error reporting outfit: ', error);
      }
    };

    const fetchUsername = async () => {
      if (!outfit) {
        return;
      }
      try {
        const userDoc = doc(db, 'users', outfit.postedBy);
        const userDocSnapshot = await getDoc(userDoc);
        const user = userDocSnapshot.data();
        setUser({ id: userDocSnapshot.id, ...user });
        setUsername(user.username);
      } catch (error) {
        setLoadingUsername(false);
        console.log('Error fetching user: ', error);
      }
    };

    useEffect(() => {
      setUsername(null);
      setLoadingUsername(true);
      fetchUsername();
    }, [outfit]);

  return (
    <Modal 
      animationType="slide" 
      transparent={true} 
      visible={isVisible}
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            containerStyles.modalView,
            { transform: [{ translateY: translateY }] }, // Aplicar la transformación de translateY
          ]}
        >

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 2 + insets.top,  // Se añade el inset superior aquí
            right: 10,
            zIndex: 10,
          }}
          onPress={closeOutfitModal}
        >
          <Ionicons name="close" size={42} color="white" />
        </TouchableOpacity>

          {outfit && 
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
              }}
            >
              <View style={{ 
                position: 'relative', 
                height: (windowWidth * 0.8) / (2 / 3), 
                borderTopLeftRadius: 10, borderTopRightRadius: 10,
                overflow: 'hidden'  // Agregamos esto
              }}>             
                <ScrollView
                  maximumZoomScale={3} // establece el máximo nivel de zoom que quieres
                  minimumZoomScale={1} // establece el mínimo nivel de zoom
                  centerContent={true} // centra el contenido
                  showsHorizontalScrollIndicator={false} // oculta la barra de desplazamiento horizontal
                  showsVerticalScrollIndicator={false} // oculta la barra de desplazamiento vertical
                >
                  <Image
                      style={[containerStyles.modalOutfitImage, { width: windowWidth * 0.8, height: (windowWidth * 0.8) / (2 / 3) }]}
                      source={{ uri: outfit.imageUrl }}
                  />
                </ScrollView>

                { auth.currentUser &&
                  <TouchableOpacity
                      style={{ position: 'absolute', top: 5, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 3, paddingHorizontal: 10 }} 
                      onPress={ outfit.postedBy === auth.currentUser.uid ? handleDeletePress : handleReportPress }
                  >
                      <Ionicons
                          name={ outfit.postedBy === auth.currentUser.uid ? "trash-outline" : "flag" }
                          size={20} 
                          color={ 'white' }
                      />
                      <Text style={{ color: 'white', fontSize: 16, marginLeft: 5 }}>{ outfit.postedBy === auth.currentUser.uid ? texts.delete : texts.report }</Text>
                  </TouchableOpacity>
                }

                { auth.currentUser &&
                  <TouchableOpacity
                      style={{ position: 'absolute', bottom: 15, right: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 5, paddingHorizontal: 10 }} 
                      onPress={handleLikePress}
                  >
                      <Ionicons
                          name={ liked ? "heart" : "heart-outline" } 
                          size={30} 
                          color={ liked ? "red" : "white" } 
                      />
                      <Text style={{ color: 'white', fontSize: 16 }}>{likeCount}</Text>
                  </TouchableOpacity>
                }
              </View>

              { username && user ?
              <TouchableOpacity
                onPress={() => {
                  closeOutfitModal();
                  navigation.navigate('Profile', { result: user });
                }}
              >
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: '500',
                  }}
                >
                  @{username}
                </Text>
              </TouchableOpacity>
              :
              <Text
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  fontWeight: '400',
                  color: 'gray',
                }}
              >
                Cargando ...
              </Text> }

              {outfit.description && 
                <Text
                  style={{
                    paddingBottom: 10,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: 'gray',
                  }}
                >
                  {outfit.description} 
                </Text>
              }
            </View>
          }
        </Animated.View>
      </PanGestureHandler>

    </Modal>

  )
}

export default OutfitModal

// Agregar comentarios

// Que el documento reportado se agregue a la colección de reportados

// Que el likeado doc tenga dentro toda la informacion documento del outfit

// Que el view doc tenga dentro toda la informacion documento del outfit

// Separar lógica de la vista: Separa la lógica de la vista en funciones auxiliares o hooks personalizados para mejorar la legibilidad y la reutilización del código.

// Optimización de carga de imágenes: Implementa técnicas de carga diferida o progresiva para las imágenes de los outfits, especialmente si hay muchos outfits cargados.

// Mejorar la experiencia de usuario: Considera agregar animaciones suaves al abrir y cerrar el modal de outfit para brindar una experiencia más agradable al usuario.

// Mejorar el manejo de errores: Agrega un manejo de errores más robusto para capturar y manejar posibles errores durante las operaciones de interacción con el outfit, como dar like, eliminar o reportar.

// Refactorización del código repetitivo: Identifica patrones de código repetitivo y encapsula la lógica en funciones auxiliares o componentes reutilizables.

// Mejorar la accesibilidad: Asegúrate de que el modal sea accesible para usuarios con discapacidades visuales o de movilidad, al proporcionar etiquetas descriptivas y ajustar los tamaños de fuente según las preferencias del usuario.

// Consistencia de estilos: Revisa los estilos utilizados en el modal y asegúrate de que sean consistentes con el resto de la aplicación.

// Implementar confirmación de eliminación: Agrega una confirmación antes de eliminar un outfit para evitar eliminaciones accidentales y dar al usuario la oportunidad de confirmar su acción.

// Agregar animaciones de like: Agrega una animación visual cuando el usuario da like a un outfit para brindar retroalimentación inmediata.

// Mejorar el filtrado de outfits reportados: Evalúa si el filtrado de outfits reportados es la mejor solución en términos de experiencia de usuario. Podrías considerar agregar una opción para ocultar o mostrar outfits reportados en lugar de filtrarlos automáticamente.