import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebaseConfig'; // Assuming you have a firebaseConfig.js file that exports the configured storage instance
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const CreatePostView = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  const pickImage = async (fromCamera) => {
    const { status } = fromCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la cámara o la biblioteca de medios.');
      return;
    }

    const pickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    };

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync(pickerOptions);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      alert('No hay imagen seleccionada');
      return;
    }
  
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const imagePath = `images/${Date.now()}.jpg`;
    const imageRef = ref(storage, imagePath);

    setUploading(true); // Start the upload and show the activity indicator
  
    try {
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef); // Get the URL of the uploaded image
        const timestamp = serverTimestamp(); // Get the current server timestamp
        const outfitsRef = collection(db, 'outfits'); // Reference to the 'outfits' collection
        await addDoc(outfitsRef, { timestamp, imageUrl }); // Create a new document with the timestamp and image URL
        navigation.navigate('Home'); // Navigate back to the home screen
      } catch (error) {
        console.error('Error al subir la imagen', error);
        alert('Error al subir la imagen');
      } finally {
        setUploading(false); // Finish the upload and hide the activity indicator
      }      
  };  

  return (
    <View style={styles.container}>
      {selectedImage && (
        <TouchableOpacity onPress={() => pickImage(false)} >
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => pickImage(false)} style={styles.button}>
        <Text style={styles.buttonText}>Seleccionar de la biblioteca</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => pickImage(true)} style={styles.button}>
        <Text style={styles.buttonText}>Abrir cámara</Text>
      </TouchableOpacity>
      {selectedImage && (
      <TouchableOpacity onPress={uploadImage} style={styles.button}>
          {uploading ? (
            <ActivityIndicator color="white" />
            ) : (
            <Text style={styles.buttonText}>Subir Outfit</Text>
          )}
      </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      marginTop: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#32CD32',
      borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
    previewImage: {
      width: 200,
      height: 300,
      resizeMode: 'cover',
      marginBottom: 20,
    },
  });  

export default CreatePostView;
