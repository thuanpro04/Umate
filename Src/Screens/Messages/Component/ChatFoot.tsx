import storage from '@react-native-firebase/storage';
import {Image, Microscope, Send} from 'iconsax-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import io from 'socket.io-client';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  TextComponent,
} from '../../Components';
import ButtonImagePicker from './ButtonImagePicker';
import {imageService} from '../../Services/imageService';
interface Props {
  currentUserID: string;
  userID: string| string[];
  onSendMessage: (val: {content?: string; imagesUrl?: string[]}) => void;
  reply?: string;
}

const ChatFoot = (props: Props) => {
  const {currentUserID, userID, onSendMessage, reply} = props;
  const [content, setContent] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const inputRef = useRef<TextInput>(null);
  console.log("userID", userID);
  
  const socket = io(appInfo.BASE_URL);

  useEffect(() => {
    socket.on('receive_message', (data: any) => {
      console.log('Received message: ', data);
    });
    // Hủy sự kiện khi component unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const handleSendMessage = useCallback(
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
        senderID: currentUserID,
        content: content.trim(),
        imagesUrl: imagesUrl,
      };

      try {
        if (Array.isArray(userID)) {
          // Trường hợp gửi cho nhiều userID
          userID.forEach((id) => {
            const data = {
              ...messageData,
              receiverID: id,
            };
            socket.emit('send_message', data, (response: any) => {
              console.log('Message sent to user:', id, 'server response:', response);
            });
          });
        } else {
          // Trường hợp gửi cho một userID
          const data = {
            ...messageData,
            receiverID: userID,
          };
          socket.emit('send_message', data, (response: any) => {
            console.log('Message sent to user:', userID, 'server response:', response);
          });
        }

        onSendMessage({
          content: content ?? '',
          imagesUrl: imagesUrl as string[],
        });
        setContent('');
        setIsDisable(false);
      } catch (error) {
        console.log('Error in handleSendMessage:', error);
        setIsDisable(false);
      }
      inputRef.current?.focus();
    },
    [content, currentUserID, userID, onSendMessage, socket],
  );

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

      await handleSendMessage(validImageUrls);
    },
    [getFilePaths, handleSendMessage, uploadFileToStorage],
  );

  return (
    <View
      style={{
        backgroundColor: '#eeeeee',
        paddingHorizontal: 34,
      }}>
      {reply && (
        <RowComponent>
          <TextComponent label={reply} />
        </RowComponent>
      )}
      <RowComponent styles={{justifyContent: 'center'}}>
        <ButtonImagePicker
          icon={
            <Image size={appInfo.sizeIconBold} color={appColors.blueBack} />
          }
          multiple
          onSelect={val =>
            val.type === 'url'
              ? handleSendMessage(val.value.toString().trim())
              : handleSelected(val.value as ImageOrVideo)
          }
        />
        <InputComponent
          inputRef={inputRef}
          value={content}
          onChange={e => setContent(e)}
          type="default"
          placehold="content ..."
          multiline
          isFocused
          numberOfLines={2}
          allowClear
          styles={{
            backgroundColor: appColors.white,
          }}
        />
        {content && content.length > 0 ? (
          <ButtonComponent
            disabled={isDisable}
            type="action"
            onPress={() => handleSendMessage()}
            iconRight={
              <Send size={appInfo.sizeIconBold} color={appColors.blueBack} />
            }
          />
        ) : (
          <Microscope size={appInfo.sizeIconBold} color={appColors.blueBack} />
        )}
      </RowComponent>
    </View>
  );
};

export default ChatFoot;

const styles = StyleSheet.create({});
