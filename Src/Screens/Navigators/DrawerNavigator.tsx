import {View, Text} from 'react-native';
import React from 'react';
import TabNavigator from './TabNavigator';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerCustomsMenu from '../Components/DrawerCustomsMenu';
import {appColors} from '../../Theme/Colors/appColors';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        
      }}
      initialRouteName='HomeNavigator'
      drawerContent={props => <DrawerCustomsMenu {...props} />}>
      <Drawer.Screen
        name="HomeNavigator"
        component={TabNavigator}
        key={'HomeNavigator'}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
