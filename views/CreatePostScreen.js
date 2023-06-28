import React, { useContext, useState } from 'react';
import { Image, View, TextInput, Alert, Text, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Button, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { buttonStyles, containerStyles, inputStyles } from '../helpers/styles';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../helpers/LanguageContext';
import * as Progress from 'react-native-progress';
import colors from '../helpers/colors';
import { ImageManipulator } from 'expo-image-crop'

export default function CreatePostScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const navigation = useNavigation();

  const { texts } = useContext(LanguageContext);

  const pickImageHelper = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      // Verificar el tipo de archivo
      if (result.assets[0].type === 'video') {
        Alert.alert('Error', texts.onlyPhotosAllowed);
        return; // Salir de la función si es un video
      }

      setImage(result.assets[0].uri);
      //setIsVisible(true);
    }
  };

  const onPictureChoosed = ({ uri }) => {
    setImage(uri);
    setIsVisible(false);
    //uploadImage(uri);
    //setEditImage(false); // Restablecer el estado de edición de la imagen después de editarla
  }

  const uploadImage = async (uri) => {
    let blob;
    try {
      const response = await fetch(uri);
      blob = await response.blob();

      if (!auth.currentUser) {
        return;
      }

      const uid = auth.currentUser.uid;
      const uploadRef = ref(storage, `outfits/${uid}/${Date.now()}`);
      const uploadTask = uploadBytesResumable(uploadRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
          progress = Math.round(progress * 100);
          console.log('Upload is ' + progress + '% done');
          setUploadProgress(progress);
        }, 
        (error) => {
          console.log(error);
          Alert.alert("Error", texts.uploadError);
        }, 
        async () => {
          getDownloadURL(uploadRef).then( async (downloadURL) => {
            console.log('File available at', downloadURL);
            setImage(downloadURL);
            const postsCollection = collection(db, 'outfits');
            await addDoc(postsCollection, {
              imageUrl: downloadURL,
              description: description,
              likeCount: 0,
              viewCount: 0,
              postedBy: uid,
              reported: false,
              createdAt: serverTimestamp(),
            });
            setUploadProgress(0); // reset progress after upload
            setImage(null); // Reset image and description state
            setDescription(""); // Reset image and description state
            navigation.navigate("Home"); // Navigate to Home screen
          }).catch(error => {
            console.log(error);
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={containerStyles.container}>
        <View style={containerStyles.container}>
          {!image ? 
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImageHelper}>
              <Text style={styles.imagePlaceholderText}>+</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={pickImageHelper}>
              <Image source={{ uri: image }} style={{ width: 200, height: 300, marginBottom: 10 }} />
            </TouchableOpacity>
          }

          {image && // Solo mostrar el botón de editar imagen si una imagen ha sido seleccionada
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Text style={{color: colors.vrip, fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>
                  {texts.editImage}
              </Text>
            </TouchableOpacity>
          }

          <TextInput
            style={inputStyles.detailInput}
            onChangeText={setDescription}
            value={description}
            placeholder={texts.addDescription}
          />

          {uploadProgress > 0 &&
            <Progress.Bar 
              progress={uploadProgress / 100} 
              width={200} 
              color={colors.vrip}
              style={{marginVertical: 20}} 
            />
          }

          {image && (
            <ImageManipulator
              photo={{ uri: image }}
              isVisible={isVisible}
              onPictureChoosed={onPictureChoosed}
              onToggleModal={() => setIsVisible(false)}
            />
          )}

          <TouchableOpacity style={buttonStyles.greenButton} onPress={() => uploadImage(image)} disabled={uploadProgress > 0}>
            {uploadProgress > 0 ? 
                <ActivityIndicator color="white" />
                    :
                <Text style={buttonStyles.greenButtonText}>
                    {texts.uploadOutfit}
                </Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    imagePlaceholder: {
      width: 200,
      height: 300,
      backgroundColor: 'lightgrey',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    imagePlaceholderText: {
      color: 'white',
      fontWeight: '400',
      fontSize: 80, // Adjust this size as needed
    },
});


// import React, { useContext, useState } from 'react';
// import { Image, View, TextInput, Alert, Text, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { auth, db, storage } from '../firebaseConfig';
// import { buttonStyles, containerStyles, inputStyles } from '../helpers/styles';
// import { useNavigation } from '@react-navigation/native';
// import { LanguageContext } from '../helpers/LanguageContext';
// import * as Progress from 'react-native-progress';
// import colors from '../helpers/colors';
// import * as ImageManipulator from 'expo-image-manipulator';

// export default function CreatePostScreen() {
//   const [image, setImage] = useState(null);
//   const [description, setDescription] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [currentAsset, setCurrentAsset] = useState(null);

//   const navigation = useNavigation();

//   const { texts } = useContext(LanguageContext);

//   const processImage = async (pickedImage) => {
//     const manipResult = await ImageManipulator.manipulateAsync(
//       pickedImage.uri,
//       [
//         {
//           crop: {
//             originX: 0,
//             originY: 0,
//             width: pickedImage.width,
//             height: Math.floor((2 / 3) * pickedImage.width),  // Ensure aspect ratio is 2:3
//           },
//         },
//       ],
//       { compress: 1, format: ImageManipulator.SaveFormat.PNG }
//     );
//     setImage(manipResult.uri);
//     setCurrentAsset(manipResult);
//   };

//   const pickImageHelper = async () => {   // Helper function for picking an image
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: false,
//       aspect: [2, 3],
//       quality: 0.5,
//     });

//     if (result.canceled) {
//       setImage(null); 
//       setCurrentAsset(null);
//       setDescription("");
//     } else {
//       await processImage(result.assets[0]);
//     }

//     // let result = await ImagePicker.launchImageLibraryAsync({
//       // mediaTypes: ImagePicker.MediaTypeOptions.All,
//       // allowsEditing: false,
//       // aspect: [2, 3],
//       // quality: 0.5,
//     // });
// // 
//     // if (result.canceled) {
//       // setImage(null); // The user cancelled image selection, reset relevant states
//       // setCurrentAsset(null);
//       // setDescription("");
//     // } else {
//       // setImage(result.assets[0].uri);
//       // setCurrentAsset(result.assets[0]);
//     // }
//   };

//   const uploadImageHelper = async (blob) => { // Helper function for uploading an image
//     const uid = auth.currentUser.uid;
//     const uploadRef = ref(storage, `outfits/${uid}/${Date.now()}`);
//     const uploadTask = uploadBytesResumable(uploadRef, blob);

//     uploadTask.on('state_changed', 
//       (snapshot) => {
//         let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
//         progress = Math.round(progress * 100);
//         console.log('Upload is ' + progress + '% done');
//         setUploadProgress(progress);
//       }, 
//       (error) => {
//         console.log(error);
//         Alert.alert("Error", texts.uploadError);
//       }, 
//       async () => {
//         getDownloadURL(uploadRef).then( async (downloadURL) => {
//           console.log('File available at', downloadURL);
//           setImage(downloadURL);
//           const postsCollection = collection(db, 'outfits');
//           await addDoc(postsCollection, {
//             imageUrl: downloadURL,
//             description: description,
//             likeCount: 0,
//             viewCount: 0,
//             postedBy: uid,
//             reported: false,
//             createdAt: serverTimestamp(),
//           });
//           setUploadProgress(0); // reset progress after upload
//           setCurrentAsset(null); // Reset currentAsset state
//           setImage(null); // Reset image and description state
//           setDescription(""); // Reset image and description state
//           navigation.navigate("Home"); // Navigate to Home screen
//         }).catch(error => {
//           console.log(error);
//           Alert.alert("Error", texts.uploadError);
//         });
//       }
//     );
//   };

//   const pickImage = async () => {   // Functions called from the component
//      try {
//        await pickImageHelper();
//      } catch (error) {
//        console.log(error);
//        Alert.alert("Error", texts.imagePickerError);
//      }
//   };

//   const uploadImage = async () => {
//     if (!currentAsset) { // Validation: Ensure an image has been picked and a description entered
//       Alert.alert("Error", texts.imageNotSelected);
//       return;
//     }

//     let blob;
//     try {
//       const response = await fetch(currentAsset.uri);
//       blob = await response.blob();

//       // Resize image using Resizer library from 'react-native-image-resizer' or from Expo SDK
//       // const resizedImageUri = await Resizer.createResizedImage(blob.uri, 500, 500, 'JPEG', 80);
//       // const response2 = await fetch(resizedImageUri);
//       // blob = await response2.blob();

//       if (!auth.currentUser) {
//         return;
//       }

//       await uploadImageHelper(blob);

//       blob = null; // Clean up blob resource
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", texts.uploadError);
//       blob = null;
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={containerStyles.container}>
//         <View style={containerStyles.container}>
//           {!image ? 
//             <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
//               <Text style={styles.imagePlaceholderText}>+</Text>
//             </TouchableOpacity>
//             :
//             <TouchableOpacity onPress={pickImage}>
//               <Image source={{ uri: image }} style={{ width: 200, height: 300, marginBottom: 30 }} />
//             </TouchableOpacity>
//           }

//           <TextInput
//             style={inputStyles.detailInput}
//             onChangeText={setDescription}
//             value={description}
//             placeholder={texts.addDescription}
//           />

//           {uploadProgress > 0 &&
//             <Progress.Bar 
//               progress={uploadProgress / 100} 
//               width={200} 
//               color={colors.vrip}
//               style={{marginVertical: 20}} 
//             />
//           }


//           <TouchableOpacity style={buttonStyles.greenButton} onPress={uploadImage} disabled={uploadProgress > 0}>
//             {uploadProgress > 0 ? 
//                 <ActivityIndicator color="white" />
//                     :
//                 <Text style={buttonStyles.greenButtonText}>
//                     {texts.uploadOutfit}
//                 </Text>
//             }
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//     imagePlaceholder: {
//       width: 200,
//       height: 300,
//       backgroundColor: 'lightgrey',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginBottom: 30,
//     },
//     imagePlaceholderText: {
//       color: 'white',
//       fontWeight: '400',
//       fontSize: 80, // Adjust this size as needed
//     },
//   });
