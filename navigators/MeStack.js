import { View, Text } from 'react-native'
import React from 'react'
import * as Localization from 'expo-localization';
import { createStackNavigator } from '@react-navigation/stack';
import MeScreen from '../views/MeScreen';
import LoginScreen from '../views/auth/LoginScreen';
import SignUpScreen from '../views/auth/SignUpScreen';
import translations from '../helpers/translations';

const Stack = createStackNavigator();

const MeStack = () => {
    
      const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
      const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto
      
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="MeScreen"
            component={MeScreen}
            options={({ navigation }) => ({
              headerShown: true,
              title: texts.meScreen,
            })}
          />
    
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: '', headerTintColor: '#32CD32', headerTitleStyle: {color: 'black', },}}/>
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: '', headerTintColor: '#32CD32', headerTitleStyle: {color: 'black', },}}/>
    
        </Stack.Navigator>
    )
}

export default MeStack