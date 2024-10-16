import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
interface Props {
  image: string;
  name: string;
}
const ChatHeader = (props: Props) => {
  const {image, name} = props;
  return (
    <View>
      <Text>ChatHeader</Text>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({});
