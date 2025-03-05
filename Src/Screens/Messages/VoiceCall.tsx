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
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  GROUP_VIDEO_CALL_CONFIG,
  GROUP_VOICE_CALL_CONFIG,
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
import {authSelector} from '../../redux/reducers/authReducer';
const VoiceCall = (props: any) => {
  const {roomID, name, userID, type} = useRoute().params as {
    roomID: string;
    name: string;
    userID: string;
    type: string;
  };
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const navigation = useNavigation<any>();
  const {getItem} = useAsyncStorage('ConversationInfo');
  const [converInfo, setConverInfo] = useState<any>();
  const [isVolume, setIsVolume] = useState(false);
  const [isMic, setIsMic] = useState(false);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const auth = useSelector(authSelector);
  const getCallConfig = (type: string) => {
    switch (type) {
      case 'group_voice':
        return GROUP_VOICE_CALL_CONFIG;
      case 'group_video':
        return GROUP_VIDEO_CALL_CONFIG;
      case 'personal_video':
        return ONE_ON_ONE_VIDEO_CALL_CONFIG;
      default:
        return ONE_ON_ONE_VOICE_CALL_CONFIG;
    }
  };
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

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={869126873}
        appSign={
          'fa5f0ebaabd60e8769aa6a5792f6330c188ffad58dd5b60a840e40a16fd545da'
        }
        userID={auth.userId} // userID can be something like a phone number or the user id on your own user system.
        userName={name}
        callID={roomID} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...getCallConfig(type),
          notifyWhenAppRunningInBackgroundOrQuit: true,
          onCallAccepted: () => {
            console.log('Người nhận đã bắt máy!');
            setIsCallAccepted(true);
          },
          onCallEnd: (callID: any, reason: any, duration: any) => {
            console.log('Lý do kết thúc cuộc gọi:', reason, duration);
            //lưu thông tin cuộc gọi vào data 
            navigation.navigate('Home');
          },
        }}
      />
    </View>
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
});
export default VoiceCall;
