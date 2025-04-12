import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomHeaderImages from './CustomHeaderImages';
import CustomFootImages from './CustomFootImages';
import ImageViewing from 'react-native-image-viewing';

interface Props {
  images: any[];
  isVisible: boolean;
  imageIndex: number;
  onClose: () => void;
  onChangeImageIndex: (index: number) => void;
}
const CustormImageViewing = (props: Props) => {
  const {imageIndex, images, isVisible, onChangeImageIndex, onClose} = props;
  const [index, setIndex] = useState(imageIndex);

  return (
    <ImageViewing
      imageIndex={imageIndex}
      images={images}
      visible={isVisible}
      onImageIndexChange={imageIndex => setIndex(imageIndex)}
      onRequestClose={onClose}
      HeaderComponent={() => (
        <CustomHeaderImages
          onPressClose={() => {
            setIndex(0);
            onClose();
          }}
          img={images[imageIndex]}
        />
      )}
      FooterComponent={useCallback(
        () => (
          <CustomFootImages
            indexImage={index}
            arrImages={images}
            onChangeImageIndex={onChangeImageIndex}
          />
        ),
        [index, imageIndex],
      )}
    />
  );
};

export default CustormImageViewing;

const styles = StyleSheet.create({});
