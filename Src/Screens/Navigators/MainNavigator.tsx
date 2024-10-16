import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ContactUsScreen, SearchScreen, SettingScreen} from '../index';
import ChatScreen from '../Messages/ChatScreen';
import DrawerNavigator from './DrawerNavigator';
import ListUsersChat from '../Messages/Component/ListUsersChat';
const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
