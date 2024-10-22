import {useFocusEffect, useRoute} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatsAPI from '../../apis/chatApi';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  HeaderComponent,
} from '../Components';
import ChatBody from './Component/ChatBody';
import ChatFoot from './Component/ChatFoot';
import { messageServices } from '../Services/messageServices';

const ChatScreen = ({navigation}: any) => {
  const {userName, avatar, currentUserID, userID} = useRoute().params as {
    userName: string;
    avatar: string;
    currentUserID: string;
    userID: string;
  };
  const [messages, setMessages] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [text, setText] = useState();
  useFocusEffect(
    useCallback(() => {
      getMessages();
    }, []),
  );
  useEffect(() => {
    setTimeout(() => {
      scrollToEnd();
    }, 100);
  }, [messages]);
  const getMessages = async () => {
    // lấy tin nhắn từ server
    const url = `/receive-messages?senderID=${currentUserID}&receiverID=${userID}`;
    try {
      const res = await messageServices.getAllMessagesUser(url)
      // console.log('res.data', res.data);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const onSendMessages = (val: {content?: string; imagesUrl?: string[]}) => {
    const newMessage = {
      senderID: currentUserID,
      receiverID: userID,
      content: val.content?.trim() || '',
      imagesUrl: val.imagesUrl || [],
      timestamp: new Date().toISOString(),
    };
    if (val.content?.trim() || val.imagesUrl) {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };
  const handleScroll = (event: any) => {
    // layoutMeasurement: Đây là một đối tượng chứa thông tin về kích thước của khu vực hiển thị hiện tại (viewport) trong ứng dụng.
    // contentOffset.y: Giá trị này cho biết vị trí cuộn theo chiều dọc.
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const yOffSet = contentOffset.y;
    const contentHeight = contentSize.height;
    const layoutHeight = layoutMeasurement.height;
    yOffSet + layoutHeight < contentHeight - 100
      ? setShowScrollToBottom(true)
      : setShowScrollToBottom(false);
  };
  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };
  const onPressImg = (arrImages: any[]) => {
    const imageFormats = arrImages.map(url => ({uri: url}));
    setDisplayImgs(imageFormats);
    console.log('displayImgs', displayImgs);

    setIsVisible(true);
  };


  return (
    <ContainerComponent styles={styles.container}>
      <HeaderComponent
        title={userName}
        image={avatar}
        iconLeft={
          <ArrowLeft size={appInfo.sizeIconBold} color={appColors.black} />
        }
        isBcolor
        iconRight={
          <AntDesign
            size={appInfo.sizeIconBold}
            color={appColors.grey}
            name="ellipsis1"
          />
        }
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}>
        <ChatBody
          currentUserID={currentUserID}
          userID={userID}
          allMessages={messages}
          onPressImg={onPressImg}
          
        />
      </ScrollView>
      {showScrollToBottom && (
        <ButtonComponent
          type="action"
          styles={styles.scrollButton}
          iconLeft={
            <Icon name="arrow-down" size={appInfo.sizeIcon} color="#fff" />
          }
          onPress={scrollToEnd}
        />
      )}
      <ChatFoot
        reply={text}
        currentUserID={currentUserID}
        userID={userID}
        onSendMessage={onSendMessages}
      />
      {displayImgs && (
        <ImageViewing
          imageIndex={0}
          images={displayImgs}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}
    </ContainerComponent>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    paddingHorizontal: 18,
  },

  scrollButton: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,
    padding: 10,
    left: '50%',
  },
});
