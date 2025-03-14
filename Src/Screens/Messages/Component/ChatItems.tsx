import {CallIncoming} from 'iconsax-react-native';
import React, {memo, useCallback, useState} from 'react';
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
import {profileSelector} from '../../../redux/reducers/profileSlice';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import CustormLinkPreview from '../../Components/CustormLinkPreview';
import {userServices} from '../../Services/userService';
import {UserInfo} from '../../Untils/UserInfo';
import CustomCallButtonComponent from './CustomCallButtonComponent';
import CustormImageViewing from './CustormImageViewing';
import CustormQRCode from '../../QRCode/CustormQRCode';
import QRCode from 'react-native-qrcode-svg';
import {useTranslation} from 'react-i18next';
import {Notification} from '../../Untils/Notification';
import {messageServices} from '../../Services/messageServices';
import {authSelector} from '../../../redux/reducers/authReducer';
interface Props {
  currentUserId: string;
  userId?: string | string[];
  urlImages?: any[];
  navigation?: any;
  members?: any[];
  updateRowRef: any;
  setReplyOnSwipeOpen: any;
  item?: any;
  name: string;
  isBlock: Boolean;
  blockId: string;
  theme: any;
  conversationInfo: any;
}
const ChatItems = (props: Props) => {
  const {
    currentUserId,
    userId,
    urlImages,
    navigation,
    members,
    updateRowRef,
    setReplyOnSwipeOpen,
    item,
    name,
    isBlock,
    blockId,
    theme,
    conversationInfo,
  } = props;
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<any[]>([]);
  const [user, setUser] = useState<any>('');
  const profile = useSelector(profileSelector);
  const auth = useSelector(authSelector);
  const colors= appColors[theme ?? 'light'];
  const {t} = useTranslation();

  const isNextMyMessage = true;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const condition = item.typeCall;
  const isUser = props?.item.senderId === props?.currentUserId;
  const getUserSenderId = async (senderId: string) => {
    try {
      const res = await userServices.getUserInfo(senderId);
      if (res && res?.data) {
        setUser(res.data);
      }
    } catch (error) {
      console.log('get user sender id error: ', error);
    }
  };
  const onChangeImageIndex = (index: number) => {
    setTimeout(() => {
      setImageIndex(index);
    }, 300);
  };
  const onChangeShowTime = (key: any) => {
    setShowTime(prev => ({...prev, [key]: !showTime[key]}));
  };
  const shareDocuments = (
    isStacked: boolean,
    isRight: boolean,
    arrImages: string[],
  ) => {
    return (
      <EvilIcons
        name="share-google"
        color={appColors.blueBack}
        size={appInfo.sizeIconBold}
        style={{
          position: isStacked ? 'absolute' : 'relative',
          left: isRight ? undefined : appInfo.size.WIDTH * 0.57, // Điều chỉnh khoảng cách từ trái
          right: isRight && isStacked ? appInfo.size.WIDTH * 0.57 : 0,
          top: isStacked ? appInfo.size.HEIGHT * 0.12 : 0,
        }}
        onPress={() =>
          navigation.navigate('ShareScreen', {
            arrUrlImages: arrImages,
            isShare: true,
          })
        }
      />
    );
  };
  const renderImage = useCallback(
    (arrImages: string[], isRight?: boolean) => {
      const totalImages = arrImages.length;
      const isStacked = totalImages > 1;
      return arrImages.map((item, imgIndex) => {
        return (
          <RowComponent
            onPress={() => onPressImg(item)}
            activeOpacity={0.8}
            styles={{}}
            key={imgIndex}>
            {imgIndex === arrImages.length - 1 &&
              isRight &&
              shareDocuments(isStacked, isRight ?? false, arrImages)}
            <FastImage
              style={[
                styles.imageStyle,
                isStacked && {
                  position: 'absolute',
                  left: isRight ? undefined : imgIndex * 5, // Điều chỉnh khoảng cách từ trái
                  right: isRight ? imgIndex * 5 : undefined, // Điều chỉnh khoảng cách từ phải
                  top: -imgIndex, // Xếp chồng theo index
                  zIndex: totalImages - imgIndex,
                },
              ]}
              source={{
                uri: item,
                priority: FastImage.priority.high, // Đặt mức ưu tiên cao
                cache: FastImage.cacheControl.immutable, // Cache vĩnh viễn cho URL không thay đổi
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            {imgIndex === arrImages.length - 1 &&
              !isRight &&
              shareDocuments(isStacked, !isRight, arrImages)}
          </RowComponent>
        );
      });
    },
    [props?.item.imagesUrl],
  );
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
  const showNotificationQrCode = (data: any, messageId: string) => {
    const decodedData = JSON.parse(atob(data));
    Alert.alert('Mã điểm danh', 'Bạn có muốn điểm danh không ?', [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('confirm'),
        onPress: () => {
          handleUpdateAttendedGroup(decodedData, messageId);
        },
      },
    ]);
  };
  const handleUpdateAttendedGroup = async (qrdata: any, messageId: string) => {
    try {
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
        currentUserId: auth.userId,
      };
      const res = await messageServices.updateAttendedGroup(data);
      if (res && res.data) {
        console.log('Update attended successfully !!', res.data);
      }
    } catch (error) {
      console.log('Atteded group error: ', error);
    }
  };
  const Message = memo(({item, index}: any) => {
    const isLink = urlRegex.test(item.content);
    return (
      <View key={index} style={{flex: 1}}>
        <View
          style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            marginVertical: 4,
          }}>
          {showTime[index] && (
            <View style={{alignSelf: 'center'}}>
              <TextComponent
                label={UserInfo.getTimePresent(props.item.timestamp)}
                color={appColors.grey2}
                size={8}
              />
            </View>
          )}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              item.recipients &&
                item.recipients.length > 0 &&
                getUserSenderId(item.senderId);
              onChangeShowTime(index);
            }}
            style={[
              styles.container,
              {
                backgroundColor: isUser ? colors.bgItem : colors.bgItem2,

                borderBottomLeftRadius: !isUser ? 0 : 20,
                paddingTop: item?.reply ? 2 : 8,
                borderBottomRightRadius: !isUser ? 20 : 0,
                paddingHorizontal: item?.reply ? 2 : 8,
              },
            ]}>
            {condition ? (
              <View>
                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                  }}>
                  <TextComponent
                    key={index}
                    label={item.content}
                    styles={[
                      styles.contentStyles,
                      {marginHorizontal: item?.reply ? 15 : 0, fontSize: 16},
                    ]}
                    title
                  />
                  <RowComponent>
                    <CallIncoming size={12} color={colors.icon} />
                    <TextComponent
                      key={index}
                      label={'Cuộc gọi thoại'}
                      styles={[
                        styles.contentStyles,
                        {marginHorizontal: item?.reply ? 15 : 0},
                      ]}
                      size={12}
                    />
                  </RowComponent>
                </View>
                <SpaceComponent height={5} />
                <SpaceComponent
                  bgCrossBar="grey"
                  width={'100%'}
                  isCrossBar
                  height={0.5}
                />
                <SpaceComponent height={5} />
                <CustomCallButtonComponent
                  blockId={blockId}
                  isDisible={isBlock}
                  type={condition}
                  styles={{justifyContent: 'center', alignItems: 'center'}}
                  targetName={name}
                  userId={currentUserId}
                  userName={UserInfo.getName(profile.name)}
                  avatar={profile.avatar}
                  targetId={userId}
                  text="Gọi lại"
                  txtStyles={{color: appColors.blue, fontSize: 18}}
                />
              </View>
            ) : (
              <>
                {item?.reply && item.reply.content && (
                  <View
                    style={[
                      styles.replyStyles,
                      {
                        borderLeftColor:
                          item?.reply?.senderId === currentUserId
                            ? '#2196f3'
                            : 'green',
                      },
                    ]}>
                    <TextComponent
                      styles={{fontSize: 14}}
                      label={item?.reply?.content}
                    />
                  </View>
                )}
                {isLink ? (
                  <View style={{height: 255}}>
                    <CustormLinkPreview txtLink={item.content} />
                  </View>
                ) : item.QRCode && item.QRCode.qrdata ? (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <SpaceComponent height={10} />
                    <QRCode value={item.QRCode.qrdata} size={200} />
                    <SpaceComponent height={5} />
                    <View
                      style={{
                        backgroundColor: 'grey',
                        width: '100%',
                        height: 1,
                      }}
                    />
                    <SpaceComponent height={10} />
                    <TouchableOpacity
                      onPress={() =>
                        showNotificationQrCode(
                          item.QRCode.qrdata,
                          item.messageId,
                        )
                      }>
                      <TextComponent label="Quét mã " color={appColors.blue} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TextComponent
                    key={index}
                    label={item.content}
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
                {user && user.name && (
                  <TextComponent
                    label={UserInfo.getName(user ? user.name : '')}
                    color={appColors.grey2}
                    size={8}
                  />
                )}
              </View>
            )}
      </View>
    );
  });

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
            {props?.item.imagesUrl &&
              renderImage(
                props?.item.imagesUrl,
                props?.item.senderId === currentUserId,
              )}
          </View>
        )}
      </Swipeable>
      {displayImgs && (
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
  replyStyles: {
    borderRadius: 12,
    maxWidth: 275,
    marginHorizontal: 8,

    backgroundColor: 'rgba(0,0,0,0.06)',
    borderLeftWidth: 3,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  imageContainerOther: {
    transform: [{rotate: '5deg'}],
  },
  imageStyle: {
    width: appInfo.size.WIDTH * 0.51, // Chiều rộng hình ảnh
    height: appInfo.size.HEIGHT * 0.23, // Chiều cao hình ảnh
    borderRadius: 10, // Bo góc hình ảnh
    backgroundColor: appColors.grey,
    resizeMode: 'cover',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1, // Đảm bảo rằng indicator nằm trên ảnh
  },
});
