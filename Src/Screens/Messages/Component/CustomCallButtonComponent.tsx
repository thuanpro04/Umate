import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../redux/reducers/authReducer';
import { profileSelector } from '../../../redux/reducers/profileSlice';
import { socketSelector } from '../../../redux/reducers/socketSlice';
import { TextComponent } from '../../Components';
import { Notification } from '../../Untils/Notification';

interface Props {
  icon?: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
  text: string;
  // Thông tin người gọi
  // Thông tin người được gọi (target)
  targetId: any;
  targetName: string;
  txtStyles?: StyleProp<TextStyle>;
  type: 'group_voice' | 'group_video' | 'personal_voice' | 'personal_video';
  isDisible: Boolean;
  converInfo: any;
}

const CustomCallButtonComponent = (props: Props) => {
  const {
    icon,
    styles,
    text,
    targetId,
    targetName,
    txtStyles,
    type,
    isDisible,
    converInfo,
  } = props;
  const navigation = useNavigation<any>();
  const socket = useSelector(socketSelector).socket;
  const {t} = useTranslation();
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  let userId = auth.userId;
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
        userName: profile.name,
        avatar: profile.avatar,
        userId,
        type,
        groupId: converInfo.groupId ?? undefined,
        targetAvatar: converInfo.avatar,
        conversationId:converInfo.conversationId
      };
      socket.emit('sendCallInvitation', callData);
      navigation.navigate('CallWaitingAccept', {
        name: targetName,
        avatar: auth.avatar,
        callID,
        userId,
        targetId,
        type,
        groupId: converInfo.groupId ?? undefined,
        targetAvatar: converInfo.avatar,
        conversationId:converInfo.conversationId
      });
      return socket.off('sendCallInvitation');
    } catch (error) {
      console.error('❌ Lỗi khi gửi lời mời gọi:', error);
    }
  };

  const handleToastNotificationBlock = () => {
    if (isDisible) {
      if (converInfo.block.includes(userId)) {
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
