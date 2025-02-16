/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
messaging().setBackgroundMessageHandler(mess =>
  console.log(mess.notification.body),
);
AppRegistry.registerComponent(appName, () => App);
