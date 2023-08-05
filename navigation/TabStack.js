import React from 'react'

// Importación de componentes y bibliotecas para la navegacion
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Servicios
import colors from '../helpers/colors.js';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importación de las pilas de navegación
import HomeStack from './HomeStack.js';
import MeStack from './MeStack.js';
import { LanguageContext } from '../helpers/LanguageContext.js';
import { auth } from '../firebaseConfig.js';
import ChatStack from './ChatStack.js';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  const { texts } = React.useContext(LanguageContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MeStack') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'ChatStack') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} style={{ marginBottom: 0 }} />; // You can return any component that you like here!
        },
        tabBarActiveTintColor: colors.vrip,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { marginBottom: 5 }
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
      { auth.currentUser &&
        <Tab.Screen
          name="ChatStack"
          component={ChatStack}
          options={{ headerShown: false, title: texts.chatScreen }}
        />
      }

    </Tab.Navigator>
  )
}

export default TabStack