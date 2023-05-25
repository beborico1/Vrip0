import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig'; // Assuming you have a firebaseConfig.js file that exports the configured storage instance
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';
import { buttonStyles, containerStyles, inputStyles, textStyles } from '../helpers/styles';
import colors from '../helpers/colors';

const CreatePostScreen = () => {
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

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const imagePath = `images/${Date.now()}.jpg`;
      const imageRef = ref(storage, imagePath);

      try {
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);
        const timestamp = serverTimestamp();
        const outfitsRef = collection(db, 'outfits');
        const uid = auth.currentUser.uid;
        await addDoc(outfitsRef, { createdAt: timestamp, imageUrl, description, postedBy: uid, reported: false, likeCount: 0 }); // Incluye la descripción en el documento de Firestore
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error al subir la imagen', error);
        alert(texts.uploadError);
      } finally {
        setUploading(false);
      }  
    } catch (error) {
      console.error('Error al subir la imagen', error);
      alert(texts.uploadError);
    } finally {
      setUploading(false);
    }

    setUploading(true);    
  };

  const renderImagePlaceholder = () => {
    return (
      <View style={ containerStyles.imagePlaceholder }>
        <Text style={{ color: 'white', fontSize: 64 }}>+</Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ flex: 1, alignItems: 'center', padding: 20, backgroundColor: 'white' }}>
        <Text style={[textStyles.infoLabel,{marginBottom: 20}]}>
          {texts.permissionsMessage}
        </Text>
        <TouchableOpacity onPress={() => pickImage(false)} >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={{ width: 150, height: 225 }} />
          ) : (
            renderImagePlaceholder()
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickImage(true)}>
          <View style={{ flexDirection: 'row', paddingVertical: 10, marginBottom: 20 }}>
            <Ionicons name="camera-outline" size={20} color={colors.vrip} style={{ marginRight: 5 }} />
            <Text style={textStyles.greenLabel}>{texts.openCamera}</Text>
          </View>
        </TouchableOpacity>

      {selectedImage && (
        <>
      <TextInput
        style={inputStyles.detailInput}
        onChangeText={setDescription}
        value={description}
        placeholder={texts.descriptionPlaceholder}
        multiline={false}
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <TouchableOpacity onPress={uploadImage} style={[ buttonStyles.greenButton, { width: '80%' }]}>
          {uploading ? (
            <ActivityIndicator color="white" />
            ) : (
            <Text style={buttonStyles.greenButtonText}>{texts.uploadOutfit}</Text>
          )}
      </TouchableOpacity>
      <View style={containerStyles.container}>
        <Text style={textStyles.infoLabel}>{texts.publicationMessage}</Text>
      </View>
      </>
      )}
    </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePostScreen;
