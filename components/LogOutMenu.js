import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';
import { buttonStyles, containerStyles, textStyles } from '../helpers/styles';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';

const LogOutMenu = () => {
  
    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

    const navigation = useNavigation();

    const signOut = () => {
      auth.signOut().then(() => {
          // Sign-out successful.
          console.log('Sign-out successful.');
          navigation.navigate('MeScreen');
      }).catch((error) => {
          // An error happened.
          console.log(error);
          Alert.alert('Error', error.message);
      });
    }

    const deleteAccount = () => {
      Alert.alert(texts.deleteAccount, texts.deleteAccountConfirmation, [
        {
          text: texts.cancel,
          onPress: () => {
            confirmation = false
          },
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            deleteAccountConfirmed();
          }
        }
      ]);
    }

    const deleteAccountConfirmed = () => {
      // Delete user document from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      deleteDoc(userDocRef);
      
      auth.currentUser.delete().then(() => {
          // User deleted.
          console.log('User deleted.');
          navigation.navigate('MeScreen');
          Alert.alert(texts.success, texts.accountDeletedInfo);
      }).catch((error) => {
          // An error happened.
          console.log(error);
          Alert.alert('Error', error.message);
      });
    }
      


  return (
    <View style={ containerStyles.container }> 
        <TouchableOpacity 
          style={[ buttonStyles.greenButton, { backgroundColor: 'red' }] }
          onPress={signOut}
        >
          <Text style={ buttonStyles.greenButtonText }>{texts.logOut}</Text>
        </TouchableOpacity>
    
        <TouchableOpacity 
          style={{ flexDirection:'row', marginTop:10 }}
          onPress={deleteAccount}
        >
          <Text style={textStyles.label}>{texts.or} <Text style={[ textStyles.greenLabel, { color: 'red' } ]}>{texts.deleteAccount}</Text></Text>
        </TouchableOpacity>
    </View>
  )
}

export default LogOutMenu