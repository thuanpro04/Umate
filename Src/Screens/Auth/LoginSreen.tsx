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
        Notification.showSnackbar(
          `Please log in with your school's gmail account.`,
          handleSignOutAndCleanup,
        );

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
      dispatch(addAuth(res?.data));
      await AsyncStorage.setItem('auth', JSON.stringify(res?.data));
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Notification.showSnackbar(
        `Login failed, please try again later.`,
        () => {},
      );
    }
  };

  return (
    <ContainerComponent>
      <Image
        source={require('../../assets/images/scene-with-young-children-playing-nature-outdoors.jpg')}
        style={{width: appInfo.size.WIDTH, height: appInfo.size.HEIGHT * 0.6}}
        resizeMode="cover"
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: -appInfo.size.HEIGHT * 0.035,
        }}>
        <View
          style={{
            backgroundColor: appColors.white,
            width: '100%',
            borderTopLeftRadius: appInfo.size.HEIGHT * 0.05,
            borderTopRightRadius: appInfo.size.HEIGHT * 0.05,
            flex: 1,
            alignItems: 'center',
          }}>
          <SpaceComponent height={appInfo.size.HEIGHT * 0.025} />
          <RowComponent>
            <Image
              source={require('../../assets/images/logoApp.png')}
              style={{
                height: appInfo.size.HEIGHT * 0.04,
                width: appInfo.size.HEIGHT * 0.04,
              }}
            />
            <TextComponent label="UMATE" styles={{fontStyle: 'italic'}} title />
          </RowComponent>
          <SpaceComponent height={appInfo.size.HEIGHT * 0.03} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '90%',
            }}>
            <TextComponent
              label="UMate - Your AI-powered social connector at Thu Dau Mot University. Find friends, join groups, and build meaningful connections based on your interests and personality."
              styles={{
                fontStyle: 'italic',
                color: appColors.black,
                textAlign: 'center',
              }}
            />
          </View>
        </View>
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <ButtonComponent
          lable="Sign In with Google"
          styles={{alignItems: 'center'}}
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
        />
        <SpaceComponent height={appInfo.size.HEIGHT * 0.02} />

        <TextComponent
          label="Please log in with your school's gmail account."
          size={appInfo.size.WIDTH * 0.04}
          styles={{
            fontStyle: 'italic',
            color: appColors.blue3,
            fontWeight: '500',
          }}
        />
      </View>
      <SpaceComponent height={appInfo.size.HEIGHT * 0.05} />
    </ContainerComponent>
  );
};

export default LoginSreen;
const styles = StyleSheet.create({
  titleStyle: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
