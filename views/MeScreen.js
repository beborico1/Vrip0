import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MeMenu from '../components/MeMenu'
import { auth } from '../firebaseConfig'
import styles from '../helpers/styles'
import * as Localization from 'expo-localization';
import translations from '../helpers/translations'

const MeScreen = () => {
    const [user, setUser] = useState(auth.currentUser);

    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto
  
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const signOut = () => {
        auth.signOut().then(() => {
            setUser(null);
        }).catch((error) => {
            // An error happened.
        });
    }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%" }}> 
        {user ? 
        <TouchableOpacity onPress={() => signOut()}> 
            <Text style={[styles.label,{color:'red'}]}>{texts.logOut}</Text> 
        </TouchableOpacity>
        
        : 
        <MeMenu/>}
        
    </View>
  )
}

export default MeScreen