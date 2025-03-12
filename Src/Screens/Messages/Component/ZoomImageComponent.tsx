import React, { useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewProps } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
interface Props {
  url: string;
  styles?: StyleProp<ViewProps>;
}
const ZoomImageComponent = (props: Props | any) => {
  const {url, styles} = props;
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <FastImage
          resizeMode="cover"
          source={{uri: url,priority:FastImage.priority.high, cache:FastImage.cacheControl.immutable}}
          style={[locastyles.thumbnail, styles]}
        />
      </TouchableOpacity>

      <ImageView
        images={[{uri: url}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled={true}
        animationType="fade"
      />
    </>
  );
};
export default ZoomImageComponent;
const locastyles = StyleSheet.create({
  thumbnail: {
    height: 85,
    width: 85,
    borderRadius: 8,
  },
});
