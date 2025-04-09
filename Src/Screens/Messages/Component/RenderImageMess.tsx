import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ShareDocuments from './ShareDocuments';
import FastImage from 'react-native-fast-image';
import {RowComponent} from '../../Components';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
interface Props {
  arrImages: any[];
  onPressImg: (url: string) => void;
  isRight?: boolean;
  navigation: any;
}
const RenderImageMess = (props: Props) => {
  const {arrImages, onPressImg, isRight, navigation} = props;
  const totalImages = arrImages.length;
  const isStacked = totalImages > 1;
  return arrImages.map((item, imgIndex) => {
    return (
      <RowComponent
        onPress={() => onPressImg(item)}
        activeOpacity={0.8}
        styles={{}}
        key={imgIndex}>
        {imgIndex === arrImages.length - 1 && isRight && (
          <ShareDocuments
            navigation={navigation}
            isStacked={isStacked}
            arrImages={arrImages}
            isRight={isRight ?? false}
          />
        )}
        {item && (
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
        )}
        {imgIndex === arrImages.length - 1 && !isRight && (
          <ShareDocuments
            navigation={navigation}
            isStacked={isStacked}
            arrImages={arrImages}
            isRight={!isRight}
          />
        )}
      </RowComponent>
    );
  });
};

export default RenderImageMess;

const styles = StyleSheet.create({
  imageStyle: {
    width: appInfo.size.WIDTH * 0.51, // Chiều rộng hình ảnh
    height: appInfo.size.HEIGHT * 0.23, // Chiều cao hình ảnh
    borderRadius: 10, // Bo góc hình ảnh
    backgroundColor: appColors.grey,
    resizeMode: 'cover',
  },
});
