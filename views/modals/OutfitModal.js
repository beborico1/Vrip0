import { Animated, Dimensions, Image, Modal, TouchableOpacity, View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { buttonStyles, containerStyles } from '../../helpers/styles'
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { auth, db } from '../../firebaseConfig';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // Añadir esta línea para importar iconos
import { LanguageContext } from '../../helpers/LanguageContext';

const OutfitModal = ({outfit, isVisible, closeOutfitModal, handleFilterReport }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { texts } = useContext(LanguageContext);

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

          // Get the user document
          //const userDoc = doc(db, 'users', auth.currentUser.uid, 'views', outfit.id);

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
        console.log('Error updating likes: ', error);
      }
   }

   const handleDeletePress = async () => {
      try {
        // Get the like document
        const outfitDoc = doc(db, 'outfits', outfit.id);
        // Get the user document
        //const userDoc = doc(db, 'users', auth.currentUser.uid, 'outfits', outfit.id)
        // Update the like document

        await deleteDoc(outfitDoc);
        //await deleteDoc(userDoc);

        closeOutfitModal();
      } catch (error) {
        console.log('Error updating likes: ', error);
      }
    }

    const handleReportPress = async () => {
      try {
        // Get the outfit document
        const outfitDoc = doc(db, 'outfits', outfit.id);
        // Update the outfit document
        await setDoc(outfitDoc, { reported: true }, { merge: true });
        
        handleFilterReport();
        
        closeOutfitModal();
      } catch (error) {
        console.log('Error reporting outfit: ', error);
      }
    }


  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
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
          {outfit && 
            <View style={{}}>
              <View style={{ position: 'relative' }}>
                  <Image
                      style={[containerStyles.modalOutfitImage, { width: windowWidth * 0.8, height: (windowWidth * 0.8) / (2 / 3) }]}
                      source={{ uri: outfit.imageUrl }}
                  />

                  { auth.currentUser &&
                  <TouchableOpacity
                      style={{ position: 'absolute', bottom: 30, right: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 5, paddingHorizontal: 10 }} 
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

              {outfit.description && 
                <Text style={{ color: 'white', fontSize: 18, width: windowWidth * 0.8, textAlign: 'center', marginBottom: 20}}>
                  {outfit.description} 
                </Text>
              }

              {auth.currentUser && (outfit.postedBy === auth.currentUser.uid ? 
                <TouchableOpacity onPress = {handleDeletePress} style={[buttonStyles.greenButton, {backgroundColor: 'red', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                    <Text style={[buttonStyles.greenButtonText, {marginLeft: 20}]}>
                      {texts.delete}
                    </Text>
                </TouchableOpacity> : 
                <TouchableOpacity onPress = {handleReportPress} style={[buttonStyles.greenButton, {backgroundColor: 'red', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="flag" size={24} color="#fff" />
                  <Text style={[buttonStyles.greenButtonText, {marginLeft: 20}]}>
                    {texts.report}
                  </Text>
                </TouchableOpacity>
                )
              }

            </View>

          }
        </Animated.View>
      </PanGestureHandler>

    </Modal>
  )
}

export default OutfitModal

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