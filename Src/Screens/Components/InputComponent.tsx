import React, {ReactNode, useState} from 'react';
import {
  Keyboard,
  KeyboardType,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {themeSelector} from '../../redux/reducers/themeSlice';
import ButtonComponent from './ButtonComponent';
import RowComponent from './RowComponent';
interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placehold?: string;
  placeholdColor?: string;
  subffix?: ReactNode;

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
    onPress,
    isFocused,
    onPressFilter,
    inputRef,
    onFocus,
    onBlur,
    placeholdColor,
  } = props;

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
