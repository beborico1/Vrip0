import { Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Localization from 'expo-localization';
import { auth } from '../firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../views/HomeScreen';
import CreatePostScreen from '../views/CreatePostScreen';
import translations from '../helpers/translations';
import { textStyles } from '../helpers/styles';
import colors from '../helpers/colors';

const Stack = createStackNavigator();

const HomeStack = () => {
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
  
    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto
  
    return (
      <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: texts.homeTitle,
              headerRight: () => (
                user ? 
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreatePost')}
                  >
                  <Text style={[textStyles.greenLabel, { paddingHorizontal: 10 }]}>{texts.post}</Text>
                </TouchableOpacity> : null
              ),
            })}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{
              title: texts.createPostTitle,
              headerTintColor: colors.vrip,
            }}
          />
      </Stack.Navigator>
    )
}


export default HomeStack