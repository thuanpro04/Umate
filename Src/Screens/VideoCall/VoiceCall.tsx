import {useNavigation, useRoute} from '@react-navigation/native';
import {
  GROUP_VIDEO_CALL_CONFIG,
  GROUP_VOICE_CALL_CONFIG,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoUIKitPrebuiltCall,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import React from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  setIncomingCall,
  socketSelector,
} from '../../redux/reducers/socketSlice';
import {useTranslation} from 'react-i18next';
import SocketService from '../Services/SocketService';
import store from '../../redux/store';
const VoiceCall = (props: any) => {
  const {roomID, name, type, avatar, targetAvatar} = useRoute().params as {
    roomID: string;
    name: string;
    type: string;
    avatar: string;
    targetAvatar: string;
  };
  const navigation = useNavigation<any>();
  const auth = useSelector(authSelector);
  const dataCall = useSelector(socketSelector);
  const calls = dataCall.incomingCall;
  const socket = SocketService.getSocket();
  const {t} = useTranslation();
  console.log(name, 124);

  let appID: number = parseInt(process.env.APPID as string);
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
  function getDataCall(duration: number) {
    let num = Math.floor(duration / 60);
    let seconds = duration % 60;
    let content = btoa(
      JSON.stringify({content: `${num} phút ${seconds} giây`}),
    );
    const data = {
      senderId: calls.userId,
      content,
      imagesUrl: [],
      reply: '',
      typeCall: type,
    };

    let dataCall;
    if (calls.type === 'group_video' || calls.type === 'group_voice') {
      dataCall = {
        ...data,
        groupId: calls.groupId,
        recipients: calls.targetId,
      };
    } else {
      dataCall = {
        ...data,
        receiverId: calls.targetId,
      };
    }
    return dataCall;
  }
  const handleSaveCallOnData = (duration: number) => {
    if (calls) {
      try {
        const data = getDataCall(duration);
        // socket?.emit('call_end', data);
        socket?.emit('send_message', data);
        store.dispatch(setIncomingCall(null));
        console.log('Save call data successfully!!');
      } catch (error) {
        console.log('Save call data fail: ', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={appID}
        appSign={process.env.APPSIGN}
        userID={auth.userId} // userID can be something like a phone number or the user id on your own user system.
        userName={name}
        callID={roomID} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...getCallConfig(type),
          notifyWhenAppRunningInBackgroundOrQuit: true,
          onCallAccepted: () => {
            console.log('Người nhận đã bắt máy!');
          },
          onCallEnd: (callID: any, reason: any, duration: any) => {
            console.log('Lý do kết thúc cuộc gọi:', reason, duration, 3456789);
            navigation.navigate(t('home'));
            handleSaveCallOnData(duration);
            //lưu thông tin cuộc gọi vào data
          },
          avatarBuilder: ({userInfo}: any) => {
            const avatarUrl =
              userInfo.userID === auth.userId
                ? avatar // Use the authenticated user's avatar if available
                : targetAvatar || `https://robohash.org/${userInfo.userID}.png`; // Use the incoming call's avatar or fallback to a default
            return (
              <View style={{width: '100%', height: '100%'}}>
                <Image
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover"
                  source={{uri: avatarUrl}}
                />
              </View>
            );
          },
          hangUpWhenAllUserLeave: true,
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
