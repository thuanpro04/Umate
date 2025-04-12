import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles} from '../../../Styles/globalStyle';
import {appColors} from '../../../Theme/Colors/appColors';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import {appInfo} from '../../../Theme/appInfo';
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
      <View style={styles.likeIconContainer}>
        <MaterialCommunityIcons name="thumb-up" size={14} color="#ffffff" />
      </View>
    </RowComponent>
  );
};

export default CarUserLikeComponent;

const styles = StyleSheet.create({
  likeIconContainer: {
    backgroundColor: '#2196F3',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
