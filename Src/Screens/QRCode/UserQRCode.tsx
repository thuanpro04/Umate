import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
} from '../Components';
import CustormQRCode from './CustormQRCode';
import ScanBarcode from './ScanBarcode';
import {themeSelector} from '../../redux/reducers/themeSlice';

const UserQRCode = () => {
  const auth = useSelector(authSelector);
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [isFocused, setIsFocused] = useState(true);
  const qrdata = JSON.stringify({id: auth.userId});
  const encrytion = btoa(qrdata);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme];
  const renderScanner = () => {
    return <ScanBarcode />;
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        onPress1={() => navigation.goBack()}
      />

      <View style={{flex: 1, justifyContent: 'center'}}>
        {isFocused ? (
          <CustormQRCode title={t('personal_qr')} qrdata={encrytion} />
        ) : (
          renderScanner()
        )}

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
