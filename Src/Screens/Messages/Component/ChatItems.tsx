import React, { useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import ImageViewing from 'react-native-image-viewing';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { appColors } from '../../../Theme/Colors/appColors';
import { appInfo } from '../../../Theme/appInfo';
import { RowComponent, TextComponent } from '../../Components';
import { UserInfo } from '../../Untils/UserInfo';
import CustomFootImages from './CustomFootImages';

interface Props {
  currentUserID: string;
  userID: string | string[];
  urlImages?: any[];
  navigation?: any;
  members?: any[];
  updateRowRef: any;
  setReplyOnSwipeOpen: any;
  item?: any;
}
const ChatItems = (props: Props) => {
  const {
    currentUserID,
    userID,
    urlImages,
    navigation,
    members,
    updateRowRef,
    setReplyOnSwipeOpen,
    item,
  } = props;
  const [showTimeMessages, setShowTimeMessages] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<any[]>([]);
  const isNextMyMessage = true;
  const isUser = props?.item.senderID === props?.currentUserID;
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
  const renderImage = (arrImages: string[], isRight?: boolean) => {
    const totalImages = arrImages.length;
    const isStacked = totalImages > 1;

    return (
      arrImages.length > 0 &&
      arrImages.map((item, imgIndex) => (
        <RowComponent
          onPress={() => onPressImg(item)}
          activeOpacity={0.8}
          styles={{}}
          key={imgIndex}>
          {imgIndex === arrImages.length - 1 &&
            isRight &&
            shareDocuments(isStacked, isRight ?? false, arrImages)}
          <Image
            key={imgIndex}
            source={{uri: item}}
            onLoadEnd={() => setLoading(false)} // Cập nhật sau khi từng hình ảnh được tải
            style={[
              styles.image,
              isStacked && {
                position: 'absolute',
                left: isRight ? undefined : imgIndex * 5, // Điều chỉnh khoảng cách từ trái
                right: isRight ? imgIndex * 5 : undefined, // Điều chỉnh khoảng cách từ phải
                top: -imgIndex, // Xếp chồng theo index
                zIndex: totalImages - imgIndex,
              },
            ]}
            onError={error =>
              console.log('Error loading image:', error.nativeEvent.error)
            }
          />
          {imgIndex === arrImages.length - 1 &&
            !isRight &&
            shareDocuments(isStacked, !isRight, arrImages)}
        </RowComponent>
      ))
    );
  };
  const onSwipeableOpenAction = () => {
    if (props.item) {
      setReplyOnSwipeOpen({...props.item});
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
            tintColor={'black'}
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
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const Message = ({item, index}: any) => {
    const isUser = item.senderID === currentUserID ? false : true;
    let parts = item.content.split(urlRegex);

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => onChangeShowTime(index)}
          style={[
            styles.container,
            {
              backgroundColor: isUser
                ? 'rgba(121,178,243,0.3)'
                : 'rgba(116,208,103,0.3)',
              alignSelf: isUser ? 'flex-start' : 'flex-end',
              borderBottomLeftRadius: !isUser ? 20 : 0,
              paddingTop: item?.reply ? 2 : 8,
              borderBottomRightRadius: isUser ? 20 : 0,
              paddingHorizontal: item?.reply ? 2 : 8,
            
            },
          ]}>
          {item?.reply && item.reply.content && (
            <View
              style={[
                styles.replyStyles,
                {
                  borderLeftColor:
                    item?.reply?.senderID === currentUserID
                      ? '#2196f3'
                      : 'green',
                },
              ]}>
              <Text style={{fontSize: 14, color: 'black'}}>
                {item?.reply?.content}
              </Text>
            </View>
          )}
          {parts.map((part: any, index: any) => {
            if (urlRegex.test(part)) {
              return (
                <TouchableOpacity
                  onPress={() => handleLinkPress(part)}
                  key={index}>
                  <TextComponent
                    label={part}
                    styles={[
                      styles.contentStyles,
                      {
                        marginHorizontal: item?.reply ? 15 : 0,
                        color: '#1e90ff',
                        textDecorationLine: 'underline',
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            } else if (part.length > 0) {
              return (
                <TextComponent
                  key={index}
                  label={part}
                  styles={[
                    styles.contentStyles,
                    {marginHorizontal: item?.reply ? 15 : 0},
                  ]}
                />
              );
            }
          })}
        </TouchableOpacity>
        {showTime[index] && (
          <View style={{alignItems: isUser ? 'flex-start' : 'flex-end'}}>
            <TextComponent
              label={UserInfo.getTimePresent(props?.item.timestamp)}
              color={appColors.grey2}
              size={8}
            />
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
                  props?.item.senderID === currentUserID
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
                props?.item.senderID === currentUserID,
              )}
          </View>
        )}
      </Swipeable>
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
    </GestureHandlerRootView>
  );
};

export default ChatItems;
const styles = StyleSheet.create({
  container: {
    maxWidth: 275,
    marginVertical: 8,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 8,
    marginHorizontal: 8,
  },
  contentStyles: {
    fontSize: 14,
    color: 'black',
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
  image: {
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
