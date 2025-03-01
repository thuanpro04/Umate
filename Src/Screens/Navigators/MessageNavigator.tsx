import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from '../Messages/ChatScreen';
import UserInfoChat from '../Messages/Component/UserInfoChat';
import MemberGroup from '../Messages/Component/MemberGroup';
import SearchFriendScreen from '../Search/SearchFriendScreen';
import VideoCall from '../Messages/VideoCall';
import VoiceCall from '../Messages/VoiceCall';

const MessageNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="UserInfoChat">
      <Stack.Screen name="UserInfoChat" component={UserInfoChat} />
      <Stack.Screen name="MemberGroup" component={MemberGroup} />
      <Stack.Screen name="SearchFriends" component={SearchFriendScreen} />
      
      
    </Stack.Navigator>
  );
};

export default MessageNavigator;
