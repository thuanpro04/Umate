import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useSelector} from 'react-redux';
import {appColors} from '../../../Theme/Colors/appColors';
import {appInfo} from '../../../Theme/appInfo';
import {authSelector} from '../../../redux/reducers/authReducer';
import {RowComponent, TextComponent} from '../../Components';
import CustormLinkPreview from '../../Components/CustormLinkPreview';
import {groupServices} from '../../Services/groupServices';
import {userServices} from '../../Services/userService';
import {Notification} from '../../Untils/Notification';
import {UserInfo} from '../../Untils/UserInfo';
import CustormImageViewing from './CustormImageViewing';
import ReplyComponent from './ReplyComponent';
import ShowTimeMessage from './ShowTimeMessage';
import ShowViewCall from './ShowViewCall';
import ShowViewQrCode from './ShowViewQrCode';
import ShareDocuments from './ShareDocuments';
import RenderImageMess from './RenderImageMess';
import CustormLinkLocal from './CustormLinkLocal';
interface Props {
  currentUserId: string;
  urlImages?: any[];
  navigation?: any;
  updateRowRef: any;
  setReplyOnSwipeOpen: any;
  item?: any;
  name: string;
  isBlock: boolean;
  theme: any;
  conversationInfo: any;
}
const ChatItems = (props: Props) => {
  const {
    currentUserId,
    urlImages,
    navigation,
    updateRowRef,
    setReplyOnSwipeOpen,
    item,
    name,
    isBlock,
    theme,
    conversationInfo,
  } = props;
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<any[]>([]);
  const [user, setUser] = useState<any>('');

  const colors = appColors[theme];
  const {t} = useTranslation();
  const isNextMyMessage = true;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const condition = item.typeCall;
  const isUser = props?.item.senderId === props?.currentUserId;
  const getUserSenderId = async (senderId: string) => {
    const res = await userServices.getUserInfo(senderId);
    if (res && res?.data) {
      setUser(res.data);
    }
  };

  const getNameInGroup = (item: any) => {
    return conversationInfo.nickNames?.[item.senderId] ?? user.name;
  };
  const onChangeImageIndex = (index: number) => {
    setTimeout(() => {
      setImageIndex(index);
    }, 300);
  };
  const onChangeShowTime = (key: any) => {
    setShowTime(prev => ({...prev, [key]: !showTime[key]}));
  };

  const onSwipeableOpenAction = () => {
    if (props.item) {
      setReplyOnSwipeOpen({...props.item, name});
    }
    updateRowRef.current = null;
  };

  const renderLeftActions = (progressAnimatedValue: any) => {
    const size = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 100],
      outputRange: [0, 1, 1],
    });
    const trans = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -12, -20],
    });
    const routate = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 150],
      outputRange: ['0deg', '180deg', '0deg'],
    });

    return (
      <Animated.View
        style={[
          {width: 40},
          {transform: [{scale: size}, {translateX: trans}, {rotateY: routate}]},
          isNextMyMessage
            ? {marginBottom: 2, marginLeft: 16}
            : {marginBottom: 10},
        ]}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            width={20}
            height={20}
            tintColor={colors.icon}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/2958/2958791.png',
            }}
          />
        </View>
      </Animated.View>
    );
  };

  const onPressImg = (urlImg: string) => {
    const tempUrl = {uri: urlImg};
    const Images = urlImages ? urlImages.map((url: any) => ({uri: url})) : [];
    setDisplayImgs(Images);
    const imageIndex = Images.findIndex((img: any) => img.uri === tempUrl.uri);
    setImageIndex(imageIndex);
    setIsVisible(true);
  };
  const showNotificationQrCode = (
    data: any,
    messageId: string,
    content: string,
    timestamp: any,
  ) => {
    const decodedData = JSON.parse(atob(data));
    Alert.alert(t('attendance_code'), t('how_attendance'), [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('confirm'),
        onPress: () => {
          handleUpdateAttendedGroup(decodedData, messageId, content, timestamp);
        },
      },
    ]);
  };
  const checkLimitQRcode = (content: string, timestamp: any) => {
    const time = new Date(timestamp);
    const expirationDate = new Date(time.getTime() + Number(content) * 60000);
    const now = new Date();
    if (now > expirationDate) {
      return true;
    }
    return false;
  };
  const handleUpdateAttendedGroup = async (
    qrdata: any,
    messageId: string,
    content: string,
    timestamp: any,
  ) => {
    if (checkLimitQRcode(content, timestamp)) {
      Notification.showToast('error', 'Quét mã', 'Mã đã hết hạn !!');
      return;
    }
    Notification.showToast(
      'success',
      'Quét mã',
      'Bạn đã điểm danh thành công !!',
    );

    const data = {
      ...qrdata,
      messageId,
      receiverId: [
        conversationInfo.leader.userId,
        conversationInfo.deputyLeader.userId,
      ],
      currentUserId: currentUserId,
      id: conversationInfo.groupId,
    };
    const res = await groupServices.updateAttendedGroup(data);
    if (res && res.data) {
      console.log('Update attended successfully !!', res.data);
    }
  };

  const Message = ({item, index}: any) => {
    const content = UserInfo.decryptText(item.content);
    const isLink = urlRegex.test(content);
    const isLocal = isLink && content.includes('http://localhost:3004/');
    const isQrcode = item.QRCode && item.QRCode?.qrdata;
    const text = isQrcode && content.split(' ')[3];

    return (
      <View key={index} style={{flex: 1}}>
        <View
          style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            marginVertical: 4,
          }}>
          {showTime[index] && (
            <ShowTimeMessage
              color={colors.text2}
              timestamp={props.item.timestamp}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              item.recipients?.length > 0 && getUserSenderId(item.senderId);
              onChangeShowTime(index);
            }}
            style={[
              styles.container,
              {
                backgroundColor: isLocal
                  ? 'transparent'
                  : isUser
                  ? colors.bgItem
                  : colors.bgItem2,
                borderBottomLeftRadius: !isUser ? 0 : 20,
                paddingTop: item?.reply ? 2 : 8,
                borderBottomRightRadius: !isUser ? 20 : 0,
                paddingHorizontal: item?.reply ? 2 : 8,
              },
            ]}>
            {condition ? (
              <ShowViewCall
                name={name}
                color={colors.text}
                condition={condition}
                content={content}
                conversationInfo={conversationInfo}
                isBlock={isBlock}
                iColor={colors.icon}
                reply={item?.reply}
                userId={currentUserId}
                key={index}
              />
            ) : (
              <>
                {item?.reply && item.reply.content && (
                  <ReplyComponent
                    senderId={item?.reply.senderId}
                    currentUserId={currentUserId}
                    color={colors.text}
                    content={item.reply.content}
                  />
                )}
                {isLink ? (
                  <>
                    {!isLocal ? (
                      <View style={{height: item.title ? 275 : 255}}>
                        <CustormLinkPreview
                          theme={theme}
                          txtLink={content}
                          title={item.title}
                        />
                      </View>
                    ) : (
                      <CustormLinkLocal
                        isUser={isUser}
                        openLinkLocal={() => console.log('hello')}
                      /> 
                    )}
                  </>
                ) : isQrcode ? (
                  <ShowViewQrCode
                    showNotificationQrCode={() =>
                      showNotificationQrCode(
                        item.QRCode.qrdata,
                        item.messageId,
                        text,
                        item.timestamp,
                      )
                    }
                    qrdata={item.QRCode.qrdata}
                  />
                ) : (
                  <TextComponent
                    key={index}
                    label={content}
                    color={colors.text}
                    styles={[
                      styles.contentStyles,
                      {marginHorizontal: item?.reply ? 15 : 0},
                    ]}
                  />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
        {isUser
          ? showTime[index] && (
              <View style={{alignSelf: isUser ? 'flex-end' : 'flex-start'}}>
                <TextComponent
                  label={props.item.status}
                  color={appColors.grey2}
                  size={12}
                />
              </View>
            )
          : showTime[index] && (
              <View style={{marginLeft: 12}}>
                {user?.name && (
                  <TextComponent
                    label={getNameInGroup(item)}
                    color={colors.text2}
                    size={8}
                  />
                )}
              </View>
            )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={updateRowRef}
        friction={2} // Quy định mức độ ma sát khi vuốt
        leftThreshold={40} // // Định nghĩa khoảng cách vuốt tối thiểu
        onSwipeableOpen={onSwipeableOpenAction} //  mức kích hoạt hành động vuốt và thành phần đã mở.
        renderRightActions={isUser ? renderLeftActions : undefined} // Hàm render một giao diện hoặc hành động xuất hiện khi người dùng vuốt sang trái
        renderLeftActions={!isUser ? renderLeftActions : undefined}>
        {props?.item && props?.item.content ? (
          <Message {...props} />
        ) : (
          <View
            style={[
              {
                alignItems:
                  props?.item.senderId === currentUserId
                    ? 'flex-end'
                    : 'flex-start',
                marginBottom:
                  props?.item.imagesUrl && props?.item.imagesUrl.length > 2
                    ? '50%'
                    : 10,
                marginTop: 10,
              },
            ]}>
            {props?.item.imagesUrl && (
              <RenderImageMess
                navigation={navigation}
                onPressImg={onPressImg}
                arrImages={props?.item.imagesUrl}
                isRight={isUser}
              />
            )}
          </View>
        )}
      </Swipeable>
      {displayImgs?.length > 0 && (
        <CustormImageViewing
          onChangeImageIndex={onChangeImageIndex}
          onClose={() => setIsVisible(false)}
          imageIndex={imageIndex}
          images={displayImgs}
          isVisible={isVisible}
        />
      )}
    </GestureHandlerRootView>
  );
};

export default ChatItems;
const styles = StyleSheet.create({
  container: {
    maxWidth: 275,
    marginVertical: 4,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 8,
    marginHorizontal: 8,
  },
  contentStyles: {
    fontSize: 14,

    paddingTop: 4,
  },

  imageContainerOther: {
    transform: [{rotate: '5deg'}],
  },

  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1, // Đảm bảo rằng indicator nằm trên ảnh
  },
});
// <View>
//   <View
//     style={{
//       alignItems: 'flex-start',
//       justifyContent: 'flex-start',
//     }}>
//     <TextComponent
//       key={index}
//       label={content}
//       color={colors.text}
//       styles={[
//         styles.contentStyles,
//         {marginHorizontal: item?.reply ? 15 : 0, fontSize: 16},
//       ]}
//       title
//     />
//     <RowComponent>
//       <CallIncoming size={12} color={colors.icon} />
//       <TextComponent
//         key={index}
//         label={'Cuộc gọi thoại'}
//         color={colors.text}
//         styles={[
//           styles.contentStyles,
//           {marginHorizontal: item?.reply ? 15 : 0},
//         ]}
//         size={12}
//       />
//     </RowComponent>
//   </View>
//   <SpaceComponent height={5} />
//   <SpaceComponent
//     bgCrossBar="grey"
//     width={'100%'}
//     isCrossBar
//     height={0.5}
//   />
//   <SpaceComponent height={5} />
//   <CustomCallButtonComponent
//     converInfo={conversationInfo}
//     isDisible={isBlock}
//     type={condition}
//     styles={{justifyContent: 'center', alignItems: 'center'}}
//     targetName={
//       conversationInfo.type === 'personal'
//         ? name
//         : conversationInfo.groupName
//     }
//     targetId={
//       conversationInfo.type === 'personal'
//         ? conversationInfo.userId
//         : conversationInfo.invitedUsers?.filter(
//             (id: any) => id !== auth.userId,
//           )
//     }
//     text="Gọi lại"
//     txtStyles={{color: appColors.blue, fontSize: 18}}
//   />
// </View>
