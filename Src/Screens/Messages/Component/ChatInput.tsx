import {Send2} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import io from 'socket.io-client';
import {authSelector} from '../../../redux/reducers/authReducer';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {imageService} from '../../Services/imageService';
import {Notification} from '../../Untils/Notification';
import ButtonImagePicker from './ButtonImagePicker';
import Replymessage from './Replymessage';
import {socketSelector} from '../../../redux/reducers/socketSlice';
interface Props {
  reply: string;
  isBlock: boolean;
  clearReply: any;
  onScroll?: any;
  groupId?: string;
  userId?: string | string[];
  onSendMessage: (val: {
    content?: string;
    imagesUrl?: string[];
    reply?: string;
  }) => void;
}
const ChatInput = (props: Props) => {
  const {reply, clearReply, onScroll, groupId, userId, onSendMessage, isBlock} =
    props;
  const [content, setContent] = useState('');

  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const socket = useSelector(socketSelector).socket;
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

      // Định nghĩa nội dung tin nhắn
      const messageData = {
        senderId: auth.userId,
        content: content.trim(),
        imagesUrl: imagesUrl,
        groupId,
        reply,
      };

      if (messageData.content.length > 0 || messageData.imagesUrl.length > 0) {
        try {
          if (Array.isArray(userId)) {
            // Trường hợp gửi cho nhiều userId

            const data = {
              ...messageData,
              recipients: userId,
            };

            socket.emit('send_message', data, (response: any) => {
              console.log('Message sent to user:', response);
            });
          } else {
            // Trường hợp gửi cho một userId
            const data = {
              ...messageData,
              receiverId: userId,
            };
            socket.emit('send_message', data, (response: any) => {
              console.log(
                'Message sent to user:',
                userId,
                'server response:',
                response,
              );
            });
          }

          onSendMessage({
            content: content ?? '',
            imagesUrl: imagesUrl as string[],
            reply,
          });
          setContent('');
        } catch (error) {
          console.log('Error in handleSendMessageAndImage:', error);
        }
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

      try {
        return await imageService.uploadImageToFirebase(filePath, path);
      } catch (error) {
        console.log('Firebase storage error:', error);
        return null;
      }
    },
    [],
  );
  const handleSelected = useCallback(
    async (val: ImageOrVideo[] | ImageOrVideo) => {
      const filePaths = getFilePaths(val);
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
      Notification.showSnackbar('Mở chặn đi gòi nhắn 😏', () => {});
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
          placeholder="Type Message ..."
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
