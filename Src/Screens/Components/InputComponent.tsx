import {
  View,
  Text,
  KeyboardType,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import RowComponent from './RowComponent';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import ButtonComponent from './ButtonComponent';
interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placehold?: string;
  placeholdColor?: string;
  subffix?: ReactNode;
  isPass?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
  isFocused?: boolean;
  onPressFilter?: () => void;
  inputRef?: any;
  onFocus?: () => void;
  onBlur?: () => void;
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
    isFocused,
    onPressFilter,
    inputRef,
    onFocus,
    onBlur,
    placeholdColor,
  } = props;

  const [isShowPass, setIsShowPass] = useState(isPass ?? false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <RowComponent styles={[style.searchStyles, {paddingVertical: 0}, styles]}>
        {affix && affix}
        <TextInput
          ref={inputRef}
          placeholder={placehold}
          value={value}
          onEndEditing={() => {
            onEnd && onEnd();
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          blurOnSubmit={false}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={isShowPass}
          onChangeText={(element): any => onChange(element)}
          keyboardType={type ?? 'default'}
          autoCapitalize="none"
          style={{flex: 1, color: appColors.black, paddingVertical: 8}}
          placeholderTextColor={placeholdColor ?? appColors.grey}
        />
        <TouchableOpacity onPress={() => onChange('')}>
          {value && value.length > 0 && props.allowClear && (
            <AntDesign
              name="close"
              size={appInfo.sizeIcon - 5}
              color={appColors.black}
            />
          )}
        </TouchableOpacity>
        {subffix && (
          <ButtonComponent
            iconRight={subffix}
            type="action"
            onPress={onPressFilter}
          />
        )}
      </RowComponent>
    </TouchableWithoutFeedback>
  );
};

export default InputComponent;
const style = StyleSheet.create({
  searchStyles: {
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: appColors.grey2,
    width: '90%',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
});
