import { StatusBar } from 'expo-status-bar';
import BiometricApp from './components/biometricApp';
import { NavigationContainer } from '@react-navigation/native';
import { Fragment } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OptionsScreen from './screens/optionsScreen';
import PastScreen from './screens/pastScreen';

export default function App() {

  const stack = createNativeStackNavigator();

  return (
    <Fragment>
      <StatusBar style="auto" />
      <NavigationContainer>
        <stack.Navigator>
          <stack.Screen name='Home' component={BiometricApp} />
          <stack.Screen name='Options' component={OptionsScreen} />
          <stack.Screen name='Past Home' component={PastScreen}/>
          </stack.Navigator>
      </NavigationContainer>
      </Fragment>
  );
}
