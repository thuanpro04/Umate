import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SpaceComponent, TextComponent} from '../../Components';
import QRCode from 'react-native-qrcode-svg';
import {appColors} from '../../../Theme/Colors/appColors';
interface Props {
  qrdata: string;
  showNotificationQrCode: () => void;
}
const ShowViewQrCode = (props: Props) => {
  const {qrdata, showNotificationQrCode} = props;
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <SpaceComponent height={10} />
      <QRCode value={qrdata} size={200} />
      <SpaceComponent height={5} />
      <View
        style={{
          backgroundColor: 'grey',
          width: '100%',
          height: 1,
        }}
      />
      <SpaceComponent height={10} />
      <TouchableOpacity onPress={showNotificationQrCode}>
        <TextComponent label="Quét mã " color={appColors.blue} />
      </TouchableOpacity>
    </View>
  );
};

export default ShowViewQrCode;

const styles = StyleSheet.create({});
