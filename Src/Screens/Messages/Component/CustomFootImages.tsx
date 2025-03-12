import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {appColors} from '../../../Theme/Colors/appColors';
import {ButtonComponent} from '../../Components';
import FastImage from 'react-native-fast-image';
interface Props {
  arrImages: string[];
  indexImage: number;
  onChangeImageIndex: (indexImage: number) => void;
}
const CustomFootImages = (props: Props) => {
  const {arrImages, indexImage, onChangeImageIndex} = props;
  const flatlistRef = useRef<FlatList>(null);

  const renderImages = (image: any, index: number) => {
    return (
      <ButtonComponent
        styles={styles.container}
        type="action"
        activeOpacity={0.2}
        onPress={() => onChangeImageIndex(index)}>
        <FastImage
          source={{
            uri: image.uri,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={[
            styles.imageStyles,
            {
              borderColor:
                index === indexImage ? appColors.white : appColors.black,
              borderWidth: 1,
            },
          ]}
        />
      </ButtonComponent>
    );
  };
  return (
    <FlatList
      ref={flatlistRef}
      showsHorizontalScrollIndicator={false}
      data={arrImages}
      horizontal
      removeClippedSubviews={true}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => renderImages(item, index)}
      initialNumToRender={15} // Tăng số lượng phần tử được render ban đầu
      windowSize={15}
    />
  );
};

export default CustomFootImages;

const styles = StyleSheet.create({
  imageStyles: {
    height: 62,
    width: 62,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  container: {
    paddingHorizontal: 5,
  },
});
