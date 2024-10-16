import {
  ArrowLeft,
  Image,
  MessageQuestion,
  Setting2,
  User,
} from 'iconsax-react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  CarfeatureComponent,
  CarUserComponent,
  ContainerComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
} from '../Components';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
const ProfileScreen = () => {
  const auth = useSelector(authSelector);
  console.log(auth);
  const getName = (fullName: string) => {
    const name = fullName.split(' ');
    return name[0] + ' ' + name[1];
  };
  return (
    <ContainerComponent styles={{paddingHorizontal: 12}}>
      <RowComponent styles={{justifyContent:'center',paddingHorizontal:20}}>
        <CarUserComponent
          name={getName(auth.name)}
          isFind
          styles={{borderWidth: 0, gap: 20}}
          img={auth.avatar}
        />
        <Setting2 size={appInfo.sizeIconBold} color={appColors.black} />
      </RowComponent>

      <SpaceComponent height={30} />
      <CarfeatureComponent
        label="View profile"
        icon={<User size={appInfo.sizeIconBold} color={appColors.black} />}
        styles={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}
      />
      <SpaceComponent height={3} />
      <CarfeatureComponent
        label="Mute notifications"
        icon={
          <Ionicons
            size={appInfo.sizeIconBold}
            color={appColors.black}
            name="notifications-off-outline"
          />
        }
      />
      <SpaceComponent height={3} />

      <CarfeatureComponent
        label="Images"
        icon={<Image size={appInfo.sizeIconBold} color={appColors.black} />}
      />
      <SpaceComponent height={3} />

      <CarfeatureComponent
        label="Help && support"
        icon={
          <MessageQuestion
            size={appInfo.sizeIconBold}
            color={appColors.black}
          />
        }
        styles={{
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          borderColor: appColors.white,
        }}
      />
    </ContainerComponent>
  );
};

export default ProfileScreen;
const localStyle = StyleSheet.create({
  img: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
});
