import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StatusBar, StyleSheet, View} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import authenticationApi from '../../apis/authApi';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {appInfo} from '../../Theme/appInfo';
import LoadingModal from '../Modal/LoadingModal';
import Snackbar from 'react-native-snackbar';
const LoginSreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataUser, setDataUser] = useState<any>();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '255214993798-jot48ccnfct32m4n9b1ud0pjgf17ag7p.apps.googleusercontent.com',
    });
  }, []);

  const getDataUserWithGoogle = async () => {
    try {
      // setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const dataUsers = await GoogleSignin.signIn();
      const emailUser = dataUsers.data?.user.email;
      if (!emailUser?.endsWith('@student.tdmu.edu.vn')) {
        // Alert.alert(`Please log in with your school's gmail account.`)
        Snackbar.show({
          text: `Please log in with your school's gmail account.`,
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'Đóng',
            onPress: () => {},
          },
        });
        await GoogleSignin.signOut();
      } else {
        console.log('get users', dataUsers.data?.user);
        return dataUsers.data?.user;
      }
      // Create a Google credential with the token
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Handle error when the user has already signed up with a different credential
        console.log('Error: account-exists-with-different-credential');
      } else if (error.code === 'auth/invalid-credential') {
        // Handle error when the credential is invalid
        console.log('Error: invalid-credential');
      } else if (error.code === 'auth/user-disabled') {
        // Handle error when the user is disabled
        console.log('Error: user-disabled');
      } else {
        // Handle other errors
        console.log('Error: ', error);
      }
      setIsLoading(false);
    }
  };
  const handleLoginWithGoogle = async () => {
    try {
      const data = await getDataUserWithGoogle();
      console.log('data', data);
      // const data={
      //   email:"phanminhthuan240304@gmail.com",
      //   name:"ThuanPro"
      // }
      const res = await authenticationApi.handleAuthentication(
        '/login',
        data,
        'post',
      );
      console.log(res);
    } catch (error) {
      console.log(error);
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
            <Image source={require('../../assets/images/Group.png')} />
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
      <LoadingModal visible={isLoading} />
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
