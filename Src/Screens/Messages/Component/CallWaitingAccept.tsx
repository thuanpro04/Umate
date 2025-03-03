import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {CallCalling} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {UserInfo} from '../../Untils/UserInfo';
import {globalStyles} from '../../../Styles/globalStyle';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute} from '@react-navigation/native';
import {io, Socket} from 'socket.io-client';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const CallWaitingAccept = ({navigation}: any) => {
  const {avatar, name} = useRoute().params as {
    avatar: string;
    name: string;
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 8000);

    return () => clearTimeout(timer); // Chỉ hủy khi component unmount
  }, [navigation]);
  return (
    <LinearGradient
      colors={['#004AAD', '#E3F2FD']} // Trắng nhạt -> Xanh dương
      style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={{uri: avatar}} style={globalStyles.imgStyles} />
          <ActivityIndicator
            size="large"
            color="#00AC3B"
            style={{position: 'absolute', top: '45%'}}
          />
          <SpaceComponent height={12} />
          <RowComponent>
            <CallCalling size={appInfo.sizeIconBold} color={appColors.green} />
            <TextComponent
              label={`Đang kết nối ${UserInfo.getName(name)}`}
              styles={{}}
              color="white"
            />
          </RowComponent>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{backgroundColor: 'red', borderRadius: 100, padding: 16}}>
          <MaterialIcons
            name="call-end"
            size={appInfo.sizeIconBold}
            color="white"
          />
        </TouchableOpacity>
        <SpaceComponent height={80} />
      </View>
    </LinearGradient>
  );
};

export default CallWaitingAccept;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    marginTop: StatusBar.currentHeight,
  },
});
