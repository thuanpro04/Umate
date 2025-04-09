import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SpaceComponent, TextComponent} from '../../Components';
import {appColors} from '../../../Theme/Colors/appColors';
import {useTranslation} from 'react-i18next';
interface Props {
  name: string;
}
const BlockViewComponent = (props: Props) => {
  const {name} = props;
  const {t} = useTranslation();
  return (
    <View style={styles.block}>
      <TextComponent
        label={`${t('you_are_blocked')} ${name}`}
        styles={{fontWeight: '500', fontStyle: 'italic'}}
        color={appColors.white}
      />
      <SpaceComponent height={8} />
      <TextComponent label="🤫" size={28} />
    </View>
  );
};

export default BlockViewComponent;

const styles = StyleSheet.create({  block: {
    backgroundColor: '#81C784',
    height: 145,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',

    justifyContent: 'center',
  },});
