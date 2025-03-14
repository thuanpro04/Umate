import {StyleProp, StyleSheet, Text, View, ViewProps} from 'react-native';
import React from 'react';
import {appColors} from '../../Theme/Colors/appColors';
import QRCode from 'react-native-qrcode-svg';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';

interface Props {
  qrdata: string;
  styles?: StyleProp<ViewProps>;
  size?: number;
  title?: string;
}
const CustormQRCode = (props: Props) => {
  const {qrdata, styles, size, title} = props;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  return (
    <View
      style={[
        localStyle.qrWrapper,
        {backgroundColor: colors.background},
        styles,
      ]}>
      <Text style={localStyle.title}>{title}</Text>
      <QRCode value={qrdata} size={size ?? 220} />
    </View>
  );
};

export default CustormQRCode;

const localStyle = StyleSheet.create({
  qrWrapper: {
    paddingVertical: 30,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: appColors.black,
    marginBottom: 15,
  },
});
