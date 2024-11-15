import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ArrowLeft, HambergerMenu} from 'iconsax-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
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
  TextComponent,
} from '../Components';
import ChatBody from './Component/ChatBody';
import ChatFoot from './Component/ChatFoot';
import {messageServices} from '../Services/messageServices';
import CustomFootImages from './Component/CustomFootImages';
import {UserInfo} from '../Untils/UserInfo';

const ChatScreen = ({navigation}: any) => {
  const {person, myGroup, currentUserID} = useRoute().params as {
    person: {
      userName: string;
      avatar: string;
      userID: string;
    };
    myGroup: {
      groupID: string;
      groupName: string;
      invitedUsers: any[];
      leader: any;
      deputyLeader: any;
      avatar: string;
    };
    currentUserID: string;
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [members, setMembers] = useState<any>([]);
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
  const getMessages = useCallback(async () => {
    try {
      const res = await messageServices.getAllMessagesUser(
        currentUserID,
        person ? person.userID : undefined,
        myGroup ? UserInfo.getIdUsers(myGroup.invitedUsers) : undefined,
        myGroup ? myGroup.groupID : undefined,
      );

      if (res?.data) {
        setMembers(res.data.invitedUsers);
        setMessages(res.data.messagesAll);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [
    currentUserID,
    person ? person.userID : myGroup ? myGroup.invitedUsers : undefined,
  ]);
  const onSendMessages = useCallback(
    (val: {content?: string; imagesUrl?: string[]}) => {
      if (val.content?.trim() || val.imagesUrl) {
        const newMessage = {
          senderID: currentUserID,
          content: val.content?.trim() || '',
          imagesUrl: val.imagesUrl || [],
          timestamp: new Date().toISOString(),
        };
        let updatedMessages = [...messages];
        if (myGroup) {
          const groupMessages = {
            ...newMessage,
            groupName: myGroup.groupName,
            recipients: getUserIdGroup(),
            type: 'group',
          };
          updatedMessages.push('groupMessages', groupMessages); // Thêm tin nhắn nhóm vào
        } else {
          const personMessages = {
            ...newMessage,
            receiverID: person.userID,
            type: 'personal',
          };
          updatedMessages.push(personMessages); // Thêm tin nhắn cá nhân vào
        }
        // Chỉ gọi setMessages một lần
        setMessages(updatedMessages);
        console.log('updatedMessages', updatedMessages);
      }
    },
    [currentUserID, person?.userID, myGroup?.invitedUsers, messages],
  );
  const handleScroll = useCallback((event: any) => {
    // layoutMeasurement: Đây là một đối tượng chứa thông tin về kích thước của khu vực hiển thị hiện tại (viewport) trong ứng dụng.
    // contentOffset.y: Giá trị này cho biết vị trí cuộn theo chiều dọc.
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const yOffSet = contentOffset.y;
    const contentHeight = contentSize.height;
    const layoutHeight = layoutMeasurement.height;
    yOffSet + layoutHeight < contentHeight - 100
      ? setShowScrollToBottom(true)
      : setShowScrollToBottom(false);
  }, []);
  const scrollToEnd = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, []);
  const onPressImg = (urlImg: string) => {
    const tempUrl = {uri: urlImg};
    const allImagesMessages = messages
      .filter(item => item.imagesUrl && item.imagesUrl.length > 0) // Lọc các phần tử có imagesUrl không rỗng
      .flatMap(item => item.imagesUrl) // Lấy tất cả ảnh trong imagesUrl
      .filter(imageUrl => imageUrl !== null); // Loại bỏ các giá trị null
    const Images = allImagesMessages.map(url => ({uri: url}));
    setDisplayImgs(Images);
    const imageIndex = Images.findIndex(img => img.uri === tempUrl.uri);
    setImageIndex(imageIndex);
    setIsVisible(true);
  };
  const onChangeImageIndex = (index: number) => {
    setTimeout(() => {
      setImageIndex(index);
    }, 300);
  };

  const renderChatBody = useCallback(() => {
    return (
      <ChatBody
        navigation={navigation}
        currentUserID={currentUserID}
        userID={person ? person.userID : myGroup ? myGroup.invitedUsers : ''}
        allMessages={messages}
        onPressImg={onPressImg}
        members={members}
      />
    );
  }, [
    messages,
    currentUserID,
    person && person.userID,
    myGroup && myGroup.invitedUsers,
    ,
    onSendMessages,
  ]);
  const getUserIdGroup = () => {
    return myGroup
      ? myGroup.invitedUsers
          .filter(item => item.userID !== currentUserID)
          .map(item => item.userID)
      : '';
  };
  const onDrawerNavigation = () => {
    navigation.openDrawer();
  };
  return (
    <ContainerComponent styles={styles.container} key={refreshKey}>
      <View style={{paddingHorizontal: 18, flex: 1}}>
        <HeaderComponent
          title={person ? person.userName : myGroup ? myGroup.groupName : ''}
          image={
            person
              ? person.avatar
              : myGroup
              ? myGroup.avatar
              : 'data:image/png;base64,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'
          }
          iconLeft={
            <ArrowLeft size={appInfo.sizeIconBold} color={appColors.black} />
          }
          isBcolor
          iconRight={
            <HambergerMenu
              size={appInfo.sizeIconBold}
              color={appColors.black}
            />
          }
          onPress2={onDrawerNavigation}
        />
        {messages.length > 0 ? (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}>
            {renderChatBody()}
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextComponent
              label="Messages not found 🙁"
              color={appColors.blue3}
            />
          </View>
        )}
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
      </View>
      <ChatFoot
        currentUserID={currentUserID}
        userID={person ? person.userID : myGroup ? getUserIdGroup() : ''}
        onSendMessage={onSendMessages}
        groupID={myGroup ? myGroup.groupID : undefined}
      />
      {displayImgs && (
        <ImageViewing
          imageIndex={imageIndex}
          images={displayImgs}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          FooterComponent={() => (
            <CustomFootImages
              indexImage={imageIndex}
              arrImages={displayImgs}
              onChangeImageIndex={onChangeImageIndex}
            />
          )}
        />
      )}
    </ContainerComponent>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
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
