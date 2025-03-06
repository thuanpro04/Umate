import {useFocusEffect, useRoute} from '@react-navigation/native';
import {ArrowLeft, Setting} from 'iconsax-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  HeaderComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {messageServices} from '../Services/messageServices';
import {UserInfo} from '../Untils/UserInfo';
import ChatInput from './Component/ChatInput';
import ChatItems from './Component/ChatItems';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import chatsAPI from '../../apis/chatApi';
import {Text} from 'react-native-svg';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {io, Socket} from 'socket.io-client';
import {socketSelector} from '../../redux/reducers/socketSlice';

const ChatScreen = ({navigation}: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollViewRef = useRef<FlatList>(null);
  const [converInfo, setConverInfo] = useState<any>('');
  const [members, setMembers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
  const [page, setPage] = useState(1);
  const {getItem} = useAsyncStorage('ConversationInfo');
  const SwipeableRowRef = useRef<any>(null);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const currentUserId = auth.userId;
  const [limitPage, setLimitPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const clearReplyMessage = () => setReplyMessage(null);
  const socket = useSelector(socketSelector).socket;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await UserInfo.getConversationInfo(getItem);
        setConverInfo(info); // Cập nhật thông tin hội thoại
      } catch (error) {
        console.error('Error fetching conversation info:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (converInfo) {
      handleLoadMoreMessages();
      handleUpdateStatusMessage();
    }
    //  scrollViewToEnd()
  }, [converInfo]);
  const handleUpdateStatusMessage = async () => {
    try {
      const res = await messageServices.updateStatusMessage(
        auth.userId,
        converInfo.type === 'personal'
          ? converInfo.conversationId
          : converInfo.groupId,
        converInfo.type,
      );

      if (res) {
        console.log(res.data);
      }
    } catch (error) {
      console.log('update status message fail: ', error);
    }
  };
  const handleLoadMoreMessages = useCallback(async () => {
    setIsLoading(prev => {
      if (prev) return true; // Nếu đang loading, không gọi API nữa
      return true;
    });
    if (converInfo) {
      try {
        const res = await messageServices.getAllMessagesUser(
          converInfo.type === 'personal'
            ? converInfo.conversationId
            : converInfo.groupId,
          converInfo.type,
          page,
        );
        setMembers(res?.data.invitedUsers);
        if (res?.data && res.data.messages.length > 0) {
          // console.log(res.data.messages);
          setLimitPage(res.data.totalPages);
          // console.log('limitPage: ', limitPage, 'page: ', page);
          setMessages(prev => {
            const newMessages = res.data.messages.reverse();
            // Kết hợp các tin nhắn mới và cũ
            const allMessages = [...newMessages, ...prev];

            // Loại bỏ các tin nhắn trùng lặp dựa trên một thuộc tính duy nhất, ví dụ như 'id'
            return allMessages.filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  t => t._id === value._id, // Thay 'id' bằng thuộc tính duy nhất của tin nhắn
                ),
            );
          });
          if (page < limitPage) {
            setPage(prevPage => prevPage + 1);
          }
          // console.log(messages);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    }
  }, [converInfo, page, isLoading]);

  const onSendMessages = useCallback(
    (val: {content?: string; imagesUrl?: string[]; reply?: string}) => {
      setReplyMessage(null);
      if (val.content?.trim() || val.imagesUrl) {
        const newMessage = {
          senderId: currentUserId,
          content: val.content?.trim() || '',
          imagesUrl: val.imagesUrl || [],
          timestamp: new Date().toISOString(),
          reply: val.reply ?? '',
        };
        let updatedMessages = [...messages];

        if (converInfo.type === 'group') {
          const groupMessages = {
            ...newMessage,
            groupName: converInfo.groupName,
            recipients: getUserIdGroup(),
            type: 'group',
          };
          const isMessageExist = updatedMessages.some(
            msg =>
              msg.groupName === groupMessages.groupName &&
              msg.type === 'group' &&
              JSON.stringify(msg.recipients) ===
                JSON.stringify(groupMessages.recipients) &&
              msg.content === groupMessages.content, // Thêm điều kiện phù hợp với dữ liệu của bạn
          );
          if (!isMessageExist) {
            updatedMessages.push(groupMessages); // Thêm tin nhắn vào mảng
          }
        } else {
          const personMessages = {
            ...newMessage,
            receiverId: converInfo.userId,
            type: 'personal',
          };

          updatedMessages.push(personMessages); // Thêm tin nhắn cá nhân vào
        }
        // Chỉ gọi setMessages một lần

        setMessages(updatedMessages);
      }
      scrollViewToEnd();
    },

    [currentUserId, converInfo?.userId, converInfo?.invitedUsers, messages],
  );

  const scrollViewToEnd = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  const getUserIdGroup = () => {
    return converInfo.type === 'group'
      ? converInfo.invitedUsers.filter(
          (item: any) => item.userId !== currentUserId,
        )
      : '';
  };
  const updateRowRef = useCallback((ref: any) => {
    if (
      ref &&
      replyMessage &&
      ref.props.children.props?.id === replyMessage.id
    ) {
      SwipeableRowRef.current = ref;
    }
  }, []);

  const keyExtractor = (item: any, index: number) =>
    item.id?.toString() || index.toString();

  const renderItemMessages = useCallback(
    (props: any) => {
      const allUrlImages = messages
        .filter((item: any) => item.imagesUrl && item.imagesUrl.length > 0) // Lọc các phần tử có imagesUrl không rỗng
        .flatMap((item: any) => item.imagesUrl) // Lấy tất cả ảnh trong imagesUrl
        .filter((imageUrl: any) => imageUrl !== null); // Loại bỏ các giá trị null

      return (
        <ChatItems
          updateRowRef={updateRowRef}
          navigation={navigation}
          currentUserId={currentUserId}
          userId={
            converInfo.type === 'personal'
              ? converInfo.userId
              : converInfo
              ? converInfo.invitedUsers
              : ''
          }
          {...props}
          members={members}
          urlImages={allUrlImages}
          setReplyOnSwipeOpen={setReplyMessage}
          name={converInfo.name}
        />
      );
    },
    [
      messages,
      updateRowRef,
      navigation,
      currentUserId,
      converInfo,
      members,
      setReplyMessage,
      socket
    ],
  );
  const ListHeader = () => {
    return isLoading ? <ActivityIndicator /> : <></>;
  };

  useEffect(() => {
    socket.on('receive_message', (data: any) => {
      setMessages(prev => {
        if (!prev.some(msg => msg._id === data._id)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);
 
  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <SafeAreaView style={globalStyles.main}>
        <HeaderComponent
          title={
            converInfo.type === 'personal'
              ? converInfo.name
              : converInfo.groupName
          }
          image={
            converInfo.type === 'personal'
              ? converInfo.avatar
              : converInfo
              ? converInfo.avatar
              : 'data:image/png;base64,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'
          }
          iconLeft={
            <ArrowLeft size={appInfo.sizeIconBold} color={colors.icon} />
          }
          isBcolor
          iconRight={
            <Setting size={appInfo.sizeIconBold} color={colors.icon} />
          }
          onPress2={() => navigation.navigate('MessageNavigator')}
        />

        {messages && messages.length > 0 ? (
          <FlatList
            ref={scrollViewRef}
            data={messages}
            keyExtractor={keyExtractor}
            style={{flex: 1}}
            renderItem={renderItemMessages}
            // onEndReachedThreshold={0.05}
            scrollEventThrottle={16} // Tần suất lắng nghe cuộn
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingTop: 65,
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            ListHeaderComponent={page < limitPage ? ListHeader : <></>}
            onScroll={({nativeEvent}) => {
              const yOffSet = nativeEvent.contentOffset.y;
              const contentHeight = nativeEvent.contentSize.height;
              yOffSet < 10 && page <= limitPage ? handleLoadMoreMessages() : '';
              const layoutHeight = nativeEvent.layoutMeasurement.height;
              yOffSet + layoutHeight < contentHeight - 100
                ? setShowScrollToBottom(true)
                : setShowScrollToBottom(false);
            }}
            onContentSizeChange={(width, height) => {
              // console.log('height ', height);

              if (messages.length > 0 && page === 1) {
                scrollViewRef.current?.scrollToOffset({
                  offset: height, // Cuộn trực tiếp đến cuối cùng
                  animated: false, // Không cần hiệu ứng
                });
              }
            }}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={22} />
          </View>
        )}
        {showScrollToBottom && (
          <ButtonComponent
            onPress={scrollViewToEnd}
            type="action"
            styles={{
              position: 'absolute',
              left: '50%',
              bottom: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 12,
              padding: 3,
            }}>
            <MaterialCommunityIcons
              name="pan-down"
              size={appInfo.sizeIconBold}
              color={colors.icon}
            />
          </ButtonComponent>
        )}
      </SafeAreaView>
      {converInfo &&
      converInfo.type === 'personal' &&
      converInfo.block &&
      converInfo.block.includes(auth.userId) ? (
        <View style={styles.block}>
          <TextComponent
            label={`Bạn đã bị block bởi ${UserInfo.getName(
              converInfo.name,
            )} liu liu !!!`}
            styles={{fontWeight: '500', fontStyle: 'italic'}}
            color={appColors.white}
          />
          <SpaceComponent height={8} />
          <TextComponent label="😜" size={28} />
        </View>
      ) : (
        <ChatInput
          onSendMessage={onSendMessages}
          onScroll={() => scrollViewToEnd()}
          clearReply={clearReplyMessage}
          reply={replyMessage}
          userId={
            converInfo.type === 'personal'
              ? converInfo?.userId
              : converInfo.type === 'group'
              ? getUserIdGroup()
              : ''
          }
          groupId={converInfo ? converInfo.groupId : undefined}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,

    width: '10%',
  },
  block: {
    backgroundColor: '#81C784',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',

    justifyContent: 'center',
  },
});
