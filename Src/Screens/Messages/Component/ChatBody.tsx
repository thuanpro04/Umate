import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Hoặc thư viện icon khác
import {appColors} from '../../../Theme/Colors/appColors';
import {appInfo} from '../../../Theme/appInfo';
import chatsAPI from '../../../apis/chatApi';
import {ButtonComponent, RowComponent} from '../../Components';
import ChatFoot from './ChatFoot';
import OtherUserMessageView from './OtherUserMessageView';
import UserMessageView from './UserMessageView';
import {messageServices} from '../../Services/messageServices';
interface Props {
  currentUserID: string;
  userID: string;
}
const ChatBody = (props: Props) => {
  const {currentUserID, userID} = props;
  const [messages, setMessages] = useState<any[]>([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  useFocusEffect(
    useCallback(() => {
      getMessages();
    }, []),
  );

  useEffect(() => {
    if (messages.length > 0) {
      // Đợi một chút để đảm bảo rằng tất cả tin nhắn đã được render
      setTimeout(() => {
        scrollToEnd();
      }, 100); // Thời gian chờ khoảng 100ms
    }
  }, [messages]);

  // Thêm phương thức scrollToEnd
  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({animated: true});
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
  console.log('messages', messages);

  const getMessages = async () => {
    // lấy tin nhắn từ server
    const url = `/receive-messages?senderID=${currentUserID}&receiverID=${userID}`;
    try {
      const res = await chatsAPI.handleChats(url);
      console.log('res.data', res.data);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  //Memoization (React.memo): Sử dụng React.memo để tránh việc re-render không cần thiết cho

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
  const renderImage = (
    index: number,
    arrImages: string[],
    isRight?: boolean,
  ) => {
    const totalImages = arrImages.length;
    const isStacked = totalImages > 1;
    console.log(isRight);

    // Kiểm tra nếu không có hình ảnh thì hiển thị loading
    if (arrImages.length === 0) {
      return <ActivityIndicator style={localStyles.image} />;
    }

    return (
      <RowComponent>
        {arrImages.map((item, index) => (
          <Image
            source={{uri: item}}
            style={[
              localStyles.image,
              isStacked && {
                position: 'absolute', // Đặt vị trí hình ảnh là absolute
                left: isRight ? undefined : index * 30, // Điều chỉnh khoảng cách từ trái cho người khác
                right: isRight ? index * 30 : undefined, // Điều chỉnh khoảng cách từ phải cho chính mình
                top: index * 5, // Điều chỉnh vị trí dọc để xếp chồng
                zIndex: totalImages - index,
              },
              {
              
              },
            ]}
            onError={error =>
              console.log('Error loading image:', error.nativeEvent.error)
            }
          />
        ))}
      </RowComponent>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={flatListRef}
        data={messages}
        style={localStyles.container}
        onScroll={handleScroll}
        extraData={messages}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // Cung cấp thông tin cuộn thường xuyên
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}: any) =>
          item.content ? (
            item.senderID === currentUserID ? (
              <UserMessageView
                message={item.content}
                time={item.timestamp}
                imageURL={item.imagesUrl}
              />
            ) : (
              <OtherUserMessageView
                message={item.content}
                time={item.timestamp}
                imageURL={item.imagesUrl}
              />
            )
          ) : (
            <View
              style={[
                item.senderID === currentUserID ? {alignItems: 'flex-end'} : {},
                {marginBottom:'50%'},
              ]}>
              {item.imagesUrl &&
                renderImage(
                  index,
                  item.imagesUrl,
                  item.senderID === currentUserID,
                )}
            </View>
          )
        }
      />
      {showScrollToBottom && (
        <ButtonComponent
          type="action"
          styles={localStyles.scrollButton}
          iconLeft={
            <Icon name="arrow-down" size={appInfo.sizeIcon} color="#fff" />
          }
          onPress={scrollToEnd}
        />
      )}
      <ChatFoot
        currentUserID={currentUserID}
        userID={userID}
        onSendMessage={onSendMessages}
      />
    </View>
  );
};

export default ChatBody;
const localStyles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  scrollButton: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,
    padding: 10,
    left: '50%',
  },
  imageContainerOther: {
    transform: [{rotate: '5deg'}],
  },
  image: {
    width: 200, // Chiều rộng hình ảnh
    height: 180, // Chiều cao hình ảnh
    borderRadius: 10, // Bo góc hình ảnh
    backgroundColor: appColors.grey,
    resizeMode: 'cover',
  },
});
