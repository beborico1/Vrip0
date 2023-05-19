import { View, StyleSheet, Image, ScrollView, useWindowDimensions, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FieldValue, collection, doc, getDoc, getDocs, orderBy, query, setDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';

const HomeView = () => {
  const [outfits, setOutfits] = useState([]); // State to store the retrieved outfits
  const windowWidth = useWindowDimensions().width;
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null); // Nuevo estado para almacenar el outfit seleccionado
  const [showOutfitModal, setShowOutfitModal] = useState(false); // Nuevo estado para controlar la visibilidad del modal
  const [showFeed, setShowFeed] = useState(true); // Nuevo estado para controlar la visibilidad del modal
  const [outfitsLoaded, setOutfitsLoaded] = useState(false); // Nuevo estado para controlar la visibilidad del modal

  // Función para manejar el evento onPress del TouchableOpacity
  const onOutfitPress = (outfit) => {
    setSelectedOutfit(outfit);
    setShowOutfitModal(true);
  };

  // Función para cerrar el modal
  const closeOutfitModal = () => {
    setSelectedOutfit(null);
    setShowOutfitModal(false);
  };

  const reportPost = async () => {
    if (!selectedOutfit) {
      console.log("No outfit selected to report");
      return;
    }
  
    try {
      const outfitDoc = doc(db, "outfits", selectedOutfit.id);
      await setDoc(outfitDoc, { reported: true }, { merge: true });
      console.log("Outfit reported");
  
      // Filtrar el arreglo 'outfits' para excluir el outfit seleccionado
      const filteredOutfits = outfits.filter(outfit => outfit.id !== selectedOutfit.id);
      setOutfits(filteredOutfits); // Actualizar el estado 'outfits' con el nuevo arreglo filtrado
  
      // Cerrar el modal después de reportar el outfit
      closeOutfitModal();
  
    } catch (error) {
      console.log("Error reporting outfit:", error);
    }
  };

  const blockUser = async () => {
    console.log("Block user");
    const otherUserId = selectedOutfit.postedBy;
    const userId = auth.currentUser.uid;

    if (!otherUserId) {
      console.log("No user ID found for this post");
      return;
    }

    try {
      const userDoc = doc(db, "users", userId);
      console.log("User doc:", userDoc); // Imprimir el documento del usuario actual
      console.log("Other user id" , otherUserId)
      console.log(setDoc)
      await setDoc(userDoc, { blocked: arrayUnion(otherUserId) }, { merge: true });
      console.log("User blocked");

      // Filtrar el arreglo 'outfits' para excluir los outfits del usuario bloqueado
      const filteredOutfits = outfits.filter(outfit => outfit.postedBy !== userId);
      setOutfits(filteredOutfits); // Actualizar el estado 'outfits' con el nuevo arreglo filtrado

      // Cerrar el modal después de bloquear al usuario
      closeOutfitModal();

    }
    catch (error) {
      console.log("Error blocking user:", error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const getOutfits = async () => {
        setOutfitsLoaded(false); // Set the loading state to true
        setOutfits([]); // Clear the outfits array before retrieving new outfits
        const outfitsRef = collection(db, 'outfits'); // Reference to the 'outfits' collection
        try {
          const q = query(
            outfitsRef,
            orderBy('timestamp', 'desc') // Construct the query to order by timestamp in descending order
          );
          const snapshot = await getDocs(q); // Get all documents in the 'outfits' collection with the query applied
          const outfitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the data and IDs of each document to an array
          
          // Filtrar los datos para obtener sólo los documentos donde 'reported' es diferente de 'true'
          const filteredOutfits = outfitsData.filter(outfit => outfit.reported !== true);

          if (auth.currentUser) {
            // Filtrar los datos para obtener sólo los documentos donde 'postedBy' no está en el arreglo 'blocked' del usuario actual
            const userId = auth.currentUser.uid;
            const userDoc = doc(db, "users", userId);
            const userDocSnapshot = await getDoc(userDoc);
            const blockedUsers = userDocSnapshot.data()?.blocked || [];

            const filteredOutfits2 = filteredOutfits.filter(outfit => !blockedUsers.includes(outfit.postedBy));

            setOutfits(filteredOutfits2); // Set the retrieved outfits to state
          } else {
            console.log('No user signed in');
            setOutfits(filteredOutfits); // Set the retrieved outfits to state
          }
          setOutfitsLoaded(true); // Set the loading state to false
        } catch (error) {
          console.log('Error retrieving outfits:', error);
        }
      };  

          const checkWelcome = async () => {
            try {
              const hasSeenWelcome = await SecureStore.getItemAsync('hasSeenWelcome');
              if (hasSeenWelcome === null) {
                setShowWelcomeModal(true);
                setShowFeed(false);
              }
            } catch (error) {
              console.log('Error checking welcome status:', error);
            }
          };          
          
        checkWelcome();
        getOutfits();
    }, [])
  );

  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  const closeWelcomeModal = async () => {
    try {
      await SecureStore.setItemAsync('hasSeenWelcome', 'true');
      setShowWelcomeModal(false);
      setShowFeed(true);
    } catch (error) {
      console.log('Error setting welcome status:', error);
    }
  };
  
  
  return (
    <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={showOutfitModal}>
        <View style={styles.modalView}>
          {selectedOutfit && (
            <Image
              style={[styles.modalOutfitImage, { width: windowWidth * 0.8, height: (windowWidth * 0.8) / (2 / 3) }]}
              source={{ uri: selectedOutfit.imageUrl }}
            />
          )}
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeOutfitModal}>
            <Text style={styles.modalCloseButtonText}>{texts.close}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={[styles.modalCloseButton,{backgroundColor: 'red'}]} onPress={reportPost}>
              <Text style={styles.modalCloseButtonText}>{texts.report}</Text>
            </TouchableOpacity>
            { auth.currentUser && (
              <TouchableOpacity style={[styles.modalCloseButton,{backgroundColor: 'red', marginLeft: 10}]} onPress={blockUser}>
                <Text style={styles.modalCloseButtonText}>{texts.block}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={showWelcomeModal}>
    <View style={[styles.modalView,{paddingTop:70,paddingBottom: 70, paddingLeft:50, paddingRight: 50}]}>
      <Text style={styles.modalText}>{texts.welcomeToVrip}</Text>
      <Text style={styles.modalDescription}>
        {texts.description}
      </Text>
      <Text style={styles.modalDescription}>
        {texts.termsTitle}
      </Text>
      <ScrollView style={styles.termsContainer}>
        <Text style={styles.termsText}>
          {texts.terms}
        </Text>
       </ScrollView>
      <TouchableOpacity style={styles.modalButton} onPress={closeWelcomeModal}>
        <Text style={styles.modalButtonText}>
          {texts.understood}
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
  {showFeed && (!outfitsLoaded ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{texts.loadingOutfits}</Text>
        </View>
      ) : (
        <>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{texts.communityOutfits}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {outfits.map(outfit => (
            <TouchableOpacity key={outfit.id} onPress={() => onOutfitPress(outfit)}>
              <Image key={outfit.id} style={[styles.outfitImage, { width: windowWidth/3 , height: (windowWidth/3)/(2/3) }]} source={{ uri: outfit.imageUrl }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        </>
      )
  )}

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 100,
      height: 100,
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start', // Agregar esta propiedad para alinear las imágenes a la izquierda
        // paddingTop: 20,
    },
    outfitImage: {
      resizeMode: 'cover',
      backgroundColor: '#f5f5f5',
      borderWidth: 1, // Ancho del contorno en píxeles
      borderColor: 'lightgray', // Color del contorno, en este caso, negro
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: 'lightgray',
      fontSize: 18,
      fontWeight: 'medium',
    },
    modalView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalText: {
      color: '#fff',
      fontSize: 24,
      marginBottom: 20,
    },
    modalButton: {
      backgroundColor: '#32CD32',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    modalDescription: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 30,
      textAlign: 'center',
      paddingHorizontal: 10, // Para agregar un poco de espacio a los lados del texto
    },
    labelContainer: {
      borderRadius: 5,
      marginTop: 25,
      marginBottom: 25,
    },
    labelText: {
      color: 'gray',
      fontSize: 16,
      fontWeight: 'normal',
    },
    modalOutfitImage: {
      resizeMode: 'cover',
      backgroundColor: '#f5f5f5',
      borderWidth: 1,
      borderColor: 'lightgray',
    },
    modalCloseButton: {
      backgroundColor: '#32CD32',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    modalCloseButtonText: {
      color: '#fff',
      fontSize: 18,
      
    },
    termsContainer: {
      flex: 1,
      marginBottom: 20,
    },
    termsText: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'justify',
      color: 'white',
    },
});

export default HomeView
