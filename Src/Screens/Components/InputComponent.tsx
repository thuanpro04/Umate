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
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
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

  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <RowComponent
        styles={[
          style.searchStyles,
          {
            paddingVertical: 0,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
          styles,
        ]}>
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
          style={{
            flex: 1,
            color: colors.text,
            paddingVertical: 8,
            backgroundColor: colors.background,
          }}
          placeholderTextColor={placeholdColor ?? appColors.grey}
        />
        <TouchableOpacity onPress={() => onChange('')}>
          {value && value.length > 0 && props.allowClear && (
            <AntDesign
              name="close"
              size={appInfo.sizeIcon - 5}
              color={colors.icon}
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
    width: '90%',
    borderRadius: 12,
    alignItems: 'center',
  },
});
