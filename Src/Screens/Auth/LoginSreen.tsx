import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect} from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import authenticationApi from '../../apis/authApi';

const LoginSreen = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
       "320095092434-d3p19btm7htmar26o2iq2d3ese32hit0.apps.googleusercontent.com"
    });
  }, []);

  const handelLoginwithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // Get the users ID token
      const data = await GoogleSignin.signIn();
      console.log(data);
      
      const res = await authenticationApi.handleAuthentication(
        '/login',
        data,
        'post',
      );
      console.log(res);
      
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
    }
  };

  return (
    <ContainerComponent>
      <Image
        source={require('../../assets/images/scene-with-young-children-playing-nature-outdoors.jpg')}
        style={{width: '100%', height: '57%'}}
        resizeMode="cover"
      />
      <View style={{flex: 1, alignItems: 'center', marginTop: -28}}>
        <View
          style={{
            backgroundColor: appColors.white,
            width: '100%',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            flex: 1,
            alignItems: 'center',
          }}>
          <SpaceComponent height={20} />
          <RowComponent>
            <Image source={require('../../assets/images/Group.png')} />
            <TextComponent label="UMATE" styles={{fontStyle: 'italic'}} title />
          </RowComponent>
          <SpaceComponent height={18} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '90%',
            }}>
            <TextComponent
              label="UMate - Your AI-powered social connector at Thu Dau Mot University. Find friends, join groups, and build meaningful connections based on your interests and personality."
              styles={{fontStyle: 'italic', color: appColors.black}}
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
          onPress={handelLoginwithGoogle}
        />
        <SpaceComponent height={15} />
        <TextComponent
          label="Please log in with your school's gmail account."
          size={16}
          styles={{
            fontStyle: 'italic',
            color: appColors.blue3,
            fontWeight: '500',
          }}
        />
      </View>
      <SpaceComponent height={60} />
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
