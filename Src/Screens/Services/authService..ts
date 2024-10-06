import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import authenticationApi from '../../apis/authApi';
const loginWithGoogle = async (data: any) => {
  const res = await authenticationApi.handleAuthentication(
    '/login',
    data,
    'post',
  );
  return res;
};

const SignOutAndCleanup = async () => {
  await GoogleSignin.signOut();
  await AsyncStorage.removeItem('auth');
};

const getDataUserWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo.data?.user;
};

export const Auth = {
  SignOutAndCleanup,
  getDataUserWithGoogle,
  loginWithGoogle,
};
