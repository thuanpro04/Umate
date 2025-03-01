import React, {useEffect} from 'react';
import LoginSreen from './Src/Screens/Auth/LoginSreen';
import {Provider, useSelector} from 'react-redux';
import {StatusBar} from 'react-native';
import store from './Src/redux/store';
import MainNavigator from './Src/Screens/Navigators/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import AppRouters from './Src/Screens/Navigators/AppRouters';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {appColors} from './Src/Theme/Colors/appColors';
import Toast from 'react-native-toast-message';
import ToastConfig from './Src/Screens/Components/ToastConfig';
import {Host} from 'react-native-portalize';
import Orientation from 'react-native-orientation-locker';
import {HandleNotification} from './Src/Screens/Untils/HandleNotification';
import messaging from '@react-native-firebase/messaging';
import {Notification} from './Src/Screens/Untils/Notification';
import {themeSelector} from './Src/redux/reducers/themeSlice';
import {ZegoCallInvitationDialog} from '@zegocloud/zego-uikit-prebuilt-call-rn';
const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
    HandleNotification.checkNotificationPertion();
  }, []);

  useEffect(() => {
    messaging().onMessage(async mess => {
      Notification.showToast(
        'info',
        mess.notification?.title ?? '',
        mess.notification?.body ?? '',
      );
    });
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar
          barStyle={'dark-content'} // điều chỉnh màu pin, wifi
          translucent // quyết định liệu thanh trạng thái có trong suốt
          backgroundColor={appColors.blue2}
        />
        <Host>
          <NavigationContainer>
            <ZegoCallInvitationDialog/>
            <AppRouters />
          </NavigationContainer>
        </Host>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
