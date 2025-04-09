import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {UserInfo} from '../../Untils/UserInfo';
import {TextComponent} from '../../Components';
interface Props {
  content: string;
  currentUserId: string;
  senderId: string;
  color: string;
}
const ReplyComponent = (props: Props) => {
  const {content, currentUserId, senderId, color} = props;
  return (
    <View
      style={[
        styles.replyStyles,
        {
          borderLeftColor: senderId === currentUserId ? '#2196f3' : 'green',
        },
      ]}>
      <TextComponent
        styles={{fontSize: 14}}
        color={color}
        label={UserInfo.getContent(content)}
      />
    </View>
  );
};

export default ReplyComponent;
const styles = StyleSheet.create({
  replyStyles: {
    borderRadius: 12,
    maxWidth: 275,
    marginHorizontal: 8,

    backgroundColor: 'rgba(0,0,0,0.06)',
    borderLeftWidth: 3,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
