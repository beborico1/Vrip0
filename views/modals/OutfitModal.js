import React, { useContext, useEffect, useState }  from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { View, Modal, TouchableOpacity, Dimensions, Text, Animated, Image } from 'react-native';
import * as Localization from 'expo-localization';
import translations from '../../helpers/translations';
import { auth, db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Añadir esta línea para importar iconos
import { arrayUnion, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { buttonStyles, containerStyles, textStyles } from '../../helpers/styles';
import { OutfitContext } from '../../helpers/OutfitContext';

const OutfitModal = ({
  isVisible,
  selectedOutfit,
  closeOutfitModal,
  setOutfits,
  setErrorMessage,
}) => {

  const { refreshOutfits } = useContext(OutfitContext);


  const blockAndFilterUser = async () => {
    const userIdToBlock = selectedOutfit.postedBy;
    try {
      // 1. Update the user document in Firestore to add the blocked user to the blocked list
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      
      await setDoc(userDoc, {
        blocked: arrayUnion(userIdToBlock)
      }, { merge: true })

      // 2. Filter out the outfits from the blocked user
      setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.postedBy !== userIdToBlock));

      closeOutfitModal();

      console.log('User blocked:', userIdToBlock);
    } catch (error) {
      setErrorMessage(texts.errorBlockingUser);
      closeOutfitModal();
      console.error('Error blocking user:', error);
      
    }
  };

  const reportAndFilterOutfit = async () => {
    if (refreshOutfits) {
      refreshOutfits();
    }
    return;
    
    try {
      // 1. Update the outfit document in Firestore to mark it as reported
      const outfitIdToReport = selectedOutfit.id;
      const outfitDoc = doc(db, 'outfits', outfitIdToReport);
      await setDoc(outfitDoc, {
        reported: true
      }, { merge: true });
  
      // 2. Filter out the reported outfit
      setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== outfitIdToReport));

      closeOutfitModal();
  
      console.log('Outfit reported:', outfitIdToReport);
    } catch (error) {
      console.error('Error reporting outfit:', error);
    }
  }; 

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!auth.currentUser) {
        return;
      }

      try {
        if (selectedOutfit) {
          // Get the user's like document
          const likeDoc = doc(db, 'outfits', selectedOutfit.id, 'likes', auth.currentUser.uid);
          // Get the document
          const likeDocSnapshot = await getDoc(likeDoc);
          
          // If the document exists
          const userHasLiked = likeDocSnapshot.exists();
          
          // Update likes state
          setLiked(userHasLiked);
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
        if (selectedOutfit) {
          // Get the user's view document
          const viewDoc = doc(db, 'outfits', selectedOutfit.id, 'views', auth.currentUser.uid);
          // Get the document
          const viewDocSnapshot = await getDoc(viewDoc);

          // Get the user document
          const userDoc = doc(db, 'users', auth.currentUser.uid, 'views', selectedOutfit.id);

          // If the document doesn't exist
          if (!viewDocSnapshot.exists()) {
            // Create the document
            await setDoc(viewDoc, { viewed: true });
            await setDoc(userDoc, { viewed: true });
          }
        }
      } catch (error) {
        console.log('Error registering view: ', error);
      }
    };

    fetchLikes();
    registerView();
  }, [selectedOutfit]);  

  const handleLikePress = async () => {

    try {
      // Get the like document
      const likeDoc = doc(db, 'outfits', selectedOutfit.id, 'likes', auth.currentUser.uid);
      // Get the user document
      const userDoc = doc(db, 'users', auth.currentUser.uid, 'likes', selectedOutfit.id);

      // Update the like document
      if (liked) {
        await deleteDoc(likeDoc);
        await deleteDoc(userDoc);
        setLiked(false)
      } else {
        await setDoc(likeDoc, { liked: true });
        await setDoc(userDoc, { liked: true });
        setLiked(true)
      }
    } catch (error) {
      console.log('Error updating likes: ', error);
    }
  };
  
  
  const windowWidth = Dimensions.get('window').width;
  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  // Crear una nueva instancia de Animated.Value para el desplazamiento en Y
  const translateY = new Animated.Value(0);

  // Manejar el gesto de desplazamiento
  const onGestureEvent = Animated.event([{ nativeEvent: { translationY: translateY } }], { useNativeDriver: true });

  // Manejar el final del gesto de desplazamiento
  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Si el desplazamiento en Y es mayor que 50, cerrar el modal
      if (nativeEvent.translationY > 50) {
        closeOutfitModal();
      }
    }
  };

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
          <View style={containerStyles.modalView}>

            {selectedOutfit && (
              <View style={{ position: 'relative' }}>
                  <Image
                      style={[containerStyles.modalOutfitImage, { width: windowWidth * 0.8, height: (windowWidth * 0.8) / (2 / 3) }]}
                      source={{ uri: selectedOutfit.imageUrl }}
                  />
                  { auth.currentUser &&
                  <TouchableOpacity 
                      style={{ position: 'absolute', bottom: 25, right: 10 }} 
                      onPress={handleLikePress}
                  >
                      <Ionicons 
                          name={ liked ? "heart" : "heart-outline" } 
                          size={30} 
                          color={ liked ? "red" : "white" } 
                      />
                  </TouchableOpacity>
                  }
              </View>
            )}

            <TouchableOpacity style={buttonStyles.modalCloseButton} onPress={closeOutfitModal}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[buttonStyles.greenButton, { backgroundColor: 'red', flexDirection: 'row' }]} onPress={reportAndFilterOutfit}>
                <Text style={[textStyles.boldLabel, { color: 'white', marginRight: 5 }]}>{texts.report}</Text>
                <Ionicons name="flag" size={24} color="#fff" />
              </TouchableOpacity>
              {auth.currentUser && (
                <TouchableOpacity
                  style={[buttonStyles.greenButton, { backgroundColor: 'red', marginLeft: 10, flexDirection: 'row' }]}
                  onPress={blockAndFilterUser}
                >
                  <Text style={[textStyles.boldLabel, { color: 'white', marginRight: 5 }]}>{texts.block}</Text>
                  <Ionicons name="md-close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};



export default OutfitModal;
