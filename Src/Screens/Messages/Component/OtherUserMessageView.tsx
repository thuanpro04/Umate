import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../../../Styles/globalStyle';
import { RowComponent, TextComponent } from '../../Components';
import { UserInfo } from '../../Untils/UserInfo';
import { appColors } from '../../../Theme/Colors/appColors';
import { StyleSheet } from 'react-native';
interface MessageProps {
    message: string;
    time: any;
    imageURL?: string[];
  }
const OtherUserMessageView = React.memo((props: MessageProps) => {
    const {message, time, imageURL} = props;
    const timePresent =UserInfo.getTimePresent(time);
    const messageWidth = UserInfo.getMessageWidth(message.length);

    return (
      <View style={localStyles.otherUserMessageContainer}>
        <RowComponent
          styles={[
            localStyles.otherUserMessageBox,
            {width: `${messageWidth}%`},
          ]}>
          <TextComponent label={message} color={appColors.black} flex={1} />
          <TextComponent
            label={timePresent}
            color={appColors.grey}
            styles={globalStyles.timeText}
          />
        </RowComponent>
      </View>
    );
  });

export default OtherUserMessageView
const localStyles = StyleSheet.create({
    otherUserMessageContainer: {
        marginVertical: 10.5,
        alignItems: 'flex-start', // Căn trái tin nhắn của người khác
      },
      otherUserMessageBox: {
        backgroundColor: appColors.focus, // Màu nền khác cho tin nhắn của người khác
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
      },
    
   
  });