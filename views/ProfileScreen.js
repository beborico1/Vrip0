import { View, Text } from 'react-native'
import React from 'react'

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  )
}

export default ProfileScreen

// import React, { useContext, useEffect, useState } from 'react';
// import { auth, db, storage } from '../firebaseConfig';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { containerStyles, textStyles } from '../helpers/styles';
// import * as Localization from 'expo-localization';
// import translations from '../helpers/translations';
// import * as ImagePicker from 'expo-image-picker';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import colors from '../helpers/colors';
// import { Keyboard, TouchableWithoutFeedback, View, Text, ActivityIndicator, Dimensions, LogBox } from 'react-native';
// import Outfits from '../components/Outfits';
// import FeedHeader from '../components/FeedHeader';
// import OutfitModal from './modals/OutfitModal';
// import UserHeader from '../components/UserHeader';
// import { useLikes } from '../hooks/useLikes';
// //import { OutfitContext } from '../helpers/OutfitContext';

// LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

// const windowWidth = Dimensions.get('window').width;

// const ProfileScreen = () => {
//     const [formData, setFormData] = useState({});
    
//     const [image, setImage] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [hasChanges, setHasChanges] = useState(false);

//     const [selectedOutfit, setSelectedOutfit] = useState(null);
//     const [showOutfitModal, setShowOutfitModal] = useState(false);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [blockedUsers, setBlockedUsers] = useState([]);

//     const { likedOutfits, isLoadingOutfits, setLikedOutfits } =  useLikes();

//     const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
//     const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

//     const fetchUserDataFromFirebase = async () => {
//         try {
//             const userData = doc(db, "users", auth.currentUser.uid);
//             const userDoc = await getDoc(userData);

//             if (userDoc.exists()) {
//                 setFormData(userDoc.data());
//                 if (userDoc.data().blocked) {
//                     setBlockedUsers(userDoc.data().blocked);
//                 }
//                 setHasChanges(false);
//                 setImage(userDoc.data().profile_picture);
//             }

//         } catch (error) {
//             console.log("Error getting user data: ", error);
//             setError("Error getting user data: " + error);
//         }
//     };

//     const handleInputChange = (name, text) => {
//         if (name === 'username') {
//             text = text.toLowerCase().replace(/[^a-z0-9_.]/g, '');
//         }
//         setFormData({ ...formData, [name]: text });
//         if (text !== formData[name]) {
//             setHasChanges(true);
//         }
        
//     };

//     const handleSaveChanges = async () => {
//         try {
//             setIsLoading(true);
//             const userData = doc(db, "users", auth.currentUser.uid);
//             await updateDoc(userData, formData);
//             // Actualiza el estado del usuario después de guardar los cambios
//             setIsLoading(false);
//             setHasChanges(false);
//         } catch (error) {
//             setIsLoading(false);
//             console.log("Error updating user data: ", error);
//         }
//     };

//     const handleSelectProfilePicture = async () => {
//         try {
//             let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//             if (permissionResult.granted === false) {
//               alert(texts.permissionRequired);
//               return;
//             }
        
//             let pickerResult = await ImagePicker.launchImageLibraryAsync();
        
//             if (pickerResult.canceled === true) {
//               return;
//             }
        
//             setIsLoading(true);

//             const response = await fetch(pickerResult.assets[0].uri);
//             const blob = await response.blob();

//             // Create a reference to 'images/userID/profile-picture.jpg'
//             const storageRef = ref(storage, `images/${auth.currentUser.uid}/profile-picture.jpg`);
        
//             const uploadTask = uploadBytesResumable(storageRef, blob);
        
//             uploadTask.on('state_changed', 
//               (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log('Upload is ' + progress + '% done');
//               }, 
//               (error) => {
//                 console.log(error);
//               }, 
//               () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                   console.log('File available at', downloadURL);
//                   setImage(downloadURL);
//                   // You can also update the user data in Firestore here
//                   handleUpdateProfilePicture(downloadURL);
//                 });
//               }
//             );
//         } catch (error) {
//             setIsLoading(false);
//             console.log(error);
//         }
//       };
    
//       const handleUpdateProfilePicture = async (downloadURL) => {
//         try {
//           const userData = doc(db, "users", auth.currentUser.uid);
//           await updateDoc(userData, { profile_picture: downloadURL });
//           fetchUserDataFromFirebase(); // To refresh the data in the state
//           setIsLoading(false);
//         } catch (error) {
//           setIsLoading(false);
//           console.log("Error updating user data: ", error);
//         }
//       };
    
//     const onOutfitPress = (outfit) => {
//         console.log('outfit press', outfit);
//         setSelectedOutfit(outfit);
//         setShowOutfitModal(true);
//       };

//     const closeOutfitModal = () => {
//         setSelectedOutfit(null);
//         setShowOutfitModal(false);
//     };

//     useEffect(() => {
//         fetchUserDataFromFirebase();
//     }, []);

//     return (
//         <>
//         <OutfitModal
//             isVisible={showOutfitModal}
//             selectedOutfit={selectedOutfit}
//             closeOutfitModal={closeOutfitModal}
//             setErrorMessage={setErrorMessage}
//             setOutfits={setLikedOutfits}
//         /> 
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

//         <View style={{flex:1, justifyContent: 'flex-start'}}>

//             <UserHeader 
//                 handleSelectProfilePicture = {handleSelectProfilePicture}
//                 image = {image}
//                 formData = {formData}
//                 hasChanges = {hasChanges}
//                 isLoading = {isLoading}
//                 handleSaveChanges = {handleSaveChanges}
//                 handleInputChange = {handleInputChange}
//                 error = {error}
//             />
    
//             <FeedHeader title={texts.likedOutfits} />

//             {isLoadingOutfits ? (
//                 <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
//                     <ActivityIndicator size="large" color={colors.vrip} style={containerStyles.loadingIndicator} />
//                 </View>
//             ) : (
//                 likedOutfits.length == 0 ? (
//                     <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
//                         <Text style={[textStyles.label, {color: 'gray'}]}>{texts.noLikedOutfits}</Text>
//                     </View>
//                 ) : (
//                     <Outfits 
//                         outfits={likedOutfits} 
//                         onOutfitPress={onOutfitPress} 
//                         windowWidth={windowWidth} 
//                         blockedUsers={[]}
//                     />
//                 )
//             )}

//             {errorMessage && (
//                 <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
//                     <Text style={[textStyles.label, {color: 'red'}]}>{errorMessage}</Text>
//                 </View>
//             )}

//         </View>
//         </TouchableWithoutFeedback>
//         </>
//     )
// }

// export default ProfileScreen;