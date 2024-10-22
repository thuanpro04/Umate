import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  ContainerComponent,
  HeaderComponent,
  InputComponent,
  RowComponent,
  TextComponent,
} from '../Components';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../Styles/globalStyle';
import {ArrowLeft2, Camera, More, SearchNormal} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';

const SetUpProfile = () => {
  const [value, setvalue] = useState('');
  const auth = useSelector(authSelector);

  return (
    <ContainerComponent>
      <HeaderComponent
        title="Profile"
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
        iconRight={
          <More size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
      />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={{uri: auth.avatar}}
          resizeMode="cover"
          style={[globalStyles.userImg, {zIndex: -1}]}
        />
        <View
          style={[
            globalStyles.userImg,
            {
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.3)',
            },
          ]}>
          <Camera size={appInfo.sizeIcon} color={appColors.blueBack} />
        </View>
      </View>
      <View style={{justifyContent: 'center', flex: 1, paddingHorizontal: 18}}>
        <RowComponent styles={globalStyles.searchStyles}>
          <SearchNormal
            size={appInfo.sizeIcon}
            color={appColors.grey}
            variant="Broken"
          />
          <TextComponent
            label="UserName ..."
            styles={{fontWeight: '400', color: appColors.grey}}
          />
        </RowComponent>
      </View>
    </ContainerComponent>
  );
};

export default SetUpProfile;
const localStyles = StyleSheet.create({
  inputStyle: {
    width: '75%',
    paddingRight: 50,
    paddingVertical: 4,
  },
});
