import { View, Image, TouchableOpacity, TextInput, Text, ActivityIndicator, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebaseConfig'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Alert } from 'react-native';
import { storage } from '../firebaseConfig';
import { LanguageContext } from '../helpers/LanguageContext';
import { textStyles } from '../helpers/styles';
import colors from '../helpers/colors';

const UserHeader = () => {
    const [originalUserDoc, setOriginalUserDoc] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    const { texts } = React.useContext(LanguageContext);

    const pickImageHelper = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.5,
      });
  
      if (!result.canceled) {
        console.log(result);
        if (result.assets[0].type === 'video') { // Verificar el tipo de archivo
          Alert.alert('Error', texts.onlyPhotosAllowed);
          return; // Salir de la función si es un video
        }

        setUserDoc({ ...userDoc, profile_picture: result.assets[0].uri });
        setHasChanges(true);
      }
    };

    const uploadImage = async (uri) => {
      setLoading(true);
      let blob;
      try {
        const response = await fetch(uri);
        blob = await response.blob();

        if (!auth.currentUser) {
          console.log('No user is signed in');
          setLoading(false);
          return;
        }

        const uid = auth.currentUser.uid;
        const uploadRef = ref(storage, `users/profile_pictures/${uid}/${Date.now()}`);
        const uploadTask = uploadBytesResumable(uploadRef, blob);

        uploadTask.on('state_changed', 
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
            progress = Math.round(progress * 100);
            console.log('Upload is ' + progress + '% done');
            setUploadProgress(progress);
            setLoading(true);
          }, 
          (error) => {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", texts.uploadError);
          }, 
          async () => {
            getDownloadURL(uploadRef).then( async (downloadURL) => {
              console.log('File available at', downloadURL);
              const userDocRef = doc(db, 'users', uid);
              await updateDoc(userDocRef, { profile_picture: downloadURL });
              setUserDoc({ ...userDoc, profile_picture: downloadURL });
              setUploadProgress(0); // reset progress after upload
              setLoading(false);
            }).catch(error => {
              console.log(error);
              setLoading(false);
              Alert.alert("Error", texts.uploadError);
            });
          }
        );

        blob = null; // Clean up blob resource
      } catch (error) {
        console.log(error);
        Alert.alert("Error", texts.uploadError);
        blob = null;
      }
    };

    const getUserDoc = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      
      if (userDoc.exists()) {
        console.log(userDoc.data());
        setUserDoc({ ...userDoc.data(), id: userDoc.id });
        setOriginalUserDoc({ ...userDoc.data(), id: userDoc.id });
        //setImage(userDoc.data().profile_picture);
      } else {
        console.log("No such document!");
      }
    };

    const handleInputChange = async (field, value) => {
      if (field === 'username') {
        value = value.replace(/\s/g, ''); // Eliminar espacios en blanco
        value = value.replace(/[^\w\s]/gi, ''); // esto eliminara todos los caracteres especiales como tildes, ñ, etc.
        value = value.replace(/@/gi, ''); // eliminar @, gi significa global y case insensitive
      }

      setUserDoc({ ...userDoc, [field]: value });
      if (value !== originalUserDoc[field]) {
        setHasChanges(true);
      }
    };

    const handleSaveChanges = async () => {
      if (!auth.currentUser) {
        console.log('No user is signed in');
        return;
      }

      if (loading) {
        return;
      }

      setLoading(true);

      if (userDoc.username !== originalUserDoc.username) {
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', userDoc.username)));
        if (querySnapshot.size > 0) {
          Alert.alert('Error', texts.usernameAlreadyInUse);
          setLoading(false);
          return;
        }

        if (userDoc.username.length === 0) {
          Alert.alert('Error', texts.usernameCannotBeEmpty);
          setLoading(false);
          return;
        }
      }


      Keyboard.dismiss();

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { ...userDoc });
      setOriginalUserDoc({ ...userDoc });
      if (userDoc.profile_picture !== originalUserDoc.profile_picture) {
        await uploadImage(userDoc.profile_picture).then(() => {
          setHasChanges(false);
          setLoading(false);
        });
      } else {
        setHasChanges(false);
        setLoading(false);
      } 
    };


    useEffect(() => {
        getUserDoc();
    }, []);   
      
    if (!userDoc) {
      return null;
    }

    return (
      <View
        style={{
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >
            <TouchableOpacity onPress={pickImageHelper}>
              <Image source={userDoc.profile_picture ? { uri: userDoc.profile_picture } : require('../assets/default-profile-picture.png')} style={{ width: 90, height: 90, borderRadius: 60, backgroundColor: userDoc.profile_picture ? 'lightgray' : 'white'}} />
            </TouchableOpacity>

            <View style={{ flex:1, marginLeft: 20, paddingTop: 5 }}>
               <TextInput
                   placeholder={texts.enterYourName}
                   value={userDoc.name}
                   onChangeText={text => handleInputChange('name', text)}
                   style={textStyles.boldLabel}
                   autoCapitalize='words'
               />
               <View style={{flexDirection: 'row'}}>
                   <Text style = {userDoc.username ? {...textStyles.label, color: 'gray'} : {...textStyles.label, color: 'lightgray'}}>@</Text>
                   <TextInput
                       placeholder={texts.enterYourUsername}
                       value={userDoc.username}
                       onChangeText={text => handleInputChange('username', text)}
                       style={{...textStyles.label, color: 'gray', paddingBottom: 10}}
                       autoCapitalize="none"
                   />
               </View>

               <TextInput
                   placeholder={texts.enterPresentation}
                   value={userDoc.presentation}
                   onChangeText={text => handleInputChange('presentation', text)}
                   multiline
                   numberOfLines={4}
                   autoGrow
                   autoCorrect={false}
                   spellCheck={false}
                   style={{...textStyles.label}}                  
               />

            </View>
          </View>

          { hasChanges && ( !loading ? 
            <>
              <TouchableOpacity onPress={handleSaveChanges}>
                  <Text style={[textStyles.greenLabel, {width: '100%', textAlign: 'center', paddingTop: 0}]}>
                    {texts.saveChanges}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setUserDoc({ ...originalUserDoc });
                Keyboard.dismiss();
                setHasChanges(false);
              }}>
                  <Text style={{width: '100%', textAlign: 'center', paddingTop: 10, paddingBottom: 20, color: "red", fontSize: 14, fontWeight: "600"}}>
                    {texts.cancelChanges}
                  </Text>
              </TouchableOpacity>
            </>
             : 
             <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 20}}>
              <ActivityIndicator size="large" color={colors.vrip}/>
             </View>
          )}
        </View>
    )
}

export default UserHeader

// import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native'
// import React from 'react'
// import { TextInput } from 'react-native-gesture-handler'
// import { textStyles } from '../helpers/styles'
// import * as Localization from 'expo-localization';
// import translations from '../helpers/translations';
// import colors from '../helpers/colors';

// const windowWidth = Dimensions.get('window').width;

// const UserHeader = ({ handleSelectProfilePicture, image, formData, hasChanges, handleInputChange, handleSaveChanges, isLoading, error }) => {

//     const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
//     const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

//   return (
//     <View style={{backgroundColor: 'white', width: windowWidth, padding: 10, paddingBottom: 40}}>
//         <View style= {{ flexDirection: 'row', paddingHorizontal: 10}}>
//             <TouchableOpacity onPress={handleSelectProfilePicture}>
//                 <Image source={image ? { uri: image } : require('../assets/default-profile-picture.png')} style={{ width: 90, height: 90, borderRadius: 60, backgroundColor: 'gray' }} />
//             </TouchableOpacity>
            
//             <View style={{ flex:1, marginLeft: 20, paddingTop: 5 }}>
//                 <TextInput
//                     placeholder={texts.enterYourName}
//                     value={formData.name}
//                     onChangeText={text => handleInputChange('name', text)}
//                     style={textStyles.boldLabel}
//                 />
//                 <View style={{flexDirection: 'row'}}>
//                     <Text style = {formData.username ? {...textStyles.label, color: 'gray'} : {...textStyles.label, color: 'lightgray'}}>@</Text>
//                     <TextInput
//                         placeholder={texts.enterYourUsername}
//                         value={formData.username}
//                         onChangeText={text => handleInputChange('username', text)}
//                         style={{...textStyles.label, color: 'gray', paddingBottom: 10}}
//                     />
//                 </View>


//             </View>
//         </View>

//         { hasChanges && (
//             <TouchableOpacity onPress={handleSaveChanges}>
//                 <Text style={[textStyles.greenLabel, {width: '100%', textAlign: 'center', paddingVertical: 20}]}>Guardar Cambios</Text>
//             </TouchableOpacity> 
//         ) }

//         {isLoading && (
//             <ActivityIndicator size="large" color={colors.vrip}/>
//         )}

//         {error && (
//             <Text style={{color: 'red'}}>{error}</Text>
//         )}
//     </View>
//   )
// }

// export default UserHeader

// // Mejora el diseño y la distribución de elementos: Ajusta el diseño y la distribución de los elementos para mejorar la legibilidad y la estética general. Por ejemplo, puedes ajustar los márgenes, el espaciado y la alineación para lograr un aspecto más equilibrado y armonioso.

// // Agrega retroalimentación visual para los cambios guardados: Después de que el usuario guarde los cambios, considera agregar una retroalimentación visual, como un mensaje emergente o un cambio de color en el botón "Guardar cambios", para indicar que los cambios se han guardado exitosamente. Esto proporcionará una confirmación clara al usuario.

// // Optimización de rendimiento: Si el componente experimenta un rendimiento lento debido a la carga de imágenes o procesamiento de datos, considera implementar técnicas de optimización, como la carga diferida de imágenes o la paginación de datos, para mejorar la velocidad y la capacidad de respuesta.
