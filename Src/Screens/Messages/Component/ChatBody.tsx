import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {appColors} from '../../../Theme/Colors/appColors';
import {appInfo} from '../../../Theme/appInfo';
import {ButtonComponent, RowComponent} from '../../Components';
import OtherUserMessageView from './OtherUserMessageView';
import UserMessageView from './UserMessageView';
interface Props {
  currentUserID: string;
  userID: string;
  allMessages: any[];
  onPressImg: (arrImages:any[]) => void;

}
const ChatBody = (props: Props) => {
  const {currentUserID, userID, allMessages, onPressImg} = props;
  const renderImage = (
    index: number,
    arrImages: string[],
    isRight?: boolean,
  ) => {
    const totalImages = arrImages.length;
    const isStacked = totalImages > 1;

    // Kiểm tra nếu không có hình ảnh thì hiển thị loading
    if (arrImages.length === 0) {
      return <ActivityIndicator style={localStyles.image} />;
    }
    return (
      <RowComponent onPress={() => onPressImg(arrImages)} activeOpacity={0.8}>
        {arrImages.map((item, index) => (
          <Image
            key={index}
            source={{uri: item}}
            style={[
              localStyles.image,
              isStacked && {
                position: 'absolute', // Đặt vị trí hình ảnh là absolute
                left: isRight ? undefined : index * 2, // Điều chỉnh khoảng cách từ trái cho người khác
                right: isRight ? index * 2 : undefined, // Điều chỉnh khoảng cách từ phải cho chính mình
                top: index, // Điều chỉnh vị trí dọc để xếp chồng
                zIndex: totalImages - index,
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
    <View style={{flex: 1, marginBottom: 22}}>
      {allMessages &&
        allMessages.map((item, index) =>
          item.content ? (
            item.senderID === currentUserID ? (
              <UserMessageView
                key={index}
                message={item.content}
                time={item.timestamp}
                imageURL={item.imagesUrl}
              />
            ) : (
              <OtherUserMessageView
               
                key={index}
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
});
