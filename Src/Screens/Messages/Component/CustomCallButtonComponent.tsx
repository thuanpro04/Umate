import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {useNavigation} from '@react-navigation/native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {io, Socket} from 'socket.io-client';
import {appInfo} from '../../../Theme/appInfo';
import LinearGradient from 'react-native-linear-gradient';
import {CallCalling} from 'iconsax-react-native';
import {appColors} from '../../../Theme/Colors/appColors';
import {globalStyles} from '../../../Styles/globalStyle';
import {UserInfo} from '../../Untils/UserInfo';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../../redux/reducers/profileSlice';

interface Props {
  icon: React.ReactNode;
  callType: 'voice' | 'video';
  resourceID: string;
  styles?: StyleProp<ViewStyle>;
  text: string;
  // Thông tin người gọi
  userId: string;
  userName: string;
  // Thông tin người được gọi (target)
  targetId: string;
  targetName: string;
  avatar: string;
}

const CustomCallButtonComponent = (props: Props) => {
  const {
    icon,
    resourceID,
    callType,
    styles,
    text,
    userId,
    userName,
    targetId,
    targetName,
    avatar,
  } = props;
  const navigation = useNavigation<any>();
  const socketRef = useRef<Socket | null>(null);
  const profile = useSelector(profileSelector);
  const [callStatus, setCallStatus] = useState<
    'waiting' | 'ringing' | 'accepted' | 'ended'
  >('waiting');
  const callID = `call_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const sendCallInvitation = async () => {
    try {
      // Tạo một callID duy nhất
      if (!socketRef.current) {
        socketRef.current = io(appInfo.BASE_URL);
      }
      const callData = {
        callID,
        callType,
        targetId,
        targetName,
        userName,
        avatar:profile.avatar,
        userId,
      };

      socketRef.current.emit('sendCallInvitation', callData);
      navigation.navigate('CallWaitingAccept', {
        name: targetName,
        avatar,
      });

      // const screen = callType === 'video' ? 'VideoCall' : 'VoiceCall';
      // navigation.navigate(screen, {
      //   roomID: callID,
      //   name: userName,
      //   userID: userId,
      // });
    } catch (error) {
      console.error('❌ Lỗi khi gửi lời mời gọi:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles]}
      onPress={sendCallInvitation}
      activeOpacity={0.6}>
      {icon}
      <TextComponent label={text} size={12} styles={{fontStyle: 'italic'}} />
    </TouchableOpacity>
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
export default CustomCallButtonComponent;
