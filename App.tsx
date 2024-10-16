import React from 'react';
import LoginSreen from './Src/Screens/Auth/LoginSreen';
import {Provider} from 'react-redux';
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
const App = () => {
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
            <Toast />
          </NavigationContainer>
        </Host>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
