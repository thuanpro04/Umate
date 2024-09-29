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
import {HambergerMenu, Map, Map1, Menu, Star1} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';

const HomeScreen = ({navigation}: any) => {
  const disPath = useDispatch();
  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      disPath(removeAuth());
      await AsyncStorage.removeItem('auth');
    } catch (error) {}
  };
  return (
    <ContainerComponent isScroll>
      <HeaderComponent
        iconLeft={
          <HambergerMenu size={appInfo.sizeIconBold} color={appColors.black} />
        }
        iconRight={
          <Map1
            size={appInfo.sizeIconBold}
            color={appColors.green}
            variant="Bold" 
          />
        }
        onPress1={() => navigation.openDrawer()}
        isBcolor
      />
      <View style={{marginBottom: appInfo.size.HEIGHT * 0.045}}>
        <CarComponent />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent />
        <SpaceComponent height={12} isCrossBar/>
        <CarComponent />
        <SpaceComponent height={12} isCrossBar/>
        <CarComponent />
        <SpaceComponent height={12} isCrossBar/>
        <CarComponent />
        <SpaceComponent height={12} isCrossBar/>
        <CarComponent />
      </View>
    </ContainerComponent>
  );
};

export default HomeScreen;
