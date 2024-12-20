import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Message, People, Profile, Ship} from 'iconsax-react-native';
import React, {ReactNode, useState} from 'react';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {CircleComponent, TextComponent} from '../Components/index';
import {
  AddGroupScreens,
  HomeScreen,
  MessageScreen,
  MyFriendScreen,
  ProfileScreen,
} from '../index';
import PostEvent from '../Events/PostEvent';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          backgroundColor: appColors.white,
          display: isTabBarVisible ? 'flex' : 'none',
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
            case 'PostEvent':
              icon = (
                <CircleComponent
                  size={52}
                  styles={{marginTop: Platform.OS === 'ios' ? -50 : -60}}>
                  <Ship size={24} color={appColors.white} variant="Bold" />
                </CircleComponent>
              );
              break;
            case 'Friends':
              icon = <People size={size} color={color} />;
              break;

            case 'Messages':
              icon = <Message size={size} color={color} />;
              break;
          }
          return icon;
        },
        tabBarLabel({focused}) {
          return route.name === 'PostEvent' ? null : (
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Friends" component={MyFriendScreen} />
      <Tab.Screen
        name="PostEvent"
        children={() => <PostEvent setIsTabBarVisible={setIsTabBarVisible} />}
      />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
