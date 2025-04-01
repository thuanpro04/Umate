import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TextComponent} from '../../Components';
import {appColors} from '../../../Theme/Colors/appColors';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {UserInfo} from '../../Untils/UserInfo';
import FastImage from 'react-native-fast-image';
import {CloseCircle} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
interface Props {
  clearReply: any;
  message: any;
}
const Replymessage = (props: Props) => {
  const {clearReply, message} = props;
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const isUser = message?.receiverId !== auth.userId;

  const boxHeight = useSharedValue(0);
  const urlImg = message?.imagesUrl
    ? message.imagesUrl[message?.imagesUrl.length - 1]
    : undefined;
  const toggleBox = (status?: any) => {
    boxHeight.value = withTiming(status ? 65 : 0, {duration: 300});
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: boxHeight.value,
      opacity: boxHeight.value === 0 ? 0 : 1,
    };
  });
  const animatedImgColor = useAnimatedStyle(() => {
    const opacity = withTiming(interpolate(boxHeight.value, [0, 65], [0, 1]));
    const width = withTiming(interpolate(boxHeight.value, [0, 65], [0, 20]));
    const height = withTiming(interpolate(boxHeight.value, [0, 65], [0, 20]));
    const translateX = interpolate(boxHeight.value, [0, 65], [-22, 0]);
    const rotateY = `${interpolate(boxHeight.value, [0, 65], [160, 0])}deg`;
    return {
      opacity,
      width,
      height,
      transform: [{translateX}, {rotateY: withTiming(rotateY)}],
    };
  });
  const animatedColor = useAnimatedStyle(() => {
    return {
      borderRightColor:
        boxHeight.value === 0 ? 'white' : isUser ? '#2196f3' : 'green',
      opacity: boxHeight.value === 0 ? 0 : 1,
    };
  });
  useEffect(() => {
    toggleBox(message !== null);
  }, [message]);
  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        ,
        {backgroundColor: colors.background},
      ]}>
      <Animated.View style={[styles.replyImageContainer, animatedColor]}>
        <Animated.Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/18436/18436775.png',
          }}
          style={[
            animatedImgColor,
            {
              tintColor: isUser ? '#2196F3' : 'green',
              height: 20,
              width: 20,
            },
          ]}
        />
      </Animated.View>
      <View style={styles.messageContainer}>
        {message?.content ? (
          <View>
            <TextComponent
              label={`Trả lời ${isUser ? 'chính mình' : message.name}`}
              styles={{fontStyle: 'italic'}}
            />
            <TextComponent
              label={UserInfo.getContent(message?.content)}
              color={colors.text2}
              styles={{marginLeft: 12}}
              numberOfLine={2}
            />
          </View>
        ) : (
          urlImg && (
            <FastImage
              source={{
                uri: urlImg,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.imageReply}
            />
          )
        )}
      </View>
      {message && (
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => {
            toggleBox();
            clearReply();
          }}>
          <CloseCircle size={appInfo.sizeIconBold} color={colors.icon} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default Replymessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 0.3,
    borderTopColor: 'lightgrey',
    justifyContent: 'space-around',
  },
  messageContainer: {
    paddingEnd: 5,
    width: '78%',
  },
  replyImageContainer: {
    borderRightWidth: 2,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: '80%',
  },
  imageReply: {
    height: 35,
    width: 35,
    resizeMode: 'cover',
  },
});
