import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {UserInfo} from '../Untils/UserInfo';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../Styles/globalStyle';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import {Call, CallCalling} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {Mic, MicOff, Volume1, Volume2} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import LinearGradient from 'react-native-linear-gradient';
import {io} from 'socket.io-client';
const VoiceCall = (props: any) => {
  const {roomID, name, userID} = useRoute().params as {
    roomID: string;
    name: string;
    userID: string;
  };
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const navigation = useNavigation<any>();
  const {getItem} = useAsyncStorage('ConversationInfo');
  const [converInfo, setConverInfo] = useState<any>();
  const [isVolume, setIsVolume] = useState(false);
  const [isMic, setIsMic] = useState(false);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  useFocusEffect(
    useCallback(() => {
      const fetchConversation = async () => {
        try {
          const info = await UserInfo.getConversationInfo(getItem);
          setConverInfo(info);
        } catch (error) {
          console.error('Voice fetching conversation info :', error);
        }
      };
      fetchConversation();
    }, []),
  );

  useEffect(() => {}, []);

  return (
    <LinearGradient
      colors={['#004AAD', '#E3F2FD']} // Trắng nhạt -> Xanh dương
      style={styles.container}>
      {isCallAccepted ? (
        converInfo && (
          <View style={styles.waitingScreen}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={{uri: converInfo.avatar}}
                style={globalStyles.imgStyles}
              />
              <ActivityIndicator
                size="large"
                color="#00AC3B"
                style={{position: 'absolute', top: '40%'}}
              />
              <SpaceComponent height={12} />
              <RowComponent>
                <CallCalling
                  size={appInfo.sizeIconBold}
                  color={appColors.green}
                />
                <TextComponent
                  label={`Đang kết nối ${UserInfo.getName(converInfo.name)}`}
                  styles={styles.waitingText}
                  color="white"
                />
              </RowComponent>
            </View>
            <RowComponent styles={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity style={[styles.btn, styles.volumeBtn]}>
                {isVolume ? (
                  <Volume2 size={appInfo.sizeIconBold} color={colors.icon} />
                ) : (
                  <Volume1 size={appInfo.sizeIconBold} color={colors.icon} />
                )}
              </TouchableOpacity>
              <SpaceComponent width={20} />
              <TouchableOpacity
                style={[styles.btn, styles.endCallBtn]}
                onPress={() => props.navigation.goBack()}>
                <CallCalling size={appInfo.sizeIconBold} color={colors.icon} />
              </TouchableOpacity>
              <SpaceComponent width={20} />

              <TouchableOpacity style={[styles.btn, styles.micBtn]}>
                {isMic ? (
                  <MicOff size={appInfo.sizeIconBold} color={colors.icon} />
                ) : (
                  <Mic size={appInfo.sizeIconBold} color={colors.icon} />
                )}
              </TouchableOpacity>
            </RowComponent>
            <SpaceComponent height={60} />
          </View>
        )
      ) : (
        <ZegoUIKitPrebuiltCall
          appID={869126873}
          appSign={
            'fa5f0ebaabd60e8769aa6a5792f6330c188ffad58dd5b60a840e40a16fd545da'
          }
          userID={userID} // userID can be something like a phone number or the user id on your own user system.
          userName={name}
          callID={roomID} // callID can be any unique string.
          config={{
            // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
            ...ONE_ON_ONE_VOICE_CALL_CONFIG,
            notifyWhenAppRunningInBackgroundOrQuit: true,
            onCallEnd: (callID: any, reason: any, duration: any) => {
              navigation.goBack();
            },
          }}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    marginTop: StatusBar.currentHeight,
  },
  waitingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingText: {
    fontSize: 20,
  },
  btn: {
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  volumeBtn: {
    backgroundColor: '#90CAF9', // 🔈 Màu xám tối cho nút âm lượng
  },
  micBtn: {
    backgroundColor: '#90CAF9', // 🎙 Xanh dương để bật/tắt mic
  },
  endCallBtn: {
    backgroundColor: '#FF4B4B', // 🔴 Đỏ để kết thúc cuộc gọi
  },
});
export default VoiceCall;
