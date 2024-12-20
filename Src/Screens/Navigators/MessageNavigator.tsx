import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatScreen from '../Messages/ChatScreen';
import UserInfoChat from '../Messages/Component/UserInfoChat';

const MessageNavigator = () => {
    const Stack=createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Chat'>
        <Stack.Screen name='Chat' component={ChatScreen}/>
        <Stack.Screen name='userinfochat' component={UserInfoChat}/>

    </Stack.Navigator>
  )
}

export default MessageNavigator