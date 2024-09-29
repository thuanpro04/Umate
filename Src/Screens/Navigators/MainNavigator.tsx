import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import {ContactUsScreen, SearchScreen, SettingScreen} from '../index';
const MainNavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />

      </Stack.Navigator>
    );
}

export default MainNavigator