import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {ArrowLeft, Setting} from 'iconsax-react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  HeaderComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import LoadingModal from '../Modal/LoadingModal';
import {messageServices} from '../Services/messageServices';
import {Notification} from '../Untils/Notification';
import {UserInfo} from '../Untils/UserInfo';
import ChatInput from './Component/ChatInput';
import ChatItems from './Component/ChatItems';
import SocketService from '../Services/SocketService';
import {themeSelector} from '../../redux/reducers/themeSlice';

const ChatScreen = ({navigation}: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [members, setMembers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
  const [converInfo, setConverInfo] = useState<any>('');
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [page, setPage] = useState(1);
  const scrollViewRef = useRef<FlatList>(null);
  const {getItem} = useAsyncStorage('ConversationInfo');
  const SwipeableRowRef = useRef<any>(null);
  const profile = useSelector(profileSelector);
  const [limitPage, setLimitPage] = useState(1);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const colors: any = appColors[converInfo.theme ?? theme];
  const currentUserId = auth.userId;
  const clearReplyMessage = () => setReplyMessage(null);
  const socket = SocketService.getSocket();
  const {t} = useTranslation();
  const isPersonal = converInfo.type === 'personal';
  const existingBlock = converInfo.block?.length > 0;
  const name = converInfo.nickNames?.[converInfo.userId] ?? converInfo.name;
  const checkMess = messages && messages[messages.length - 1];

  const handleUpdateStatusMessage = async () => {
    if (
      !messages ||
      messages.length === 0 ||
      messages[messages.length - 1].senderId === auth.userId
    ) {
      return;
    }
    const res = await messageServices.updateStatusMessage(
      auth.userId,
      converInfo.conversationId ?? converInfo.groupId,
      converInfo.type,
    );
    if (res) {
      console.log('update status read message');
    }
  };
  const handleLoadMoreMessages = useCallback(async () => {
    setIsLoading(prev => {
      if (prev) return true; // Nếu đang loading, không gọi API nữa
      return true;
    });
    if (isPersonal && !converInfo.conversationId) {
      setIsLoading(false);
      return;
    }
    const res = await messageServices.getAllMessagesUser(
      converInfo.conversationId ?? converInfo.groupId,
      converInfo.type,
      page,
    );
    if (res?.data && res.data.messages?.length > 0) {
      setMembers(res.data?.invitedUsers);
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
    }

    setIsLoading(false);
  }, [converInfo, page]);

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
        setMessages(prev => {
          let updatedMessages = [...prev];
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

          return updatedMessages;
        });
      }
      scrollViewToEnd();
    },

    [currentUserId],
  );

  const scrollViewToEnd = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  const getUserIdGroup = () => {
    return converInfo.type === 'group'
      ? converInfo.invitedUsers?.filter(
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
    item._id?.toString() || index.toString();
  const allUrlImages = useMemo(() => {
    return messages
      .filter((item: any) => item.imagesUrl?.length > 0)
      .flatMap((item: any) => item.imagesUrl)
      .filter((imageUrl: any) => imageUrl !== null);
  }, [messages]);

  const renderItemMessages = useCallback(
    (props: any) => {
      
      return (
        <ChatItems
          name={name}
          conversationInfo={converInfo}
          theme={converInfo.theme ?? theme}
          blockId={existingBlock && isPersonal ? converInfo.block[0] : ''}
          isBlock={
            converInfo.block?.includes(auth.userId) ||
            friendData.block?.includes(converInfo.userId)
          }
          updateRowRef={updateRowRef}
          navigation={navigation}
          currentUserId={currentUserId}
          userId={converInfo.userId ?? converInfo.invitedUsers}
          {...props}
          members={members}
          urlImages={allUrlImages}
          setReplyOnSwipeOpen={setReplyMessage}
        />
      );
    },
    [navigation, converInfo, members, allUrlImages, page, messages],
  );
  const ListHeader = () => {
    return isLoading ? <ActivityIndicator /> : <></>;
  };

  const renderViewBlock = () => {
    return (
      <View style={styles.block}>
        <TextComponent
          label={`${t('you_are_blocked')} ${converInfo.name}`}
          styles={{fontWeight: '500', fontStyle: 'italic'}}
          color={appColors.white}
        />
        <SpaceComponent height={8} />
        <TextComponent label="🤫" size={28} />
      </View>
    );
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // Clear existing messages when screen is focused
      setMessages([]);
      setPage(1);

      // Fetch fresh conversation info from storage
      try {
        const info = await UserInfo.getConversationInfo(getItem);
        setConverInfo(info);
      } catch (error) {
        console.error('Error refreshing conversation info:', error);
      }
    });

    return unsubscribe;
  }, [navigation]);
  const onScroll = useCallback(
    ({nativeEvent}: any) => {
      const yOffSet = nativeEvent.contentOffset.y;
      const contentHeight = nativeEvent.contentSize.height;
      const layoutHeight = nativeEvent.layoutMeasurement.height;

      if (yOffSet < 10 && page <= limitPage) {
        handleLoadMoreMessages();
      }

      setShowScrollToBottom(yOffSet + layoutHeight < contentHeight - 100);
    },
    [page, limitPage, handleLoadMoreMessages],
  );
  useEffect(() => {
    if (converInfo) {
      handleLoadMoreMessages();
    }
    //  scrollViewToEnd()
  }, [converInfo]);
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      console.log('receive_message: ', data);

      // Chuẩn hóa dữ liệu - bổ sung trường _id nếu không có
      const normalizedData = {
        ...data,
        _id: data._id || data.messageId,
        // Lọc bỏ null trong imagesUrl
        imagesUrl: data.imagesUrl?.filter((url: any) => url !== null) || [],
      };

      setMessages(prev => {
        // Kiểm tra trùng lặp sử dụng messageId hoặc _id
        const messageExists = prev.some(
          msg => msg.messageId && msg.messageId === normalizedData.messageId,
        );

        if (!messageExists) {
          console.log('Adding new message:', normalizedData);
          return [...prev, normalizedData];
        }
        return prev;
      });
      if (
        checkMess &&
        checkMess.status === 'sent' &&
        checkMess.senderId !== auth.userId
      ) {
        handleUpdateStatusMessage();
      }
    };

    socket?.on('receive_message', handleNewMessage);

    return () => {
      socket?.off('receive_message', handleNewMessage);
    };
  }, []);
  useEffect(() => {
    if (
      checkMess &&
      checkMess.status === 'sent' &&
      checkMess.senderId !== auth.userId
    ) {
      handleUpdateStatusMessage();
    }
  }, [messages]);
  useEffect(() => {
    socket?.on('out_group', (userId: any) => {
      console.log('out group: ', userId);
      Notification.showToast(
        'info',
        converInfo.groupName,
        'Bạn đã bị kích khỏi nhóm',
      );
      navigation.goBack();
    });
    return () => {
      socket?.off('out_group');
    };
  }, [converInfo]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <SafeAreaView style={globalStyles.main}>
        <HeaderComponent
          title={isPersonal ? name : converInfo.groupName}
          titleColor={colors.text}
          image={converInfo.avatar}
          iconLeft={
            <ArrowLeft size={appInfo.sizeIconBold} color={colors.icon} />
          }
          isBcolor
          iconRight={
            <Setting size={appInfo.sizeIconBold} color={colors.icon} />
          }
          onPress2={() => navigation.navigate('MessageNavigator')}
        />

        {messages?.length > 0 ? (
          <FlatList
            ref={scrollViewRef}
            data={messages}
            extraData={messages.length}
            keyExtractor={keyExtractor}
            style={{flex: 1, marginBottom: 12}}
            renderItem={renderItemMessages}
            // onEndReachedThreshold={0.05}
            scrollEventThrottle={50} // Tăng giá trị này để giảm số lần gọi onScroll
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingTop: 65,
            }}
            maxToRenderPerBatch={5} // Giảm số lượng item render trong một lần
            initialNumToRender={10}
            removeClippedSubviews={true} // Tách view ngoài màn hình
            updateCellsBatchingPeriod={50} // Gộp các cập nhật render
            ListHeaderComponent={page < limitPage ? ListHeader : <></>}
            onScroll={onScroll}
            onContentSizeChange={(width, height) => {
              if (messages.length > 0 && page === 1) {
                scrollViewRef.current?.scrollToOffset({
                  offset: height, // Cuộn trực tiếp đến cuối cùng
                  animated: false, // Không cần hiệu ứng
                });
              }
            }}
          />
        ) : (
          <></>
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
      {!!converInfo.block?.includes(auth.userId) ? (
        renderViewBlock()
      ) : (
        <ChatInput
          converInfo={converInfo}
          theme={converInfo.theme ?? theme}
          isBlock={!!friendData.block?.includes(converInfo.userId)}
          onSendMessage={onSendMessages}
          onScroll={() => scrollViewToEnd()}
          clearReply={clearReplyMessage}
          reply={replyMessage}
          userId={converInfo.userId ?? getUserIdGroup()}
        />
      )}
      {/* <LoadingModal visible={isLoading} /> */}
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
    height: 145,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',

    justifyContent: 'center',
  },
});
