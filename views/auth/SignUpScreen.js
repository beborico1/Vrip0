import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as Localization from 'expo-localization';
import { auth, db } from '../../firebaseConfig';
import translations from '../../helpers/translations';
import { buttonStyles, containerStyles, inputStyles, textStyles } from '../../helpers/styles';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const locales = Localization.getLocales(); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  
  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  const handleSignUp = useCallback(async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed up successfully: ',userCredential);
        const user = userCredential.user; // Obtén el usuario recién creado

        setDoc(doc(db, "users", user.uid), {  // Crea un documento en Firestore para almacenar la información del usuario
            email: user.email,
            uid: user.uid,
            created_at: serverTimestamp(),
            locales,
            presentation:"",
            profile_picture:"",
            username:"",
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
  
  return (
    <KeyboardAvoidingView behavior="padding" style={containerStyles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={containerStyles.container}>
          <Text style={textStyles.title}>{texts.welcome}</Text>
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
