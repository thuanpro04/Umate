import React from 'react';
import LoginSreen from './Src/Screens/Auth/LoginSreen';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import store from './Src/redux/store';
import MainNavigator from './Src/Screens/Navigators/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import AppRouters from './Src/Screens/Navigators/AppRouters';
const App = () => {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <NavigationContainer>
        <AppRouters/>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
