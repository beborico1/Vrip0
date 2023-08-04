import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, serverTimestamp, getDocs, query, collection, where } from 'firebase/firestore';
import * as Localization from 'expo-localization';
import { auth, db } from '../../firebaseConfig';
import translations from '../../helpers/translations';
import { buttonStyles, containerStyles, inputStyles, textStyles } from '../../helpers/styles';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Agregamos un nuevo campo para el nombre de usuario
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const locales = Localization.getLocales(); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  
  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  const handleSignUp = useCallback(async () => {
    if (email === '' || password === '' || username === '') {
      setErrorMessage(texts.emptyFields);
      return;
    }

    const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
    
    if (querySnapshot.size > 0) {
      setErrorMessage(texts.usernameAlreadyInUse);
      setLoading(false);
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed up successfully: ',userCredential);
        const user = userCredential.user; // Obtén el usuario recién creado

        setDoc(doc(db, "users", user.uid), {  // Crea un documento en Firestore para almacenar la información del usuario
            email: user.email,
            uid: user.uid,
            username,
            created_at: serverTimestamp(),
            locales,
            presentation:"",
            profile_picture:"",
            name:"",
        });

        navigation.navigate("MeScreen")
      })
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage(texts.emailInUse);
          break;
        case 'auth/invalid-email':
          setErrorMessage(texts.invalidEmail);
          break;
        case 'auth/weak-password':
          setErrorMessage(texts.weakPassword);
          break;
        default:
          setErrorMessage(texts.signUpError);
          break;
      }
    }
  }, [email, password]);

  const handleUsernameChange = async (value) => {
      value = value.replace(/\s/g, ''); // Eliminar espacios en blanco
      value = value.replace(/[^\w\s]/gi, ''); // esto eliminara todos los caracteres especiales como tildes, ñ, etc.
      value = value.replace(/@/gi, ''); // eliminar @, gi significa global y case insensitive
      setUsername(value);
  }
  
  return (
    <KeyboardAvoidingView behavior="padding" style={containerStyles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={containerStyles.container}>
          <Text style={textStyles.title}>{texts.welcome}</Text>
          <TextInput
            placeholder={texts.username}
            autoCapitalize="none"
            style={inputStyles.input}
            onChangeText={value => handleUsernameChange(value)}
            value={username}
            placeholderTextColor={"#CCCCCC"}
          />
          <TextInput
            placeholder={texts.emailAddress}
            autoCapitalize="none"
            style={inputStyles.input}
            onChangeText={email => setEmail(email)}
            value={email}
            placeholderTextColor={"#CCCCCC"}
          />
          <TextInput
            secureTextEntry
            placeholder={texts.password}
            autoCapitalize="none"
            style={inputStyles.input}
            onChangeText={password => setPassword(password)}
            value={password}
            placeholderTextColor={"#CCCCCC"}
          />
          {errorMessage && (
            <Text style={{ color: 'red', width: "80%", textAlign: "center" }}>{errorMessage}</Text>
          )}
          <TouchableOpacity style={[buttonStyles.greenButton,{ width:"80%" }]} onPress={handleSignUp}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={buttonStyles.greenButtonText}>{texts.createAccount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

// Validación de campos: Agrega validación adicional a los campos de correo electrónico y contraseña para asegurarte de que cumplan con los requisitos necesarios, como longitud mínima o caracteres especiales.

// Confirmación de contraseña: Agrega un campo adicional para confirmar la contraseña y realiza la validación correspondiente para garantizar que las contraseñas coincidan antes de crear la cuenta.

// Mejora en la presentación de errores: Proporciona mensajes de error más descriptivos y amigables para informar al usuario sobre cualquier problema relacionado con el registro.

// Mejora en la accesibilidad: Asegúrate de que todos los elementos visuales sean accesibles para usuarios con discapacidades visuales o de movilidad. Puedes hacer esto agregando etiquetas accessibilityLabel a los elementos visuales y asegurándote de que se pueda navegar correctamente utilizando un lector de pantalla.

// Política de privacidad y términos: Considera agregar enlaces a la política de privacidad y términos y condiciones para que el usuario pueda revisarlos antes de registrarse.

// Estilos y diseño: Asegúrate de aplicar estilos y diseño coherentes en todo el componente, siguiendo las pautas de diseño de la aplicación y utilizando una paleta de colores consistente. Esto mejorará la apariencia visual y la experiencia del usuario.

// Contraseña segura: Proporciona indicaciones sobre los requisitos de seguridad de la contraseña, como una longitud mínima, uso de letras mayúsculas y minúsculas, números y caracteres especiales.

// Verificación de correo electrónico: Considera agregar un paso de verificación de correo electrónico después del registro exitoso para mejorar la seguridad y garantizar que el usuario proporcione una dirección de correo electrónico válida.

// Uso de bibliotecas externas: Evalúa si es necesario utilizar bibliotecas externas para gestionar la validación de formularios y la presentación de mensajes de error de manera más eficiente y efectiva.

// Implementación de términos de uso obligatorios: Si es necesario, agrega una casilla de verificación que requiera que el usuario acepte los términos y condiciones antes de completar el registro. Esto garantizará que el usuario esté consciente y de acuerdo con las políticas de la aplicación.