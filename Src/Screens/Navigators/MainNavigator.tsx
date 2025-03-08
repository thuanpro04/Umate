import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SupportScreen from '../../SupportScreen/SupportScreen';
import DetailEvent from '../Events/DetailEvent';
import FriendScreens from '../Friends/FriendScreens';
import FriendsRequestScreen from '../Friends/FriendsRequestScreen';
import FriendsRespondScreen from '../Friends/FriendsRespondScreen';
import {
  AddGroupScreens,
  ContactUsScreen,
  SearchScreen,
  SettingScreen,
} from '../index';
import GoongMapScreen from '../map/GoongMapScreen';
import ChatScreen from '../Messages/ChatScreen';

import NotificationScreen from '../notification/NotificationScreen';
import PersonalScreen from '../Profile/PersonalScreen';
import SetUpProfile from '../Profile/SetUpProfile';
import UserQRCode from '../QRCode/UserQRCode';
import SecurityScreen from '../SecurityScreen/SecurityScreen';
import ShareScreen from '../ShareScreen';
import DrawerNavigator from './DrawerNavigator';
import MessageNavigator from './MessageNavigator';
import VoiceCall from '../VideoCall/VoiceCall';
import CallWaitingScreen from '../VideoCall/CallWaitingScreen';
import CallWaitingAccept from '../VideoCall/CallWaitingAccept';
import TrashConversation from '../Messages/TrashConversation';
import ReportScreen from '../Report/ReportScreen';
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
      <Stack.Screen name="MessageNavigator" component={MessageNavigator} />
      <Stack.Screen name="SetUpProfile" component={SetUpProfile} />
      <Stack.Screen name="AddGroup" component={AddGroupScreens} />
      <Stack.Screen name="ShareScreen" component={ShareScreen} />
      <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
      <Stack.Screen name="EditProfile" component={SetUpProfile} />
      <Stack.Screen name="FriendsRespond" component={FriendsRespondScreen} />
      <Stack.Screen
        name="FriendsRequestScreen"
        component={FriendsRequestScreen}
      />
      <Stack.Screen name="DetailEvent" component={DetailEvent} />
      <Stack.Screen name="GoongMapScreen" component={GoongMapScreen} />
      <Stack.Screen name="UserQRCode" component={UserQRCode} />
      <Stack.Screen name="FriendScreens" component={FriendScreens} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
     
      <Stack.Screen name="VoiceCall" component={VoiceCall} />
      <Stack.Screen name="CallWaitingScreen" component={CallWaitingScreen} />
      <Stack.Screen name="CallWaitingAccept" component={CallWaitingAccept} />
      <Stack.Screen name="TrashConversation" component={TrashConversation} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      
      
    </Stack.Navigator>
  );
};

export default MainNavigator;
