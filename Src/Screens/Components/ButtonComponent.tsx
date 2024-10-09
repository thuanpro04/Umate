import {View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle} from 'react-native';
import React, {Children, ReactNode} from 'react';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
interface Props {
  lable?: string;
  isBg?: boolean;
  lableColor?: string;
  bgColor?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  justify?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-between'
    | 'space-evenly'
    | 'space-around';
  styles?: StyleProp<ViewStyle>;
  type?: 'primary' | 'link' | 'none' | 'action';
  onPress?: (even?:any) => void;
  disabled?: boolean;
  flex?: number;
  textStyle?:StyleProp<TextStyle>
  children?:ReactNode
}
const ButtonComponent = (props: Props) => {
  const {
    lable,
    lableColor,
    isBg,
    iconLeft,
    iconRight,
    bgColor,
    justify,
    styles,
    type,
    onPress,
    disabled,
    flex,
    textStyle,
    children
  } = props;
  return type === 'action' ? (
    <TouchableOpacity onPress={onPress} style={styles}>
      {iconLeft}
      {iconRight}
      {children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        {
          backgroundColor: props.bgColor ?? appColors.pink,
          borderRadius: 12,
        },
        styles,
      ]}>
      <TouchableOpacity
        style={[
          {
            flex: flex ?? 0,
            alignItems: 'center',
            justifyContent: 'center',

          },
        ]}
        disabled={disabled}
        onPress={onPress}>
        <RowComponent styles={{}}>
          {iconLeft && iconLeft}
          <TextComponent
            label={lable ?? ''}
            color={lableColor}
            size={appInfo.size.WIDTH * 0.04}
            font="bold"
            styles={[textStyle]}
          />
          {iconRight && iconRight}
        </RowComponent>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;
