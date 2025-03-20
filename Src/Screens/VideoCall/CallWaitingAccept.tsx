import {useRoute} from '@react-navigation/native';
import {CallCalling} from 'iconsax-react-native';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {socketSelector} from '../../redux/reducers/socketSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import {UserInfo} from '../Untils/UserInfo';
import {useTranslation} from 'react-i18next';
import {Notification} from '../Untils/Notification';
const CallWaitingAccept = ({navigation}: any) => {
  const {avatar, name, callID, targetId, userId, type, groupId} = useRoute()
    .params as {
    avatar: string;
    name: string;
    callID: string;
    targetId: string;
    userId: string;
    type: string;
    groupId: string;
  };

  const profile = useSelector(profileSelector);
  const socket = useSelector(socketSelector).socket;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const soundRef = useRef<Sound | null>(null);
  const {t} = useTranslation();

  const hanldeCancelCall = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    const data = {userId, targetId, callID, name: profile.name, type, groupId};
    socket.emit('cancelCall', data);
    navigation.navigate(t('home'));
    return socket.off('cancelCall');
  };

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);
  useEffect(() => {
    const ringtone = new Sound(
      'zego_incoming.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Call waiting accept sound error: ', error);
        } else {
          ringtone.setNumberOfLoops(-1);
          ringtone.play();
          soundRef.current = ringtone;
        }
      },
    );

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
    };
  }, []);
  useEffect(() => {
    socket.on('feedbackAccepted', (data: any) => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      console.log('Feedbacked: ', data.callID);
      if (data && data.callID) {
        navigation.navigate('VoiceCall', {
          roomID: data.callID,
          name: data.userName,
          type: data.type,
        });
      }
    });
    socket.on('feedbackRefused', (data: any) => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      console.log('callRefused: ', data.callID);
      if (data) {
        navigation.goBack();
      }
      Notification.showToast(
        'error',
        `${data.userName} đã từ chối`,
        'Cuộc gọi của bạn ',
      );
    });
    return () => {
      socket.off('feedbackRefused');
      socket.off('feedbackAccepted');
    };
  }, []);
  return (
    <LinearGradient
      colors={['#004AAD', '#E3F2FD']} // Trắng nhạt -> Xanh dương
      style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Animated.Image
            source={{uri: avatar}}
            style={[globalStyles.imgStyles, {opacity: opacityAnim}]}
          />

          <SpaceComponent height={12} />
          <RowComponent>
            <CallCalling size={appInfo.sizeIconBold} color={appColors.green} />
            <TextComponent
              label={`${t('is_connect')} ${name}`}
              styles={{}}
              color="white"
            />
          </RowComponent>
        </View>
        <TouchableOpacity
          onPress={hanldeCancelCall}
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
