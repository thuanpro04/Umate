import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Google from '../../assets/svgs/Google.svg';
import {
  addAuth,
  authSelector,
  removeAuth,
} from '../../redux/reducers/authReducer';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import LoadingModal from '../Modal/LoadingModal';
import {Auth} from '../Services/authService.';
import {Notification} from '../Untils/Notification';
import {Validate} from '../Untils/Validate';
import {setTheme, toggleTheme} from '../../redux/reducers/themeSlice';
import {addProfile, profileSelector} from '../../redux/reducers/profileSlice';
import {addFriend} from '../../redux/reducers/friendSlice';
import {addEvent} from '../../redux/reducers/eventSlice';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import {UserInfo} from '../Untils/UserInfo';
const LoginSreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.WEBCLIENTID,
    });
  }, []);
  // Hàm hiển thị toast để tái sử dụng

  const getDataUserWithGoogle = async () => {
    try {
      const userInfo = await Auth.getDataUserWithGoogle();
      const emailUser = userInfo?.email;
      if (!Validate.Email(emailUser)) {
        Notification.showToast(
          'error',
          'Login failed',
          "Please log in with your school's gmail account😔",
        );
        await Auth.SignOutAndCleanup();
        dispatch(removeAuth());
        return null; // Dừng lại nếu email không hợp lệ
      }
      const data = {
        userId: userInfo?.id,
        email: userInfo?.email,
        name: userInfo?.name,
        familyName: userInfo?.familyName,
        givenName: userInfo?.givenName,
        avatar: userInfo?.photo,
        access: Validate.Email_Admin(userInfo?.email) ? 'true' : 'false',
      };
      return data;
    } catch (error) {
      console.error('Error fetching Google user data:', error);
      return null; // Đảm bảo trả về null khi có lỗi xảy ra
    }
  };

  const handleLoginWithGoogle = async () => {
    setIsLoading(true); // Chỉ gọi 1 lần lúc bắt đầu
    const data = await getDataUserWithGoogle();
    if (!data) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await Auth.loginWithGoogle(data);
      dispatch(addAuth(res?.data.authSlice));
      dispatch(addProfile(res.data.profileSlice));
      dispatch(addFriend(res.data.friendSlice));
      dispatch(addEvent(res.data.eventSlice));
      dispatch(setTheme(res.data.authSlice.theme));

      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          auth: res?.data.authSlice,
          profile: res?.data.profileSlice,
          friend: res?.data.friendSlice,
          event: res?.data.eventSlice,
        }),
      );
      Notification.showToast('success', 'Login Success', 'Welcome to UMate 👋');
      await onZegoService();
    } catch (error) {
      console.error('Login error:', error);
      Notification.showToast(
        'error',
        'Login failed',
        'Login failed, please try again later.',
      );
      await Auth.SignOutAndCleanup();
      dispatch(removeAuth());
    } finally {
      setIsLoading(false); // Đặt trạng thái lại sau khi mọi thứ đã hoàn thành
    }
  };
  const onZegoService = async () => {
    return ZegoUIKitPrebuiltCallService.init(
      process.env.APPID, // You can get it from ZEGOCLOUD's console
      process.env.APPSIGN, // You can get it from ZEGOCLOUD's console
      auth.userId, // It can be any valid characters, but we recommend using a phone number.
      UserInfo.getName(profile.name),
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
      },
    );
  };

  return (
    <ContainerComponent>
      <LoadingModal visible={isLoading} />
      <Image
        source={require('../../assets/images/scene-with-young-children-playing-nature-outdoors.jpg')}
        style={styles.bgStyle}
        resizeMode="cover"
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: -appInfo.size.HEIGHT * 0.035,
        }}>
        <View style={styles.VContainer}>
          <SpaceComponent height={appInfo.size.HEIGHT * 0.025} />
          <RowComponent>
            <Image
              source={require('../../assets/images/logoApp.png')}
              style={styles.logo}
            />
            <TextComponent
              label="UMATE"
              styles={{fontStyle: 'italic', color: 'black'}}
              title
            />
          </RowComponent>
          <SpaceComponent height={appInfo.size.HEIGHT * 0.03} />
          <View style={styles.Vtext}>
            <TextComponent
              label="UMate - Your AI-powered social connector at Thu Dau Mot University. Find friends, join groups, and build meaningful connections based on your interests and personality."
              styles={styles.text}
            />
          </View>
        </View>
      </View>
      <View style={styles.VbtnStyle}>
        <ButtonComponent
          label="Sign In with Google"
          styles={styles.button}
          bgColor={appColors.blue2}
          labelColor={appColors.white}
          onPress={handleLoginWithGoogle}
          disabled={isLoading}
          iconLeft={
            <Google
              width={appInfo.size.HEIGHT * 0.04}
              height={appInfo.size.HEIGHT * 0.04}
            />
          }
          textStyle={{fontWeight: '600', fontSize: appInfo.size.WIDTH * 0.05}}
        />
        <SpaceComponent height={appInfo.size.HEIGHT * 0.02} />

        <TextComponent
          label="Please log in with your school's gmail account."
          size={appInfo.size.WIDTH * 0.04}
          styles={styles.hint}
        />
      </View>
    </ContainerComponent>
  );
};

export default LoginSreen;
const styles = StyleSheet.create({
  titleStyle: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
  bgStyle: {
    width: appInfo.size.WIDTH,
    height: appInfo.size.HEIGHT * 0.6,
  },
  button: {
    alignItems: 'center',
    width: '80%',
    paddingVertical: 14,
  },
  hint: {
    fontStyle: 'italic',
    color: appColors.blue3,
    fontWeight: '500',
  },
  VbtnStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontStyle: 'italic',
    color: appColors.black,
    textAlign: 'center',
  },
  VContainer: {
    backgroundColor: appColors.white,
    width: '100%',
    borderTopLeftRadius: appInfo.size.HEIGHT * 0.05,
    borderTopRightRadius: appInfo.size.HEIGHT * 0.05,
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: appInfo.size.HEIGHT * 0.04,
    width: appInfo.size.HEIGHT * 0.04,
  },
  Vtext: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
});
