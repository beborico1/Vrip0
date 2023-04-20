import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import CreatePostView from './views/CreatePostView';
import HomeView from './views/HomeView';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeView}
          options={({ navigation }) => ({
            title: 'Inicio',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('CreatePost')}
                style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostView}
          options={{
            title: 'Subir un Outfit',
            headerTintColor: '#32CD32',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
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

export default AppNavigator;