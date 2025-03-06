import { CallCalling, Video } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { socketSelector } from '../../redux/reducers/socketSlice';
import { appInfo } from '../../Theme/appInfo';
import { RowComponent, SpaceComponent, TextComponent } from '../Components';

const CallWaitingScreen = ({route, navigation}: any) => {
  const {callData} = route.params;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const [sound, setSound] = useState<Sound | null>(null);
  const socket = useSelector(socketSelector).socket;
  const auth=useSelector(authSelector)
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
      'zego_outgoing.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Lỗi khi tải âm thanh:', error);
        } else {
          ringtone.setNumberOfLoops(-1);
          ringtone.play();
          setSound(ringtone);
        }
      },
    );

    return () => {
      ringtone.stop();
      ringtone.release();
    };
  }, []);

  const acceptCall = () => {
    if (sound) {
      sound.stop();
    }

    const data = {...callData};
    socket.emit('callAccepted', data);
    navigation.navigate('VoiceCall', {
      roomID: callData.callID,
      name: callData.userName,
      type: callData.type,
    });
    return socket.off('callAccepted')
  };
  const refuseCall = () => {
    if (sound) {
      sound.stop();
    }
    const data = {...callData};
    socket.emit('callRefused', data);
    navigation.navigate('Home');
    console.log('Bạn đã từ chối cuộc gọi !!!');
    return socket.off('callRefused')
  };
  const getName = () => {
    if (callData.type === 'personal_voice' || callData === 'personal_video') {
      return callData.userName;
    }
    return callData.targetName;
  };
  
  return (
    <LinearGradient
      colors={['#004AAD', '#E3F2FD']} // Trắng nhạt -> Xanh dương
      style={styles.container}>
      <Text style={styles.title}>Umate</Text>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Animated.Image
          source={{uri: callData.avatar}}
          style={[styles.avatar, {opacity: opacityAnim}]}
        />
        <Text style={styles.name}>{getName()}</Text>
        <Text style={styles.callingText}>Đang gọi...</Text>
      </View>
      <RowComponent styles={{gap: 50}}>
        <View style={styles.mainBtn}>
          <TouchableOpacity style={styles.cancelButton} onPress={refuseCall}>
            <MaterialIcons
              name="call-end"
              size={appInfo.sizeIconBold}
              color="white"
            />
          </TouchableOpacity>
          <SpaceComponent height={8} />
          <TextComponent label="Từ chối" />
        </View>
        <View style={styles.mainBtn}>
          <TouchableOpacity style={styles.callButton} onPress={acceptCall}>
            {callData.type &&
            (callData.type === 'group_voice' ||
              callData.type === 'personal_voice') ? (
              <CallCalling size={appInfo.sizeIconBold} color="white" />
            ) : (
              <Video size={appInfo.sizeIconBold} color="white" />
            )}
          </TouchableOpacity>
          <SpaceComponent height={8} />
          <TextComponent label="Trả lời" />
        </View>
      </RowComponent>
      <SpaceComponent height={50} />
    </LinearGradient>
  );
};

export default CallWaitingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 20,
    backgroundColor: 'blue',
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  callingText: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  callButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  mainBtn: {justifyContent: 'center', alignItems: 'center'},
});
