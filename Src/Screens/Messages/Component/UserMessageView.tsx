import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { UserInfo } from '../../Untils/UserInfo';
import { RowComponent, TextComponent } from '../../Components';
import { appColors } from '../../../Theme/Colors/appColors';
import { globalStyles } from '../../../Styles/globalStyle';
interface MessageProps {
    message: string;
    time: any;
    imageURL?: string[];
}
const UserMessageView = React.memo((props: MessageProps) => {
    const {message, time, imageURL} = props;
    const timePresent =UserInfo.getTimePresent(time);
    // Tính chiều rộng hộp tin nhắn, tối thiểu là 30% và tối đa là 80%
    const messageWidth = UserInfo.getMessageWidth(message.length);

    return (
      <View style={[localStyles.userMessageContainer, {alignSelf: 'flex-end'}]}>
        <RowComponent
          styles={[
            localStyles.userMessageBox,
            {width: `${messageWidth}%`}, // Đặt chiều rộng dựa trên độ dài message
          ]}>
          <TextComponent label={message} color={appColors.white} flex={1} />
          <TextComponent
            label={timePresent}
            color={appColors.grey}
            styles={globalStyles.timeText}
          />
        </RowComponent>
      </View>
    );
  });

export default UserMessageView
const localStyles = StyleSheet.create({
    userMessageContainer: {
        marginVertical: 10.5,
        // Căn phải tin nhắn của người dùng
        alignItems: 'flex-end',
      },
      userMessageBox: {
        backgroundColor: appColors.blue, // Màu nền khác cho tin nhắn của người dùng
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        
      },
   
  });