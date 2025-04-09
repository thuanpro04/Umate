import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Message, People, Profile} from 'iconsax-react-native';
import React, {ReactNode, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import GeminiChat from '../AiStudioScreen/GeminiChat';
import {CircleComponent, TextComponent} from '../Components/index';
import {HomeScreen, MessageScreen, MyFriendScreen} from '../index';
import MyPostScreen from '../MyPost/MyPostScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName={t('home')}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: theme === 'light' ? 12 : 0,
          borderTopRightRadius: theme === 'light' ? 12 : 0,
          backgroundColor: colors.background,
          display: isTabBarVisible ? 'flex' : 'none',
          borderTopColor: colors.background,
        },
        tabBarIcon: ({focused, color, size}) => {
          let icon: ReactNode;
          size = 24;
          color = focused ? appColors.blue : appColors.grey;
          switch (route.name) {
            case t('home'):
              icon = <Ionicons name="home-outline" size={size} color={color} />;
              break;
            case t('post'):
              icon = <MaterialIcons name="compost" size={size} color={color} />;
              break;
            case 'GeminiChat':
              icon = (
                <CircleComponent
                  size={52}
                  styles={{marginTop: Platform.OS === 'ios' ? -50 : -60}}>
                  <Entypo name="github" size={24} color={appColors.white} />
                </CircleComponent>
              );
              break;
            case t('friend'):
              icon = <People size={size} color={color} />;
              break;

            case t('message'):
              icon = <Message size={size} color={color} />;
              break;
          }
          return icon;
        },
        tabBarLabel({focused}) {
          return route.name === 'GeminiChat' ? null : (
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
      <Tab.Screen name={t('home')} component={HomeScreen} />
      <Tab.Screen name={t('post')} component={MyPostScreen} />
      <Tab.Screen
        name="GeminiChat"
        children={() => (
          <GeminiChat
            onFocus={() => setIsTabBarVisible(false)}
            onBlur={() => setIsTabBarVisible(true)}
          />
        )}
      />
      <Tab.Screen name={t('message')} component={MessageScreen} />
      <Tab.Screen name={t('friend')} component={MyFriendScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
