import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { Host } from 'react-native-portalize';
import { Provider } from 'react-redux';
import store from './Src/redux/store';
import AppRouters from './Src/Screens/Navigators/AppRouters';
import { HandleNotification } from './Src/Screens/Untils/HandleNotification';
import { Notification } from './Src/Screens/Untils/Notification';
import { appColors } from './Src/Theme/Colors/appColors';
const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
    // HandleNotification.checkNotificationPertion();
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
            <AppRouters />
          </NavigationContainer>
        </Host>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
