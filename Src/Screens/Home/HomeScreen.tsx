import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {HambergerMenu} from 'iconsax-react-native';
import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {Address} from '../../assets/svgs/indexSvg';
import {removeAuth} from '../../redux/reducers/authReducer';
import {
  CarComponent,
  ContainerComponent,
  HeaderComponent,
  SpaceComponent,
} from '../Components';
import {globalStyles} from '../../Styles/globalStyle';

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
    <SafeAreaView
      style={[globalStyles.main, {backgroundColor: appColors.white, paddingHorizontal:0}]}>
      <HeaderComponent
        iconLeft={
          <HambergerMenu size={appInfo.sizeIconBold} color={appColors.black} />
        }
        iconRight={<Address />}
        onPress1={() => navigation.openDrawer()}
      />
      <ScrollView>
        <CarComponent img={require('../../assets/images/tdmu.jpg')} />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image.png')} />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image1.png')} />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image2.png')} />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/image3.png')} />
        <SpaceComponent height={12} isCrossBar />
        <CarComponent img={require('../../assets/images/tdmu.jpg')} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
