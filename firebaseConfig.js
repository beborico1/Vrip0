// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5ggzRzOfXHOhFqquWk-8btKqnw9-K_dM",
  authDomain: "vrip0-d68a8.firebaseapp.com",
  projectId: "vrip0-d68a8",
  storageBucket: "vrip0-d68a8.appspot.com",
  messagingSenderId: "535184768543",
  appId: "1:535184768543:web:3d88452df8967d197fdf2a",
  measurementId: "G-H7DB8K6BTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db, auth };