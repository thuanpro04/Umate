import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';

export class Notification {
  static showSnackbar = (message: string, onPress: any) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'Close',
        onPress: onPress,
      },
    });
  };
  static showToast = (type: any, text1: string, text2: string) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      visibilityTime: 4000,
    });
  };
}
