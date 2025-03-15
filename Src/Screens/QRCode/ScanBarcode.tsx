import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Camera, CameraType} from 'react-native-camera-kit';
import {appInfo} from '../../Theme/appInfo';
import {useNavigation} from '@react-navigation/native';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import {useTranslation} from 'react-i18next';
import {appColors} from '../../Theme/Colors/appColors';

const ScanBarcode = () => {
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const onBarcodeScan = async (event: any) => {
    if (!scanned) {
      setScanned(true);
      try {
        const dataString = event.nativeEvent.codeStringValue;
        const decodedData = JSON.parse(atob(dataString));
        const user = await handleGetUserInfoById(decodedData.id);
        Alert.alert(t('qr_found'), `${user.name}`, [
          {
            text: t('scan_again'),
            onPress: () => setScanned(false),
          },
          {
            text: t('next'),
            onPress: () =>
              navigation.navigate('PersonalScreen', {
                userId: decodedData.id,
              }),
          },
        ]);
      } catch (error) {
        console.log('Scan bar qrcode error: ', error);
      }
    }
  };
  const handleGetUserInfoById = async (userId: string) => {
    const res = await userServices.getUserInfo(userId);
    if (res && res.data) {
      console.log('userInfo', res.data);
      return res.data;
    }
   
  };
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        scanBarcode={true}
        onReadCode={onBarcodeScan}
        showFrame={true}
        laserColor={appColors.blue}
        frameColor="white"
        flashMode="auto"
        torchMode="off"
        cameraType={CameraType.Back}
        zoomMode="on"
      />
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{t('place_qr_in_frame')}</Text>
      </View>
    </View>
  );
};

export default ScanBarcode;

const styles = StyleSheet.create({
  container: {},
  camera: {
    height: appInfo.size.HEIGHT * 0.4,
    width: '100%',
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
});
