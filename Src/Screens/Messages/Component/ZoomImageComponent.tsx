import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, StyleProp, StyleSheet, ViewProps} from 'react-native';
import Lightbox from 'react-native-lightbox-v2';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
        <Image
          resizeMode="cover"
          source={{uri: url}}
          style={[locastyles.thumbnail, styles]}
        />
      </TouchableOpacity>

      <ImageView
        images={[{uri: url}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled={false}
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
