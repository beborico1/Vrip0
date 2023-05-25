import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MeMenu from '../components/MeMenu'
import { auth } from '../firebaseConfig'
import ProfileScreen from './ProfileScreen';
import { useNavigation } from '@react-navigation/native';

const MeScreen = () => {
    const [user, setUser] = useState(auth.currentUser);

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

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%" }}> 
        {user ? 
            <ProfileScreen/>
            : 
            <MeMenu/>
        }
    </View>
  )
}


export default MeScreen