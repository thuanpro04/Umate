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
import {Address} from '../../assets/svgs/indexSvg';

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
        iconRight={<Address/>}
        onPress1={() => navigation.openDrawer()}
        isBcolor
      />
      <View style={{marginBottom: appInfo.size.HEIGHT * 0.045}}>
        <CarComponent img={require('../../assets/images/tdmu.jpg')}/>
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image.png')}/>
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image1.png')}/>
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image2.png')} />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image3.png')}/>
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/tdmu.jpg')}/>
      </View>
    </ContainerComponent>
  );
};

export default HomeScreen;
