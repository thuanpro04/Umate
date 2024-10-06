import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { appColors } from '../../Theme/Colors/appColors';
import FriendsRequestScreen from '../Friends/FriendsRequestScreen';
import FriendsRespondScreen from '../Friends/FriendsRespondScreen';
import SuggestFriend from '../Friends/SuggestFriend';

const Tab = createMaterialTopTabNavigator();
const TabTopNavigator = () => {
  return (
    <Tab.Navigator
      style={{flex: 1}}
      initialRouteName="SuggestFriend"
      screenOptions={() => ({
        tabBarStyle: {
          backgroundColor: appColors.white,
        },
        tabBarActiveTintColor: appColors.focus, // focussed
        tabBarInactiveTintColor: appColors.green, // đổi màu còn lại,
        tabBarIndicatorStyle: {
          backgroundColor: appColors.focus, // thanh phía dưới
        },
      })}>
      <Tab.Screen name="SuggestFriend" component={SuggestFriend} key="suggestFriendTab" />
      <Tab.Screen name="Request" component={FriendsRequestScreen} key="requestTab" />
      <Tab.Screen name="Homie" component={FriendsRespondScreen} key="homieTab" />
    </Tab.Navigator>
  );
};

export default TabTopNavigator;
