import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import {Image} from 'react-native';
import {globalStyles} from '../../../Styles/globalStyle';
import {UserInfo} from '../../Untils/UserInfo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
interface Props {
  item: any;
  navigation: any;
  onCloseModal: () => void;
}
const CarUserLikeComponent = (props: Props) => {
  const {item, navigation, onCloseModal} = props;
  const {t} = useTranslation();

  return (
    <RowComponent
      styles={{alignItems: 'center', marginVertical: 12, marginHorizontal: 8}}>
      <RowComponent>
        <ButtonComponent
          type="action"
          onPress={() => {
            onCloseModal();
            navigation.navigate('PersonalScreen', {userId: item.userId});
          }}>
          <Image source={{uri: item.avatar}} style={globalStyles.userImg} />
        </ButtonComponent>
        <View>
          <TextComponent label={item.name} styles={globalStyles.label} />
          <SpaceComponent height={10} />
          <TextComponent
            label={item.majoring ?? t('majoring')}
            styles={{color: appColors.grey, fontSize: 14}}
          />
        </View>
      </RowComponent>
      <AntDesign name={'heart'} size={appInfo.sizeIcon} color={appColors.red} />
    </RowComponent>
  );
};

export default CarUserLikeComponent;

const styles = StyleSheet.create({});
