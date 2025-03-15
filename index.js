/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);
messaging().setBackgroundMessageHandler(mess =>
  console.log(mess.notification.body),
);
import PushNotification from 'react-native-push-notification';
PushNotification.createChannel(
  {
    channelId: 'zego_video_call', // ID kênh thông báo
    channelName: 'zego_video_call', // Tên hiển thị
    importance: 4, // HIGH_PRIORITY
    vibrate: true,
    playSound: true, // Có phát âm thanh không
    soundName: 'default', // Âm thanh mặc định
    
  },
  created => console.log(`🔔 Kênh thông báo đã tạo: ${created}`),
);
AppRegistry.registerComponent(appName, () => App);
