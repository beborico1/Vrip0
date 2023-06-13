import React, { useContext, useState } from 'react';
import { Image, View, TextInput, Alert, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { buttonStyles, containerStyles, inputStyles } from '../helpers/styles';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../helpers/LanguageContext';

export default function CreatePostScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAsset, setCurrentAsset] = useState(null);

  const navigation = useNavigation();

  const { texts } = useContext(LanguageContext);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setCurrentAsset(result.assets[0]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", texts.imagePickerError);
    }
  };
  
  const uploadImage = async () => {
    // Validation: Ensure an image has been picked and a description entered
    if (!currentAsset) {
        Alert.alert("Error", texts.imageNotSelected);
        return;
    }

    let blob;

    try {
      const response = await fetch(currentAsset.uri);
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
          Alert.alert("Error", "Hubo un error durante la subida de la imagen.");
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

            setCurrentAsset(null);

            // Clean up blob resource
            blob = null;

            navigation.navigate("Home");
          }).catch(error => {
            console.log(error);
            Alert.alert("Error", "Hubo un error al obtener la URL de la imagen subida.");
          });
        }
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Hubo un error al subir la imagen.");

      blob = null;
    }
  };

  return (
    <View style={containerStyles.container}>
      {!image ? 
        <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
          <Text style={styles.imagePlaceholderText}>+</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: image }} style={{ width: 200, height: 300, marginBottom: 30 }} />
        </TouchableOpacity>
      }

      <TextInput
        style={inputStyles.detailInput}
        onChangeText={setDescription}
        value={description}
        placeholder={texts.addDescription}
      />

      <TouchableOpacity style={buttonStyles.greenButton} onPress={uploadImage} disabled={uploadProgress > 0}>
        {uploadProgress > 0 ? 
            <ActivityIndicator color="white" />
                :
            <Text style={buttonStyles.greenButtonText}>
                {texts.uploadOutfit}
            </Text>
        }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    imagePlaceholder: {
      width: 200,
      height: 300,
      backgroundColor: 'lightgrey',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    imagePlaceholderText: {
      color: 'white',
      fontWeight: '400',
      fontSize: 80, // Adjust this size as needed
    },
  });

// Separar lógica en funciones auxiliares: Puedes separar la lógica relacionada con la selección y carga de imágenes en funciones auxiliares para hacer el componente más legible y modular.

// Validación de entrada: Agrega validación adicional para asegurarte de que la descripción no esté vacía antes de subir la imagen.

// Manejo de errores mejorado: Mejora el manejo de errores al mostrar mensajes de error más descriptivos al usuario en caso de fallos durante la selección o carga de imágenes.

// Internacionalización: Utiliza el contexto de idioma para localizar los mensajes de error y los textos mostrados al usuario.

// Optimización de la carga de imágenes: Evalúa la posibilidad de utilizar técnicas de compresión de imágenes o reducción de calidad para mejorar el rendimiento de la carga de imágenes, especialmente si la calidad de la imagen no es crítica para la aplicación.

// Mejorar la experiencia de usuario durante la carga: Considera mostrar un indicador de progreso más visual durante la carga de la imagen, como una barra de progreso animada.

// Manejo de permisos de acceso a la galería: Verifica y solicita los permisos necesarios para acceder a la galería de imágenes antes de permitir al usuario seleccionar una imagen.

// Validación de usuario autenticado: Además de verificar si auth.currentUser existe, puedes mostrar un mensaje de error o redirigir al usuario a la pantalla de inicio de sesión si no está autenticado.

// Limpiar estado después de subir la imagen: Después de subir exitosamente la imagen y agregarla a la base de datos, puedes restablecer los estados image, description y uploadProgress para preparar el componente para una nueva carga de imagen.

// Manejo de cancelación de selección de imágenes: Si el usuario cancela la selección de una imagen, puedes restablecer los estados relacionados (image, description, currentAsset) para evitar cualquier estado inconsistente.