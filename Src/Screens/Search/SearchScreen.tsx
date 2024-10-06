import {useNavigation} from '@react-navigation/native';
import {ArrowRight2, SearchNormal} from 'iconsax-react-native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import Feather from 'react-native-vector-icons/Feather';

import {
  CarfeatureComponent,
  CarUserComponent,
  ContainerComponent,
  HeaderComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {globalStyles} from '../../Styles/globalStyle';
const SearchScreen = () => {
  const [value, setValue] = useState('');
  const navigation = useNavigation();
  return (
    <ContainerComponent isScroll styles={[{paddingHorizontal:12}]}>
      <HeaderComponent
        styles={{}}
        isBcolor
        iconLeft={
          <AntDesign
            name="close"
            size={appInfo.sizeIconBold}
            color={appColors.black}
          />
        }
        title="Find friends"
      />
      <SpaceComponent height={20}/>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <InputComponent
          styles={{}}
          type="default"
          placehold="Search ..."
          value={value}
          onChange={text => setValue(text)}
          allowClear
          affix={
            <SearchNormal
              size={appInfo.sizeIcon}
              color={appColors.blue}
              variant="Broken"
            />
          }
          multiline
          numberOfLines={2}
        />
      </View>
      <SpaceComponent height={20} />

      <View
        style={{
          borderTopColor: appColors.grey2,
          borderTopWidth: 0.2,
        }}
      />
      <View style={{marginLeft:15}}><TextComponent title label="3 kết quả" /></View>
      <View style={{alignItems: 'center'}}>
        <SpaceComponent height={20} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
        <CarUserComponent isFind name="Thuận Phan" icon />
        <SpaceComponent height={12} />
      </View>
      <SpaceComponent height={20} />
      <View>
        <CarfeatureComponent
        onPress={()=> console.log("hello")
        }
          label={'By friends list'}
          icon={
            <Feather
              name="book-open"
              size={appInfo.sizeIcon}
              color={'#363B4BC2'}
            />
          }
          styles={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}
        />
        <CarfeatureComponent
          label={'Theo khoa'}
          icon={
            <Feather
              name="external-link"
              size={appInfo.sizeIcon}
              color={'#363B4BC2'}
            />
          }
        />
        <CarfeatureComponent
          label={'By class'}
          icon={
            <Feather
              name="user-plus"
              size={appInfo.sizeIcon}
              color={'#363B4BC2'}
            />
          }
          styles={{
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomColor: appColors.white,
          }}
        />
      </View>
      <SpaceComponent height={40} />
    </ContainerComponent>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
