// Importación de componentes y bibliotecas necesarias
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importación de las pilas de navegación
import HomeStack from './navigators/HomeStack.js';
import MeStack from './navigators/MeStack';

import * as Localization from 'expo-localization';
import translations from './helpers/translations.js';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeStack') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'MeStack') {
              iconName = focused ? 'person' : 'person-outline';
            }
              return <Ionicons name={iconName} size={size} color={color} style={{marginBottom:0}} />; // You can return any component that you like here!
            },
            tabBarActiveTintColor: '#32CD32',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: {marginBottom: 5}
        })}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ headerShown: false, title: texts.homeTitle }}
        />
        <Tab.Screen
          name="MeStack"
          component={MeStack}
          options={{ headerShown: false, title: texts.meScreen }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;