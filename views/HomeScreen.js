import { View, Text } from 'react-native'
import React from 'react'
import FeedHeader from '../components/FeedHeader'
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';

const HomeScreen = () => {
  const windowWidth = useWindowDimensions().width;

  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  return (
    <View>
      <FeedHeader title = {texts.communityOutfits} />
      
      <Outfits 
        outfits={[]} 
        onOutfitPress={() => console.log("outfit press")} 
        windowWidth={windowWidth} 
        blockedUsers={[]}
      />
    </View>
  )
}

export default HomeScreen

// import React, { useState, useCallback, useContext } from 'react';
// import {
//   View,
//   useWindowDimensions,
//   Text,
//   ActivityIndicator,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import * as Localization from 'expo-localization';
// import translations from '../helpers/translations';
// import FeedHeader from '../components/FeedHeader';
// import Outfits from '../components/Outfits';
// import OutfitModal from './modals/OutfitModal';
// import WelcomeModal from './modals/WelcomeModal';
// import { containerStyles, textStyles } from '../helpers/styles';
// import colors from '../helpers/colors';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import * as SecureStore from 'expo-secure-store';
// import useOutfits from '../hooks/useOutfits';
// import { OutfitContext } from '../helpers/OutfitContext';

// const HomeScreen = () => {
//   const windowWidth = useWindowDimensions().width;
//   const [showWelcomeModal, setShowWelcomeModal] = useState(false);
//   const [selectedOutfit, setSelectedOutfit] = useState(null);
//   const [showOutfitModal, setShowOutfitModal] = useState(false);

//   const { outfits, setOutfits, setErrorMessageLoadingOutfits, errorMessageLoadingOutfits, loadingOutfits, refreshOutfits } = useOutfits();
//   const { setRefreshOutfits} = useContext(OutfitContext);

//   const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
//   const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

//   const onOutfitPress = (outfit) => {
//     console.log('outfit press', outfit);
//     setSelectedOutfit(outfit);
//     setShowOutfitModal(true);
//   };

//   const closeOutfitModal = () => {
//     setSelectedOutfit(null);
//     setShowOutfitModal(false);
//   };

//   const closeWelcomeModal = () => {
//     setShowWelcomeModal(false);
//   };

//   // Función para recuperar el estado de 'firstLaunch' del almacenamiento
//   const getFirstLaunch = async () => {
//     try {
//       const value = await SecureStore.getItemAsync('alreadyLaunched');
//       if (value == null) {
//         // Si es la primera vez que se lanza, almacenamos la información y mostramos el modal
//         await SecureStore.setItemAsync('alreadyLaunched', 'true');
//         setShowWelcomeModal(true);
//       }
//     } catch (error) {
//       // Manejo de errores
//       console.error(error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       getFirstLaunch();
//       setRefreshOutfits(refreshOutfits);
//     }, [])
//   );

//   return (
//     <>
//       <OutfitModal
//           isVisible={showOutfitModal}
//           selectedOutfit={selectedOutfit}
//           closeOutfitModal={closeOutfitModal}
//           setErrorMessage={setErrorMessageLoadingOutfits}
//           setOutfits={setOutfits}
//       /> 

//       <WelcomeModal 
//         isVisible={showWelcomeModal} 
//         closeWelcomeModal={closeWelcomeModal} 
//       />

//       {errorMessageLoadingOutfits && (
//         <TouchableOpacity style={containerStyles.errorContainer} onPress={() => setErrorMessageLoadingOutfits(null)}>
//           <Text style={textStyles.errorText}>x {errorMessageLoadingOutfits}</Text>
//         </TouchableOpacity>
//       )}

//       <View style={containerStyles.container}>
//         <FeedHeader title = {texts.communityOutfits} />
//         {loadingOutfits ? (
//           <View style={containerStyles.container}>
//             <ActivityIndicator size="large" color={ colors.vrip } style={containerStyles.loadingIndicator} />
//           </View>
//         ) : (
//           !showWelcomeModal ? (
//             <Outfits 
//               outfits={outfits} 
//               onOutfitPress={onOutfitPress} 
//               windowWidth={windowWidth} 
//               blockedUsers={[]}
//             />
//           ) : (
//             <View style={containerStyles.container}></View>
//           )
//         )}
//       </View>
//     </>
//     );
//   };
    
// export default HomeScreen;
