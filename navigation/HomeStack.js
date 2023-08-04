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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: texts.profileScreenTitle,
              headerTintColor: colors.vrip,
            }}
          />
          
      </Stack.Navigator>
    )
}


export default HomeStack