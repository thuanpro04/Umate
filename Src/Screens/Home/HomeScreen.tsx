import {View, Text} from 'react-native';
import React from 'react';
import {
  ButtonComponent,
  CarComponent,
  ContainerComponent,
  HeaderComponent,
  SpaceComponent,
} from '../Components';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {removeAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HambergerMenu, Menu, Star1} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';

const HomeScreen = () => {
  const disPath = useDispatch();

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      disPath(removeAuth());
      await AsyncStorage.removeItem('auth');
    } catch (error) {}
  };
  return (
    <ContainerComponent isScroll styles={{backgroundColor:'#eeeeee'}}>
      <HeaderComponent
        iconLeft={<HambergerMenu size={22} color={appColors.black} />}
        iconRight={<Star1 size={25} color={appColors.black} />}
        onPress1={()=> console.log("hello")
        }
      />
      <CarComponent/>
      <SpaceComponent height={20}/>
      <CarComponent/>
      <CarComponent/>
      <CarComponent/>
    </ContainerComponent>
  );
};

export default HomeScreen;
