import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HeartAdd,
  Message,
  Profile,
  Profile2User,
  Setting2,
} from 'iconsax-react-native';
import React, {ReactNode} from 'react';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../Theme/Colors/appColors';
import {CircleComponent, TextComponent} from '../Components/index';
import {appInfo} from '../../Theme/appInfo';
import {
  HomeScreen,
  MessageScreen,
  MyFriendScreen,
  ProfileScreen,
  AddGroupScreens,
} from '../index';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: appInfo.size.HEIGHT * 0.038,
          borderTopRightRadius: appInfo.size.HEIGHT * 0.038,
        },
        tabBarIcon: ({focused, color, size}) => {
          let icon: ReactNode;
          size = 24;
          color = focused ? appColors.blue : appColors.grey;
          switch (route.name) {
            case 'Home':
              icon = <Ionicons name="home-outline" size={size} color={color} />;
              break;
            case 'Profile':
              icon = <Profile size={size} color={color} />;
              break;
            case 'AddGroup':
              icon = (
                <CircleComponent
                  size={52}
                  styles={{marginTop: Platform.OS === 'ios' ? -50 : -60}}>
                  <HeartAdd size={24} color={appColors.white} variant="Bold" />
                </CircleComponent>
              );
              break;
            case 'Friends':
              icon = <Profile2User size={size} color={color} />;
              break;

            case 'Message':
              icon = <Message size={size} color={color} />;
              break;
          }
          return icon;
        },
        tabBarLabel({focused}) {
          return route.name === 'AddGroup' || !focused ? null : (
            <TextComponent
              label={route.name}
              flex={0}
              size={12}
              color={focused ? appColors.focus : appColors.coolGray}
              styles={{marginBottom: Platform.OS === 'android' ? 12 : 0}}
            />
          );
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} key={"Home"}/>
      <Tab.Screen name="Friends" component={MyFriendScreen} key={"Friends"}/>
      <Tab.Screen name="AddGroup" component={AddGroupScreens} key={"AddGroup"}/>
      <Tab.Screen name="Message" component={MessageScreen} key={"Message"}/>
      <Tab.Screen name="Profile" component={ProfileScreen} key={"Profile"}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
