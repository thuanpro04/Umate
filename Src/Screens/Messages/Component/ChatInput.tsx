import {Send2} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import {profileSelector} from '../../../redux/reducers/profileSlice';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {imageService} from '../../Services/imageService';
import SocketService from '../../Services/SocketService';
import {Notification} from '../../Untils/Notification';
import ButtonImagePicker from './ButtonImagePicker';
import Replymessage from './Replymessage';
interface Props {
  reply: string;
  isBlock: boolean;
  clearReply: any;
  onScroll?: any;
  userId?: string | string[];
  onSendMessage: (val: {
    content?: string;
    imagesUrl?: string[];
    reply?: string;
  }) => void;
  theme: string;
  converInfo: any;
}
const ChatInput = (props: Props) => {
  const {
    reply,
    clearReply,
    onScroll,
    userId,
    onSendMessage,
    isBlock,
    theme,
    converInfo,
  } = props;
  const [content, setContent] = useState('');
  const {t} = useTranslation();
  const profile = useSelector(profileSelector);
  const auth = useSelector(authSelector);
  const colors = appColors[theme];
  const socket = SocketService.getSocket();
  const isPersonal = converInfo.type === 'personal';
  function onPressScroll() {
    if (onScroll) {
      onScroll();
    }
  }

  const handleSendMessageAndImage = useCallback(
    async (urlImage?: string[] | string) => {
      const imagesUrl = Array.isArray(urlImage) ? urlImage : [urlImage];

      if (content.trim().length === 0 && imagesUrl.length === 0) {
        console.log('Message is empty, nothing to send.');
        return;
      }
      let value = btoa(JSON.stringify({content: content.trim()}));
      // Định nghĩa nội dung tin nhắn
      const messageData = {
        senderId: auth.userId,
        content: value,
        imagesUrl: imagesUrl,
        reply,
        groupId: converInfo.groupId,
        isNotification: !!converInfo.notification?.includes(converInfo.userId),
        name: isPersonal
          ? profile.name
          : `${converInfo.groupName} - ${profile.name}`,
        avatar: isPersonal ? profile.avatar : converInfo.avatar,
        converInfo,
      };

      try {
        if (Array.isArray(userId)) {
          // Trường hợp gửi cho nhiều userId

          const data = {
            ...messageData,
            recipients: userId,
          };

          socket?.emit('send_message', data, (response: any) => {
            console.log('Message sent to user:', response);
          });
        } else {
          // Trường hợp gửi cho một userId
          const data = {
            ...messageData,
            receiverId: userId,
          };

          socket?.emit('send_message', data, (response: any) => {
            console.log(
              'Message sent to user:',
              userId,
              'server response:',
              response,
            );
          });
        }

        onSendMessage({
          content: value ?? '',
          imagesUrl: imagesUrl as string[],
          reply,
        });
        setContent('');
        onScroll();
      } catch (error) {
        console.log('Error in handleSendMessageAndImage:', error);
      }
    },
    [content, userId, onSendMessage, socket],
  );

  const onActionSendMessages = () => {
    if (content.trim().length === 0) {
      console.log('Message is empty, nothing to send.');
      return;
    }
    handleSendMessageAndImage(); // Gửi tin nhắn
    // Tự động bật lại nút sau khoảng thời gian tối thiểu
  };
  const getFilePaths = (val: ImageOrVideo[] | ImageOrVideo): string[] => {
    return Array.isArray(val)
      ? val.map(item => item.path).filter(Boolean)
      : [val.path];
  };
  const uploadFileToStorage = useCallback(
    async (filePath: string): Promise<string | null> => {
      if (!filePath) {
        console.log('No file selected.');
        return null;
      }
      const fileName = filePath.split('/').pop();
      const path = `images/${fileName}`;

      const result = await imageService.uploadImageToFirebase(filePath, path);
      return result ?? '';
    },
    [],
  );
  const handleSelected = useCallback(
    async (val: ImageOrVideo[] | ImageOrVideo) => {
      const filePaths = getFilePaths(val);
      console.log(filePaths, 121);

      if (filePaths.length > 20) {
        return;
      }
      const arrImage = await Promise.all(filePaths.map(uploadFileToStorage));
      const validImageUrls = arrImage.filter(url => url !== null);

      await handleSendMessageAndImage(validImageUrls);
    },
    [getFilePaths, handleSendMessageAndImage, uploadFileToStorage],
  );
  const handleToastNotificationBlock = () => {
    if (isBlock) {
      Notification.showSnackbar(t('block_message'), () => {});
    }
  };

  return (
    <View>
      <Replymessage clearReply={clearReply} message={reply} />
      <View style={[styles.inputContainer, {borderTopColor: colors.border}]}>
        <ButtonImagePicker
          icon={
            <MaterialCommunityIcons
              name="image-multiple-outline"
              size={appInfo.sizeIcon}
              color={colors.icon}
            />
          }
          handleToastNotificationBlock={handleToastNotificationBlock}
          isBlock={isBlock}
          multiple
          onSelect={val => {
            val.type === 'url'
              ? handleSendMessageAndImage(val.value.toString().trim())
              : handleSelected(val.value as ImageOrVideo);
          }}
        />
        <TextInput
          style={[styles.inputStyles, {color: colors.text}]}
          value={content}
          onChangeText={setContent}
          placeholder={t('enter_message')}
          placeholderTextColor={'grey'}
          onFocus={() => onPressScroll()}
          onBlur={() => onPressScroll()}
          multiline
        />
        <TouchableOpacity
          onPress={() => {
            isBlock ? handleToastNotificationBlock() : onActionSendMessages();
          }}>
          <Send2 size={appInfo.sizeIcon} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  btn_Send: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: 'green',
  },
  inputStyles: {
    flex: 1,
  },
});
