import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginSreen from '../Auth/LoginSreen';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginSreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
