import React, {useCallback, useState} from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import ButtonImagePicker from './ButtonImagePicker';
import Replymessage from './Replymessage';
import io from 'socket.io-client';
import {appInfo} from '../../../Theme/appInfo';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {imageService} from '../../Services/imageService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Send2} from 'iconsax-react-native';
interface Props {
  reply: string;
  clearReply: any;
  onScroll: any;
  groupId?: string;
  userId?: string | string[];
  onSendMessage: (val: {
    content?: string;
    imagesUrl?: string[];
    reply?: string;
  }) => void;
}
const ChatInput = (props: Props) => {
  const {reply, clearReply, onScroll, groupId, userId, onSendMessage} = props;
  const [content, setContent] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const auth = useSelector(authSelector);
  const socket = io(appInfo.BASE_URL);
  function onPressScroll() {
    if (onScroll) {
      onScroll();
    }
  }

  const handleSendMessageAndImage = useCallback(
    async (urlImage?: string[] | string) => {
      setIsDisable(true);
      const imagesUrl = Array.isArray(urlImage) ? urlImage : [urlImage];

      if (!content && !imagesUrl) {
        console.log('Message is empty, nothing to send.');
        setIsDisable(false);
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
          ;

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
        setIsDisable(false);
      } catch (error) {
        console.log('Error in handleSendMessageAndImage:', error);
        setIsDisable(false);
      }
    },
    [content, userId, onSendMessage, socket],
  );
  const MIN_SEND_INTERVAL = 5000; // Khoảng cách tối thiểu giữa các lần gửi tin nhắn (5 giây)
  let lastSendTime = 0;
  const onActionSendMessages = () => {
    const now = Date.now();
    if (now - lastSendTime < MIN_SEND_INTERVAL) {
      console.log('Bạn đang gửi tin quá nhanh. Vui lòng chờ...');
      setIsDisable(true); // Vô hiệu hóa nút
      return;
    }
    setIsDisable(true); // Vô hiệu hóa nút ngay sau khi bấm
    lastSendTime = now; // Cập nhật thời gian gửi
    handleSendMessageAndImage(); // Gửi tin nhắn
    // Tự động bật lại nút sau khoảng thời gian tối thiểu
    setTimeout(() => {
      setIsDisable(false);
    }, MIN_SEND_INTERVAL);
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

  return (
    <View>
      <Replymessage clearReply={clearReply} message={reply} />
      <View style={styles.inputContainer}>
        <ButtonImagePicker
          icon={
            <MaterialCommunityIcons
              name="image-multiple-outline"
              size={appInfo.sizeIcon}
              color={'green'}
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
          style={styles.inputStyles}
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
            Keyboard.dismiss();
            onSendMessage({content, imagesUrl: [], reply});
            onActionSendMessages();
          }}>
          <Send2 size={appInfo.sizeIcon} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderTopColor: '#dcdcdc',
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
    borderBottomColor: 'grey',
    flex: 1,
    color: 'black',
  },
});
