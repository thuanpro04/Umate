import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MemberGroup from '../Messages/Component/MemberGroup';
import UserInfoChat from '../Messages/Component/UserInfoChat';
import SearchFriendScreen from '../Search/SearchFriendScreen';
import TrashConversation from '../Messages/TrashConversation';
import YourImagesScreen from '../Messages/YourImagesScreen';
import YourLinkScreen from '../Messages/YourLinkScreen';
import CustormNickNameScreen from '../Messages/CustormNickNameScreen';
import ThemeChatScreen from '../Messages/ThemeChatScreen';

const MessageNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="UserInfoChat">
      <Stack.Screen name="UserInfoChat" component={UserInfoChat} />
      <Stack.Screen name="MemberGroup" component={MemberGroup} />
      <Stack.Screen name="SearchFriends" component={SearchFriendScreen} />
      <Stack.Screen name="YourImagesScreen" component={YourImagesScreen} />   
      <Stack.Screen name="YourLinkScreen" component={YourLinkScreen} />
      <Stack.Screen name="CustormNickNameScreen" component={CustormNickNameScreen} />      
      <Stack.Screen name="ThemeChatScreen" component={ThemeChatScreen} />      



    </Stack.Navigator>
  );
};

export default MessageNavigator;
