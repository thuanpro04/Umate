import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FriendsRespondScreen from '../Friends/FriendsRespondScreen';
import {
  AddGroupScreens,
  ContactUsScreen,
  SearchScreen,
  SettingScreen,
} from '../index';
import ChatScreen from '../Messages/ChatScreen';
import UserInfoChat from '../Messages/Component/UserInfoChat';
import PersonalScreen from '../Profile/PersonalScreen';
import SetUpProfile from '../Profile/SetUpProfile';
import ShareScreen from '../ShareScreen';
import DrawerNavigator from './DrawerNavigator';
const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="MainDrawer">
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="UserInfoChat" component={UserInfoChat} />
      <Stack.Screen name="SetUpProfile" component={SetUpProfile} />
      <Stack.Screen name="AddGroup" component={AddGroupScreens} />
      <Stack.Screen name="ShareScreen" component={ShareScreen} />
      <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
      <Stack.Screen name="EditProfile" component={SetUpProfile} />
      <Stack.Screen name="FriendsRespond" component={FriendsRespondScreen} />

    </Stack.Navigator>
  );
};

export default MainNavigator;
