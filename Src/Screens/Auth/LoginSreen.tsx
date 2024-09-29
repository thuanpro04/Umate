import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import authenticationApi from '../../apis/authApi';
import Google from '../../assets/svgs/Google.svg';
import {addAuth, removeAuth} from '../../redux/reducers/authReducer';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {Notification} from '../Untils/Notification';
import {Validate} from '../Untils/Validate';
import LoadingModal from '../Modal/LoadingModal';
import Toast from 'react-native-toast-message';
const LoginSreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '255214993798-jot48ccnfct32m4n9b1ud0pjgf17ag7p.apps.googleusercontent.com',
    });
  }, []);
  const handleSignOutAndCleanup = async () => {
    await GoogleSignin.signOut();
    dispatch(removeAuth());
    await AsyncStorage.removeItem('auth');
  };

  const getDataUserWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const emailUser = userInfo.data?.user.email;

      if (!Validate.Email(emailUser)) {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: `Please log in with your school's gmail account.`,
          position: 'top', // Vị trí của Toast (top, bottom)
          visibilityTime: 4000, // Thời gian hiển thị toast
        });
        await handleSignOutAndCleanup();
        return null; // Dừng lại nếu email không hợp lệ
      }
      return userInfo.data?.user;
    } catch (error) {
      setIsLoading(false);
      return null; // Đảm bảo trả về null khi có lỗi xảy ra
    }
  };

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    const userInfo = await getDataUserWithGoogle();
    if (!userInfo) {
      setIsLoading(false);
      return;
    }

    const data = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      familyName: userInfo.familyName,
      givenName: userInfo.givenName,
      photo: userInfo.photo,
      access: Validate.Email_Admin(userInfo.email) ? 'true' : 'false',
    };
    try {
      const res = await authenticationApi.handleAuthentication(
        '/login',
        data,
        'post',
      );
      console.log(res.data);
      dispatch(addAuth(res?.data));
      await AsyncStorage.setItem('auth', JSON.stringify(res?.data));
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text2: 'Welcome to UMate 👋',
        position: 'top', // Vị trí của Toast (top, bottom)
        visibilityTime: 4000, // Thời gian hiển thị toast
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: `Login failed, please try again later.`,
        position: 'top', // Vị trí của Toast (top, bottom)
        visibilityTime: 4000, // Thời gian hiển thị toast
      });
    }
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
            <TextComponent label="UMATE" styles={{fontStyle: 'italic'}} title />
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
          lable="Sign In with Google"
          styles={styles.button}
          bgColor={appColors.blue2}
          lableColor={appColors.white}
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
    paddingVertical: 8,
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
