import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import colors from '../../helpers/colors';
import * as Localization from 'expo-localization';
import { auth, db } from '../../firebaseConfig';
import translations from '../../helpers/translations';

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
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{texts.welcome}</Text>
          <TextInput
            placeholder={texts.emailAddress}
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => setEmail(email)}
            value={email}
            placeholderTextColor={"#CCCCCC"}
          />
          <TextInput
            secureTextEntry
            placeholder={texts.password}
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => setPassword(password)}
            value={password}
            placeholderTextColor={"#CCCCCC"}
          />
          {errorMessage && (
            <Text style={{ color: 'red', width: "80%", textAlign: "center" }}>{errorMessage}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{texts.createAccount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  textInput: {
    width: '80%',
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  button: {
    width: '80%',
    height: 48,
    justifyContent: 'center',
    backgroundColor: colors.vrip,
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SignUpScreen;
