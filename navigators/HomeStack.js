import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Localization from 'expo-localization';
import { auth } from '../firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '../views/HomeView';
import CreatePostView from '../views/CreatePostView';
import translations from '../helpers/translations';

const Stack = createStackNavigator();

const HomeStack = () => {
    const [user, setUser] = useState(auth.currentUser);
    console.log('user',user,auth.currentUser)
  
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
  
    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto
  
    return (
      <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeView}
            options={({ navigation }) => ({
              title: texts.homeTitle,
              headerRight: () => (
                user ? 
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreatePost')}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity> : null
              ),
            })}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostView}
            options={{
              title: texts.createPostTitle,
              headerTintColor: '#32CD32',
            }}
          />
      </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  addButton: {
    marginRight: 10,
    backgroundColor: '#32CD32',
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
});

export default HomeStack