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
      style={{ flex: 1 }}
      initialRouteName="SuggestFriend"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: appColors.white,
        },
        tabBarActiveTintColor: appColors.focus,
        tabBarInactiveTintColor: appColors.green,
        tabBarIndicatorStyle: {
          backgroundColor: appColors.focus,
        },
      }}>
      <Tab.Screen name="SuggestFriend" component={SuggestFriend}/>
      <Tab.Screen name="Request" component={FriendsRequestScreen} />
      <Tab.Screen name="Homie" component={FriendsRespondScreen}  />
    </Tab.Navigator>
  );
};

export default TabTopNavigator;
