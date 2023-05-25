import { doc, getDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { buttonStyles, containerStyles, inputStyles, textStyles } from '../../helpers/styles';
import { auth, db } from '../../firebaseConfig';
import * as Localization from 'expo-localization';
import translations from '../../helpers/translations';

const LoginScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto
  
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
