import { doc, getDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { buttonStyles, containerStyles, inputStyles, textStyles } from '../../helpers/styles';
import { auth, db } from '../../firebaseConfig';
import { LanguageContext } from '../../helpers/LanguageContext';
import colors from '../../helpers/colors';

const LoginScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { texts } = React.useContext(LanguageContext);

  // Función para enviar el email de reseteo de contraseña
  const sendResetPasswordEmail = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(texts.resetPasswordTitle, texts.resetPasswordMessage);
      setErrorMessage(null);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage(texts.userNotFound);
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage(texts.invalidEmail);
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage(texts.tooManyRequests);
      } else if (error.code === 'auth/argument-error') {
        setErrorMessage(texts.invalidEmail);
      } else if (error.code === 'auth/network-request-failed') {
        setErrorMessage(texts.networkRequestFailed);
      } else if (error.code === 'auth/user-disabled') {
        setErrorMessage(texts.userDisabled);
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage(texts.invalidCredential);
      } else if (error.code === 'auth/missing-email') {
        setErrorMessage(texts.missingEmail);
      } else {
        setErrorMessage(texts.resetPasswordError);
      }
    }
  };

  const handleLogin = useCallback(async () => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log('User logged in successfully: ',userCredential);
        
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
        //   dispatch(login(userDoc.data()));
          navigation.navigate("MeScreen")
        } else {
          console.log("No user document found!");
        }
      })
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage(texts.userNotFound);
          break;
        case 'auth/wrong-password':
          setErrorMessage(texts.incorrectPassword);
          break;
        case 'auth/invalid-email':
          setErrorMessage(texts.invalidEmail);
          break;
        case 'auth/email-already-in-use':
          setErrorMessage(texts.emailInUse);
          break;
        default:
          setErrorMessage(texts.signInError);
          break;
      }
    }
  }, [email, password]);

  return (
    <KeyboardAvoidingView behavior="padding" style={containerStyles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={containerStyles.container}>
          <Text style={textStyles.title}>{texts.welcomeBack}</Text>
          <TextInput
            style={inputStyles.input}
            placeholder={texts.email}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            placeholderTextColor={"#CCCCCC"}
          />
          <TextInput
            style={inputStyles.input}
            placeholder={texts.password}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={"#CCCCCC"}
          />
          {errorMessage && (
            <Text style={{ color: 'red', width: "80%", textAlign: "center" }}>{errorMessage}</Text>
          )}

          <TouchableOpacity onPress={() => sendResetPasswordEmail(email)}>
            <Text style={{ color: colors.vrip, width: "80%", textAlign: "center", paddingVertical: 10 }}>{texts.forgotPassword}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[buttonStyles.greenButton,{ width:"80%" }]} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={buttonStyles.greenButtonText}>{texts.signIn}</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
};

export default LoginScreen;

// Separación de lógica y presentación: Separa la lógica de inicio de sesión y el manejo de errores en funciones o hooks personalizados para mantener el componente más limpio y modular.

// Validación de formularios más robusta: Implementa una validación más completa en los campos de email y contraseña para garantizar que se ingresen datos válidos antes de realizar el inicio de sesión.

// Mejora de la experiencia de usuario en errores: Proporciona mensajes de error más descriptivos y claros para guiar al usuario sobre la causa y solución de los errores de inicio de sesión.

// Enmascaramiento de contraseña: Agrega una opción para mostrar/ocultar la contraseña mientras se está escribiendo para mejorar la usabilidad y permitir al usuario verificar su entrada.

// Internacionalización: Utiliza la biblioteca de internacionalización (i18n) para manejar las traducciones de manera más robusta y modular.

// Mejora en la navegación después del inicio de sesión: Evalúa si la redirección a la pantalla "MeScreen" es la mejor opción después de un inicio de sesión exitoso. Dependiendo de la lógica de tu aplicación, es posible que desees redirigir al usuario a una pantalla diferente.

// Optimización de rendimiento: Evalúa si hay operaciones costosas en términos de rendimiento, como la carga de datos innecesarios o la ejecución de lógica adicional durante el inicio de sesión. Realiza las optimizaciones necesarias para mejorar la velocidad de inicio de sesión.

// Refactorización de errores repetidos: Evalúa si algunos de los errores manejados tienen el mismo comportamiento y, en caso afirmativo, podrías consolidar el manejo de errores en un bloque común para reducir la duplicación de código.

// Agregar opción de registro: Si la aplicación permite el registro de nuevos usuarios, considera agregar una opción para registrarse directamente desde la pantalla de inicio de sesión.

// Mejora de la usabilidad del formulario: Agrega la funcionalidad de teclado "Next" y "Done" para facilitar la navegación entre los campos de email y contraseña y para cerrar el teclado después de ingresar la contraseña. Además, considera agregar una opción para navegar al formulario de registro desde la pantalla de inicio de sesión.