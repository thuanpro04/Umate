import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MemberGroupScreens from '../Messages/Screens/MemberGroupScreens';
import LibraryScreens from '../Messages/Screens/LibraryScreens';
const Drawer = createDrawerNavigator();
const MessageDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}
      initialRouteName='MemberGroup'>
      <Drawer.Screen name="MemberGroup" component={MemberGroupScreens} />
      <Drawer.Screen name="Library" component={LibraryScreens} />
      
    </Drawer.Navigator>
  );
};

export default MessageDrawerNavigator;

const styles = StyleSheet.create({});
