import React from 'react'
import * as Localization from 'expo-localization';
import { createStackNavigator } from '@react-navigation/stack';
import translations from '../helpers/translations';
import colors from '../helpers/colors';
import ChatScreen from '../views/ChatScreen';
import ConversationsScreen from '../views/ConversationsScreen';

const Stack = createStackNavigator();

const ChatStack = () => {
      const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
      const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

      return (
        <Stack.Navigator>
          <Stack.Screen name="ConversationsScreen" component={ConversationsScreen} options={{ title: texts.conversations, headerTintColor: colors.vrip, headerTitleStyle: {color: 'black', },}}/>
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: '', headerTintColor: colors.vrip, headerTitleStyle: {color: 'black', },}}/>
        </Stack.Navigator>
    )
}

export default ChatStack