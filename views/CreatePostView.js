import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image, TextInput, ActivityIndicator, Keyboard, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig'; // Assuming you have a firebaseConfig.js file that exports the configured storage instance
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';

const CreatePostView = () => {
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

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
      alert(texts.noImageSelected);
      return;
    }
  
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const imagePath = `images/${Date.now()}.jpg`;
    const imageRef = ref(storage, imagePath);

    setUploading(true);

    try {
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);
        const timestamp = serverTimestamp();
        const outfitsRef = collection(db, 'outfits');
        const uid = auth.currentUser.uid;
        await addDoc(outfitsRef, { timestamp, imageUrl, description, postedBy: uid, reported: false }); // Incluye la descripción en el documento de Firestore
        navigation.navigate('Home');
    } catch (error) {
        console.error('Error al subir la imagen', error);
        alert(texts.uploadError);
    } finally {
        setUploading(false);
    }      
  };

  const renderImagePlaceholder = () => {
    return (
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>+</Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
        <Text style={[styles.text,{marginBottom: 20}]}>
          {texts.permissionsMessage}
        </Text>
        <TouchableOpacity onPress={() => pickImage(false)} >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            renderImagePlaceholder()
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickImage(true)}>
          <View style={styles.row}>
            <Ionicons name="camera-outline" size={20} color="#32CD32" style={styles.icon} />
            <Text style={styles.greenText}>{texts.openCamera}</Text>
          </View>
        </TouchableOpacity>

      {selectedImage && (
        <>
      <TextInput
        style={styles.textInput}
        onChangeText={setDescription}
        value={description}
        placeholder={texts.descriptionPlaceholder}
        multiline={false}
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <TouchableOpacity onPress={uploadImage} style={styles.button}>
          {uploading ? (
            <ActivityIndicator color="white" />
            ) : (
            <Text style={styles.buttonText}>{texts.uploadOutfit}</Text>
          )}
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.text}>{texts.publicationMessage}</Text>
      </View>
      </>
      )}
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    height: '100%',
  },
    textInput: {
      width: '80%',
      height: 50,
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      paddingLeft: 15,
      paddingRight: 15,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button: {
      marginTop: 20,
      width: '80%',
      height: 50,
      backgroundColor: '#32CD32',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    greenText: {
      color: '#32CD32',
      fontSize: 18,
      fontWeight: 'bold',
      borderBottomWidth: 2,
      borderBottomColor: '#32CD32',
    },
    previewImage: {
      width: 150,
      height: 225,
      resizeMode: 'cover',
    },
    text: {
      color: 'lightgrey',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    imagePlaceholder: {
      width: 150,
      height: 225,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    imagePlaceholderText: {
      fontSize: 50,
      color: 'white',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
      paddingTop: 10,
    },
    icon: {
      marginRight: 5,
    },
  });  

export default CreatePostView;
