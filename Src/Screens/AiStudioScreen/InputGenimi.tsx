import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appInfo } from '../../Theme/appInfo';
import { appColors } from '../../Theme/Colors/appColors';
interface Props {
  onPress: () => void;
  isDisable: boolean;
  onChangeValue: (value: string) => void;
  value:string
}
const InputGenimi = (props: Props) => {
  const {onPress, isDisable, onChangeValue,value} = props;
 
  return (
    <View style={styles.inputContainer}>
      {/* <ButtonImagePicker
        icon={
          <MaterialCommunityIcons
            name="image-multiple-outline"
            size={appInfo.sizeIcon}
            color={appColors.blue}
          />
        }
        multiple
        onSelect={val => {
          // val.type === 'url'
          //   ? handleSendMessageAndImage(val.value.toString().trim())
          //   : handleSelected(val.value as ImageOrVideo);
        }}
      /> */}
      <TextInput
        style={styles.inputStyles}
        value={value}
        onChangeText={onChangeValue}
        placeholder="Hỏi Genimi ..."
        placeholderTextColor={'grey'}
        multiline
      />
      <TouchableOpacity onPress={onPress} disabled={isDisable}>
        {isDisable ? (
          <Ionicons
            name="rocket-outline"
            size={appInfo.sizeIcon}
            color={appColors.blue}
          />
        ) : (
          <Ionicons
            name="rocket"
            size={appInfo.sizeIcon}
            color={appColors.blue}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InputGenimi;

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: '#dcdcdc',
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    borderRadius: 20,
  },
  inputStyles: {
    borderBottomColor: 'grey',
    flex: 1,
    color:appColors.white
  },
});
