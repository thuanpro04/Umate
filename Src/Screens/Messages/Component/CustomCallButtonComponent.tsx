import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextStyle,
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
import {socketSelector} from '../../../redux/reducers/socketSlice';
import {Notification} from '../../Untils/Notification';
import { useTranslation } from 'react-i18next';

interface Props {
  icon?: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
  text: string;
  // Thông tin người gọi
  userId: string;
  userName: string;
  // Thông tin người được gọi (target)
  targetId: any;
  targetName: string;
  avatar: string;
  txtStyles?: StyleProp<TextStyle>;
  type: 'group_voice' | 'group_video' | 'personal_voice' | 'personal_video';
  isDisible: Boolean;
  blockId: string;
}

const CustomCallButtonComponent = (props: Props) => {
  const {
    icon,
    styles,
    text,
    userId,
    userName,
    targetId,
    targetName,
    avatar,
    txtStyles,
    type,
    isDisible,
    blockId,
  } = props;
  const navigation = useNavigation<any>();
  const socket = useSelector(socketSelector).socket;
  const {t} = useTranslation();

  const profile = useSelector(profileSelector);

  const callID = `call_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const sendCallInvitation = async () => {
    if (isDisible) {
      return;
    }
    try {
      const callData = {
        callID,
        targetId,
        targetName,
        userName,
        avatar: profile.avatar,
        userId,
        type,
      };
      socket.emit('sendCallInvitation', callData);
      navigation.navigate('CallWaitingAccept', {
        name: targetName,
        avatar,
        callID,
        userId,
        targetId,
        type,
      });
      return socket.off('sendCallInvitation');
    } catch (error) {
      console.error('❌ Lỗi khi gửi lời mời gọi:', error);
    }
  };
  const handleToastNotificationBlock = () => {
    if (isDisible) {
      if (blockId !== userId) {
        Notification.showSnackbar(t('unblock_and_call'), () => {});
      } else {
        Notification.showSnackbar(t('you_are_blocked'), () => {});
      }
    }
  };
  return (
    <TouchableOpacity
      style={[styles]}
      onPress={isDisible ? handleToastNotificationBlock : sendCallInvitation}
      activeOpacity={0.6}>
      {icon && icon}
      <TextComponent
        label={text}
        size={12}
        styles={[{fontStyle: 'italic'}, txtStyles]}
      />
    </TouchableOpacity>
  );
};

export default CustomCallButtonComponent;
