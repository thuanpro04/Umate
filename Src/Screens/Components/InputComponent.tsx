import {
  View,
  Text,
  KeyboardType,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import RowComponent from './RowComponent';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placehold?: string;
  subffix?: ReactNode;
  isPass?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
const InputComponent = (props: Props) => {
  const {
    value,
    affix,
    subffix,
    allowClear,
    multiline,
    numberOfLines,
    onChange,
    onEnd,
    type,
    styles,
    placehold,
    isPass,
    onPress,
  } = props;
  const [isShowPass, setIsShowPass] = useState(isPass ?? false);
  const [isFocus, setIsFocus] = useState(false);
  return (
    <RowComponent styles={[style.searchStyles, {paddingVertical: 0}, styles]}>
      {affix && affix}
      <TextInput
        placeholder={placehold}
        value={value}
        onEndEditing={() => {
          setIsFocus(false);
          onEnd && onEnd();
        }}
        onFocus={() => setIsFocus(true)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={isShowPass}
        onChangeText={(element): any => onChange(element)}
        keyboardType={type ?? 'default'}
        autoCapitalize="none"
        maxLength={numberOfLines ? 280 : 150}
        style={{flex: 1, color: appColors.black, paddingVertical: 8}}
        placeholderTextColor={appColors.black}
      />
      <TouchableOpacity onPress={() => onChange('')}>
        {value && value.length > 0 && props.allowClear && (
          <AntDesign
            name="close"
            size={appInfo.sizeIcon-5}
            color={appColors.black}
          />
        )}
      </TouchableOpacity>
      {subffix && subffix}
    </RowComponent>
  );
};

export default InputComponent;
const style = StyleSheet.create({
  searchStyles: {
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: appColors.grey2,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#eeeeeeAD',
    alignItems: 'center',
  },
});
