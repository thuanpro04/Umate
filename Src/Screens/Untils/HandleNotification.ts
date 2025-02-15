import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import usersAPI from '../../apis/usersApi';
export class HandleNotification {
  static checkNotificationPertion = async () => {
    const authStatus = await messaging().requestPermission();
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.getFcmToken();
    }
  };
  static getFcmToken = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmtoken');
    if (!fcmToken) {
      const token = await messaging().getToken();

      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
        this.updateTokeForUser(token);
      }
    } else {
      this.updateTokeForUser(fcmToken);
    }
  };
  static updateTokeForUser = async (token: string) => {
    const res = await AsyncStorage.getItem('auth');
    if (res) {
      const auth = JSON.parse(res);
      const {fcmTokens} = auth;
      if (fcmTokens && !fcmTokens.includes(token)) {
        fcmTokens.push(token);
        try {
          await this.update(fcmTokens, auth.userId);
        } catch (error) {
          console.log('Update fmctoken fail error: ', error);
        }
      }
    }
  };
  static update = async (fcmTokens: string[], userId: string) => {
    console.log('Sending to API:', {userId, fcmTokens});
    const response = await usersAPI.handleUsers(
      '/update-fcmtoken',
      {
        userId,
        fcmTokens,
      },
      'post',
    );
    console.log('response', response);
  };
}
