import { Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../views/HomeScreen';
import CreatePostScreen from '../views/CreatePostScreen';
import { textStyles } from '../helpers/styles';
import colors from '../helpers/colors';
import { UserContext } from '../helpers/UserContext';
import { LanguageContext } from '../helpers/LanguageContext';
import ProfileScreen from '../views/ProfileScreen';
import NotificationsScreen from '../views/NotificationsScreen';
import { Ionicons } from '@expo/vector-icons'; // Añadir esta línea para importar iconos
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const Stack = createStackNavigator();

const HomeStack = () => {
    const { texts } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);

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
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Feather 
                    name="plus-square" 
                    size={26} 
                    color={colors.vrip} 
                    style={{ paddingRight: 15, marginTop: 2 }}
                  />
                </TouchableOpacity> : null
              ),
              headerLeft: () => (
                user ?
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notifications')}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <FontAwesome5 
                    name="bell" 
                    size={24} 
                    color={colors.vrip}
                    style={{ paddingLeft: 15 }}
                  />
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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: texts.profileScreenTitle,
              headerTintColor: colors.vrip,
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              title: texts.notificationsScreenTitle,
              headerTintColor: colors.vrip,
            }}
          />
          
      </Stack.Navigator>
    )
}


export default HomeStack