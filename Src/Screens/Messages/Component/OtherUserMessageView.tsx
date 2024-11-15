import {View, Text, Animated} from 'react-native';
import React, {useRef, useState} from 'react';
import {globalStyles} from '../../../Styles/globalStyle';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {UserInfo} from '../../Untils/UserInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {StyleSheet} from 'react-native';
import {PanResponder} from 'react-native';
import {ArrowCircleRight, Send2} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
interface MessageProps {
  message: string;
  time: any;
  imageURL?: string[];
  timeIndex: number;
  senderName?: string;
}
const OtherUserMessageView = React.memo((props: MessageProps) => {
  const {message, time, imageURL, timeIndex, senderName} = props;

  const [showTime, setShowTime] = useState<any[]>([]);
  const timePresent = UserInfo.getTimePresent(time);
  const messageWidth = UserInfo.getMessageWidth(message.length);
  const [swipeValue, setswipeValue] = useState(0);
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove(e, gestureState) {
      const {dx} = gestureState;
      if (dx > 0) {
        setswipeValue(dx);
        swipeAnim.setValue(Math.abs(dx));
      }
    },
    onPanResponderRelease: () => {
      if (swipeValue > 20) {
      } else {
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
      setswipeValue(0);
      swipeAnim.setValue(0);
    },
  });

  const onChangeShowTime = (key: any) => {
    setShowTime(prev => ({...prev, [key]: !showTime[key]}));
  };
  return (
    <Animated.View
      style={[
        localStyles.otherUserMessageContainer,
        {transform: [{translateX: swipeAnim}]},
      ]}
      {...panResponder.panHandlers}>
      {swipeValue > 10 && (
        <View style={localStyles.iconContainer}>
          <Send2 size={appInfo.sizeIcon} color={appColors.blueBack} />
        </View>
      )}

      <RowComponent
        onPress={() => onChangeShowTime(timeIndex)}
        styles={[localStyles.otherUserMessageBox, {width: `${messageWidth}%`}]}>
        <TextComponent label={message} color={appColors.black} flex={1} />
      </RowComponent>
      {showTime[timeIndex] && (
        <RowComponent styles={senderName && {left: -50, marginTop: 34}}>
          {senderName && (
            <TextComponent
              label={senderName}
              size={10}
              color={appColors.grey}
              styles={[
                {
                  fontStyle: 'italic',
                },
              ]}
            />
          )}
          <TextComponent
            label={timePresent}
            color={appColors.grey}
            styles={[
              globalStyles.timeText,
              !senderName ? {paddingTop: 32, left: -30} : {},
            ]}
          />
        </RowComponent>
      )}
    </Animated.View>
  );
});

export default OtherUserMessageView;
const localStyles = StyleSheet.create({
  otherUserMessageContainer: {
    marginVertical: 6.5,
    alignItems: 'flex-start', // Căn trái tin nhắn của người khác
    flexDirection: 'row',
  },
  otherUserMessageBox: {
    backgroundColor: appColors.focus, // Màu nền khác cho tin nhắn của người khác
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconContainer: {
    marginVertical: 5,
  },
});
