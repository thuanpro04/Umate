import React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {TextComponent} from '../../Components';
import {useNavigation} from '@react-navigation/native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {io} from 'socket.io-client';
import {appInfo} from '../../../Theme/appInfo';

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
  } = props;
  const navigation = useNavigation<any>();
  const socket = io(appInfo.BASE_URL);
  const sendCallInvitation = async () => {
    try {
      // Tạo một callID duy nhất
      const callID = `call_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const callData = {
        callID,
        callType,
        targetId,
        targetName,
      };

      socket.emit('sendCallInvitation', callData);
      if (callType === 'video') {
        navigation.navigate('VideoCall', {
          roomID: callID,
          name: userName,
          userID: userId,
        });
      } else {
        navigation.navigate('VoiceCall', {
          roomID: callID,
          name: userName,
          userID: userId,
        });
      }
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

export default CustomCallButtonComponent;

const styles = StyleSheet.create({});
