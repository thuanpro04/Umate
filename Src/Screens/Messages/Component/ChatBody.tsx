import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import {appColors} from '../../../Theme/Colors/appColors';
import {appInfo} from '../../../Theme/appInfo';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import OtherUserMessageView from './OtherUserMessageView';
import UserMessageView from './UserMessageView';
import {UserInfo} from '../../Untils/UserInfo';
import {TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
interface Props {
  currentUserID: string;
  userID: string | string[];
  allMessages: any[];
  onPressImg: (urlImg: string) => void;
  navigation?: any;
}
const ChatBody = (props: Props) => {
  const {currentUserID, userID, allMessages, onPressImg, navigation} = props;
  const [isLoading, setLoading] = useState(true);
  const [showTimeMessages, setShowTimeMessages] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const iconShare = (
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
        onPress={() => navigation.navigate('ShareScreen', {arrUrlImages:arrImages, isShare:true})}
      />
    );
  };
  const renderImage = (
    index: number,
    arrImages: string[],
    isRight?: boolean,
  ) => {
    const totalImages = arrImages.length;
    const isStacked = totalImages > 1;

    return arrImages.map((item, imgIndex) => (
      <RowComponent
        onPress={() => onPressImg(item)}
        activeOpacity={0.8}
        styles={{}}
        key={imgIndex}>
        {imgIndex === arrImages.length - 1 &&
          isRight &&
          iconShare(isStacked, isRight ?? false, arrImages)}
        <Image
          key={imgIndex}
          source={{uri: item}}
          onLoadEnd={() => setLoading(false)} // Cập nhật sau khi từng hình ảnh được tải
          style={[
            localStyles.image,
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
          iconShare(isStacked, !isRight, arrImages)}
      </RowComponent>
    ));
  };

  return (
    <View style={{flex: 1, marginBottom: 22}}>
      {allMessages &&
        allMessages.map((item, index) =>
          item.content ? (
            item.senderID === currentUserID ? (
              <UserMessageView
                key={index}
                timeIndex={index}
                message={item.content}
                time={item.timestamp}
                imageURL={item.imagesUrl}
              />
            ) : (
              <OtherUserMessageView
                key={index}
                timeIndex={index}
                message={item.content}
                time={item.timestamp}
                imageURL={item.imagesUrl}
              />
            )
          ) : (
            <View
              key={index}
              style={[
                item.senderID === currentUserID
                  ? {alignItems: 'flex-end'}
                  : {alignItems: 'flex-start'},
                {
                  marginBottom: item.imagesUrl.length > 2 ? '50%' : 10,
                  marginTop: 10,
                },
              ]}>
              {item.imagesUrl &&
                renderImage(
                  index,
                  item.imagesUrl,
                  item.senderID === currentUserID,
                )}
              {showTimeMessages && (
                <TextComponent
                  label={UserInfo.getTimePresent(item.timestamp)}
                  color={appColors.grey2}
                />
              )}
            </View>
          ),
        )}
    </View>
  );
};

export default ChatBody;
const localStyles = StyleSheet.create({
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
