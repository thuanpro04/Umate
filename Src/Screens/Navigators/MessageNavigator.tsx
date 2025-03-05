import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MemberGroup from '../Messages/Component/MemberGroup';
import UserInfoChat from '../Messages/Component/UserInfoChat';
import SearchFriendScreen from '../Search/SearchFriendScreen';

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
