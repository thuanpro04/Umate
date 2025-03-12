import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  ButtonComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
} from '../Components';
import {ArrowLeft, ArrowLeft2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {globalStyles} from '../../Styles/globalStyle';
import LinearGradient from 'react-native-linear-gradient';
import ScanBarcode from './ScanBarcode';
import {useTranslation} from 'react-i18next';

const UserQRCode = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const {t} = useTranslation();

  const [isFocused, setIsFocused] = useState(true);
  const qrData = JSON.stringify({
    userId: auth.userId,
  });
  const renderQRCodeSvg = () => {
    return (
      <View style={styles.qrWrapper}>
        <Text style={styles.title}>{t('personal_qr')}</Text>
        <QRCode value={qrData} size={220} />
      </View>
    );
  };
  const renderScanner = () => {
    return <ScanBarcode />;
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={appColors.white} />
        }
        onPress1={() => navigation.goBack()}
      />

      {/* QR Code */}
      <View style={{flex: 1, justifyContent: 'center'}}>
        {isFocused ? renderQRCodeSvg() : renderScanner()}

        {/* Button Actions */}
        <SpaceComponent height={40} />
        <RowComponent styles={{justifyContent: 'center', marginTop: 20}}>
          <ButtonComponent
            type="action"
            label={t('view_qr')}
            styles={[
              styles.btn,
              {backgroundColor: isFocused ? appColors.white : appColors.blue},
            ]}
            labelColor={isFocused ? appColors.blueBack : appColors.white}
            onPress={() => setIsFocused(true)}
          />
          <ButtonComponent
            type="action"
            label={t('scan_qr')}
            styles={[
              styles.btn,
              {backgroundColor: isFocused ? appColors.blue : appColors.white},
            ]}
            labelColor={!isFocused ? appColors.blueBack : appColors.white}
            onPress={() => setIsFocused(!isFocused)}
          />
        </RowComponent>
      </View>
    </SafeAreaView>
  );
};

export default UserQRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  qrWrapper: {
    backgroundColor: '#FFF',
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
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
