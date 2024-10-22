import storage from '@react-native-firebase/storage';
import {Microscope, Send} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
interface Props {
  currentUserID: string;
  userID: string;
  onSendMessage: (val: {content?: string; imagesUrl?: string[]}) => void;
  reply?: string;
}

const ChatFoot = (props: Props) => {
  const {currentUserID, userID, onSendMessage, reply} = props;
  const [content, setContent] = useState('');
  const [isDisable, setIsDisable] = useState(false);
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

  const handleSendMessage = async (urlImage?: string[] | string) => {
    setIsDisable(true);
    const imagesUrl = Array.isArray(urlImage) ? urlImage : [urlImage];
    if (!content && !imagesUrl) {
      console.log('Message is empty, nothing to send.');
      setIsDisable(false); // Đừng quên bật lại khi không gửi
      return;
    }
    const data = {
      senderID: currentUserID,
      receiverID: userID,
      content: content.trim(),
      imagesUrl: imagesUrl,
    };

    try {
      onSendMessage({
        content: content ?? '',
        imagesUrl: imagesUrl as string[],
      });

      console.log('messageInfo', data);
      // Emit the message data via socket
      socket.emit('send_message', data, (response: any) => {
        console.log('Message sent, server response:', response);
      });

      setContent('');
      setIsDisable(false);
    } catch (error) {
      console.log('Error in handleSendMessage:', error);
      setIsDisable(false);
    }
  };

  const handleSelected = async (val: ImageOrVideo[] | ImageOrVideo) => {
    const filePaths = Array.isArray(val)
      ? val.map(item => item.path).filter(Boolean)
      : [val.path];
    if (filePaths.length > 20) {
      return;
    }
    onSendMessage({
      content: '',
      imagesUrl: [
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Floading.io%2Fspinner%2Fspinner%2F&psig=AOvVaw1xd1SMphC9s5adCKFqrwU8&ust=1729258395069000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCYuPHDlYkDFQAAAAAdAAAAABAE',
      ],
    });

    const arrImage = await Promise.all(
      filePaths.map(async filePath => {
        if (!filePath) {
          console.log('No file selected.');
          return null;
        }
        let temp = filePath.toString().split('/');
        const fileName = temp[temp.length - 1];
        const path = `images/${fileName}`;

        try {
          const res = await storage().ref(path).putFile(filePath);
          console.log(
            'Upload completed with bytes transferred:',
            res.bytesTransferred,
          );
          const url = await storage().ref(path).getDownloadURL();
          return url;
        } catch (error) {
          console.log('Firebase storage error:', error);
          return null;
        }
      }),
    );
    const validImageUrls = arrImage.filter(url => url !== null);
    await handleSendMessage(validImageUrls);
  };

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
          onSelect={val =>
            val.type === 'url'
              ? handleSendMessage(val.value.toString().trim())
              : handleSelected(val.value as ImageOrVideo)
          }
        />
        <InputComponent
          value={content}
          onChange={e => setContent(e)}
          type="default"
          placehold="content ..."
          multiline
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
