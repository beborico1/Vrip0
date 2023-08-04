import { ActivityIndicator, Button, Dimensions, Image, Keyboard, ScrollView, Text, TextInput, Touchable, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Outfits from '../components/Outfits';
import useAllOutfits from '../hooks/useAllOutfits';
import { containerStyles } from '../helpers/styles';
import { LanguageContext } from '../helpers/LanguageContext';
import OutfitModal from './modals/OutfitModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import useAlgoliaSearch from '../hooks/useAlgoliaSearch';
import { LogBox } from 'react-native';
import colors from '../helpers/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp, collectionGroup, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';

LogBox.ignoreAllLogs();

const HomeScreen = () => {
  const { texts } = React.useContext(LanguageContext);

  const [query, setQuery] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  const { loading, error, outfits, setOutfits } = useAllOutfits();
  const { results, search, loadingAlgolia, errorAlgolia } = useAlgoliaSearch();

  const windowWidth = Dimensions.get('window').width;

  const navigation = useNavigation();

  const onOutfitPress = (outfit) => {
    console.log('outfit press', outfit);
    setSelectedOutfit(outfit);
  };

  const handleFilterReport = () => {
    const filteredOutfits = outfits.filter(outfit => outfit.reported === true);
    setOutfits(filteredOutfits);
  };

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query]);

  useEffect(() => {
    if (results.length > 0) {
      console.log('results: ', results);
    }
  }, [results]);

  return (
    <>
      <OutfitModal
        outfit={selectedOutfit}
        isVisible={selectedOutfit !== null}
        closeOutfitModal={() => setSelectedOutfit(null)}
        handleFilterReport={handleFilterReport}
      />

      <View style={[containerStyles.container]}>
        {/* <FeedHeader title = {texts.communityOutfits} /> */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: 'gray', borderWidth: 1, margin: 8, paddingHorizontal: 8, borderRadius: 8 }}>
          <Ionicons name="search" size={24} color="black" />
          <TextInput
            value={query}
            onChangeText={text => setQuery(text)}
            placeholder={texts.searchForUsers}
            style={{ height: 40, flex: 1, marginLeft: 8 }}
          />
          {query &&
            <Button
              title={texts.cancel}
              color={colors.vrip}
              onPress={() => {
                setQuery('');
                Keyboard.dismiss();
              }
              }
            />
          }
        </View>

        {query ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loadingAlgolia ? <ActivityIndicator size="large" color={colors.vrip} /> :
              errorAlgolia ? <Text>Error: {errorAlgolia.message}</Text> :
                <ScrollView>
                  {results.map((result, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                      setQuery('');
                      navigation.navigate('Profile', { result })
                    }}
                    >
                      <View key={index} style={{ padding: 10, marginBottom: 5, backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 }, width: windowWidth * 0.9, marginHorizontal: 3 }}>
                        <Image source={result.profile_picture ? { uri: result.profile_picture } : require('../assets/default-profile-picture.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <Text
                          style={{ marginLeft: 10, fontSize: 16, fontWeight: '500' }}
                        >
                          @{result.username}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
            }
          </View>
          :
          <Outfits
            outfits={outfits}
            loading={loading}
            error={error}
            onOutfitPress={onOutfitPress}
          />
        }

      </View>
    </>
  )
}

export default HomeScreen

// Optimización de la carga inicial de outfits: Puedes implementar una técnica de carga progresiva para cargar inicialmente solo un número limitado de outfits y luego cargar más outfits a medida que el usuario se desplaza hacia abajo en la lista.

// Mejorar el manejo de errores: Agrega un componente de manejo de errores que muestre un mensaje amigable al usuario en caso de que ocurra un error al cargar los outfits.

// Implementar paginación infinita: En lugar de cargar todos los outfits a la vez, considera implementar la carga paginada o infinita, donde se cargan más outfits a medida que el usuario se desplaza hacia abajo en la lista.

// Agregar un indicador de carga: Muestra un indicador de carga (por ejemplo, un spinner) mientras se cargan los outfits, para informar al usuario que la aplicación está trabajando en segundo plano.

// Agregar un indicador de fin de lista: Muestra un indicador visual cuando se llega al final de la lista de outfits para indicar que no hay más outfits disponibles.

// Agregar filtrado de outfits: Implementa la capacidad de filtrar los outfits por diferentes categorías o etiquetas para que los usuarios puedan explorar outfits específicos de su interés.

// Mejorar la experiencia de usuario al seleccionar un outfit: Además de simplemente mostrar el outfit seleccionado en un modal, considera implementar una vista más detallada del outfit, que muestre información adicional y permita al usuario interactuar con él de diversas formas.

// Agregar funcionalidad de búsqueda: Implementa una barra de búsqueda que permita a los usuarios buscar outfits por palabras clave o etiquetas relacionadas.

// Agregar acciones interactivas: Permite a los usuarios realizar acciones adicionales en los outfits, como dar "me gusta", compartir, guardar en una lista de favoritos, etc.

// Mejorar la accesibilidad: Asegúrate de que la aplicación sea accesible para usuarios con discapacidades visuales o de movilidad. Esto puede incluir el uso de etiquetas de accesibilidad, tamaños de fuente ajustables, controles de voz y más.