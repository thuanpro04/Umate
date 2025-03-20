import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
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
  
  return (
    <ImageViewing
      imageIndex={imageIndex}
      images={images}
      visible={isVisible}
      onRequestClose={onClose}
      HeaderComponent={() => (
        <CustomHeaderImages onPressClose={onClose} img={images[imageIndex]} />
      )}
      FooterComponent={useCallback(
        () => (
          <CustomFootImages
            indexImage={imageIndex}
            arrImages={images}
            onChangeImageIndex={onChangeImageIndex}
          />
        ),
        [imageIndex],
      )}
    />
  );
};

export default CustormImageViewing;

const styles = StyleSheet.create({});
