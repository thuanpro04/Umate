import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HeartAdd, Message, Profile2User, Setting2} from 'iconsax-react-native';
import React, {ReactNode} from 'react';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../Theme/Colors/appColors';
import AddGroupScreens from '../AddGroupScreens';
import ChatHistory from '../ChatHistory/ChatHistory';
import {TextComponent} from '../Components';
import MyFriendScreen from '../Friends/MyFriendScreen';
import HomeScreen from '../Home/HomeScreen';
import ProfileScreen from '../Profile/ProfileScreen';
import {appInfo} from '../../Theme/appInfo';
import CircleComponent from '../Components/CircleComponent';

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
              icon = <Setting2 size={size} color={color} />;
              break;
            case 'AddGroup':
              icon = (
                <CircleComponent
                  size={52}
                  styles={{marginTop: Platform.OS === 'ios' ? -50 : -60}}
                  >
                  <HeartAdd size={24} color={appColors.white} variant="Bold" />
                </CircleComponent>
              );
              break;
            case 'Friends':
              icon = <Profile2User size={size} color={color} />;
              break;

            case 'Chat':
              icon = <Message size={size} color={color} />;
              break;
          }
          return icon;
        },
        tabBarLabel({focused}) {
          return route.name === 'AddGroup' ? null : (
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
      <Tab.Screen name="AddGroup" component={AddGroupScreens} />
      <Tab.Screen name="Chat" component={ChatHistory} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
