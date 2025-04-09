import {View, Text} from 'react-native';
import React from 'react';
import {TextComponent} from '../../Components';
import {UserInfo} from '../../Untils/UserInfo';
interface Props {
  timestamp: any;
  color?: string;
}
const ShowTimeMessage = (props: Props) => {
  const {timestamp,color} = props;
  return (
    <View style={{alignSelf: 'center'}}>
      <TextComponent
        label={UserInfo.getTimePresent(timestamp)}
        color={color}
        size={8}
      />
    </View>
  );
};

export default ShowTimeMessage;
