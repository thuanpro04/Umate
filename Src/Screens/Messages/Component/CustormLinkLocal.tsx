import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {TextComponent} from '../../Components';
import {appColors} from '../../../Theme/Colors/appColors';
import {appInfo} from '../../../Theme/appInfo';
interface Props {
  isUser: boolean;
  openLinkLocal: () => void;
}
const CustormLinkLocal = (props: Props) => {
  const {isUser, openLinkLocal} = props;
  return (
    <View
      style={{
        height: 230,
        width: appInfo.size.WIDTH * 0.52,
      }}>
      <TouchableOpacity
        onPress={openLinkLocal}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '80%',
          backgroundColor: appColors.blue,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <Image
          source={require('../../../assets/images/logoApp.png')}
          style={styles.logo}
        />
        <TextComponent label="Nhấn để xem chi tiết" color={appColors.white} />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: appColors.black,
          height: '20%',
          borderBottomLeftRadius: !isUser ? 0 : 20,
          borderBottomRightRadius: !isUser ? 20 : 0,
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: 12,
        }}>
        <TextComponent label="Umate" color={appColors.grey2} />
      </View>
    </View>
  );
};

export default CustormLinkLocal;

const styles = StyleSheet.create({
  logo: {
    height: appInfo.size.HEIGHT * 0.04,
    width: appInfo.size.HEIGHT * 0.04,
  },
});
