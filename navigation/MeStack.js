import React from 'react'
import * as Localization from 'expo-localization';
import { createStackNavigator } from '@react-navigation/stack';
import MeScreen from '../views/MeScreen';
import LoginScreen from '../views/auth/LoginScreen';
import SignUpScreen from '../views/auth/SignUpScreen';
import translations from '../helpers/translations';
import colors from '../helpers/colors';
import LogOutMenu from '../components/LogOutMenu';
import { auth } from '../firebaseConfig';
import { TouchableOpacity, Text } from 'react-native';
import { textStyles } from '../helpers/styles';

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
              title: texts.meScreen,
              headerRight: () => (
                auth.currentUser ? 
                <TouchableOpacity
                  onPress={() => navigation.navigate('SettingsScreen')}
                >
                  <Text style={[textStyles.greenLabel, { paddingHorizontal: 10 }]}>{texts.settings}</Text>
                </TouchableOpacity> : null
              ),
            })}
          />
    
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: '', headerTintColor: colors.vrip, headerTitleStyle: {color: 'black', },}}/>
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: '', headerTintColor: colors.vrip, headerTitleStyle: {color: 'black', },}}/>
          <Stack.Screen name="SettingsScreen" component={LogOutMenu} options={{ title: '', headerTintColor: colors.vrip, headerTitleStyle: {color: 'black', },}}/>
        </Stack.Navigator>
    )
}

export default MeStack