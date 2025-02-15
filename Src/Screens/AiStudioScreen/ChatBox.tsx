import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {TextComponent} from '../Components';
import {globalStyles} from '../../Styles/globalStyle';
import {FlatList} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
interface Props {
  messbox: any[];
}
const ChatBox = (props: Props) => {
  const {messbox} = props;
  const isUser = true;

  const renderItems = ({item, index}: any) => {
    return (
      <View style={{flex: 1}}>
        {item.content && (
          <View
            style={[
              styles.container,
              {
                backgroundColor: item.isUser ? '#C8E6C9' : '#37474F',
                alignSelf: item.isUser ? 'flex-end' : 'flex-start',
                borderBottomLeftRadius: item.isUser ? 20 : 0,
                borderBottomRightRadius: item.isUser ? 20 : 0,
              },
            ]}>
            <TextComponent
              label={item.content}
              styles={[
                styles.contentStyles,
                {color: item.isUser ? appColors.blueBack : appColors.white},
              ]}
            />
          </View>
        )}
      </View>
    );
  };
  return (
    <FlatList
      style={{flex: 1}}
      data={messbox}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItems}
    />
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  container: {
    maxWidth: 275,
    marginVertical: 8,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 6,
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },
  contentStyles: {
    fontSize: 14,
  },
});
