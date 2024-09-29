import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FriendsRequestScreen from '../Friends/FriendsRequestScreen';
import FriendsRespondScreen from '../Friends/FriendsRespondScreen';
import {appColors} from '../../Theme/Colors/appColors';

const Tab = createMaterialTopTabNavigator();
const TabTopNavigator = () => {
  return (
    <Tab.Navigator
      style={{flex: 1}}
      initialRouteName='Request'
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
      <Tab.Screen name="Request" component={FriendsRequestScreen}  key={'request'}/>
      <Tab.Screen name="Mate" component={FriendsRespondScreen} key={'mate'} />
    </Tab.Navigator>
  );
};

export default TabTopNavigator;
