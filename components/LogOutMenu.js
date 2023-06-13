import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { buttonStyles, containerStyles, textStyles } from '../helpers/styles';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import { LanguageContext } from '../helpers/LanguageContext';

const LogOutMenu = () => {
  
    const { texts } = React.useContext(LanguageContext);

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

// Confirmación adicional para eliminar la cuenta: Agrega una segunda alerta de confirmación antes de eliminar la cuenta para asegurarte de que el usuario realmente desea realizar esta acción irreversible.

// Mejorar la presentación de errores: Si ocurre algún error durante el cierre de sesión o la eliminación de la cuenta, mejora la presentación de los mensajes de error para que sean más claros y descriptivos.

// Agrega íconos: Utiliza íconos relevantes junto a los textos de "Cerrar sesión" y "Eliminar cuenta" para mejorar la comprensión visual y la usabilidad del componente.

// Estilos y diseño: Aplica estilos y diseños coherentes en todo el componente para asegurarte de que se ajuste al aspecto general de la aplicación y sea visualmente atractivo.

// Uso de modales en lugar de alertas: Considera reemplazar las alertas por modales personalizados para mostrar mensajes de confirmación o error. Los modales pueden brindar más flexibilidad en términos de diseño y permitir una mejor experiencia de usuario.

// Añadir animaciones: Agrega animaciones sutiles al abrir y cerrar el menú de cierre de sesión para mejorar la experiencia visual y hacerlo más interactivo.

// Manejo de errores más robusto: Implementa un manejo de errores más robusto en caso de que ocurran problemas de conexión o errores inesperados durante el cierre de sesión o la eliminación de la cuenta.

// Traducciones dinámicas: En lugar de importar las traducciones directamente, considera utilizar una función que permita cambiar el idioma de las traducciones en tiempo real sin necesidad de recargar la página.

// Funcionalidad de deshacer: Después de eliminar la cuenta, proporciona una opción de "deshacer" durante un período de tiempo limitado para que el usuario pueda recuperar su cuenta si se arrepiente.

// Integración con servicios externos: Si es relevante para tu aplicación, considera agregar la capacidad de cierre de sesión o eliminación de cuentas a través de servicios externos populares, como Google, Facebook, etc., para brindar opciones de autenticación más amplias y simplificar el proceso para los usuarios.