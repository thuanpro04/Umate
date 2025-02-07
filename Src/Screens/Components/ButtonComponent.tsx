import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React, {Children, ReactNode} from 'react';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
interface Props {
  label?: string;
  isBg?: boolean;
  labelColor?: string;
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
  onPress?: (even?: any) => void;
  disabled?: boolean;
  flex?: number;
  textStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
  activeOpacity?: number;
}
const ButtonComponent = (props: Props) => {
  const {
    label,
    labelColor,
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
    children,
    activeOpacity,
  } = props;

  return type === 'action' ? (
    <TouchableOpacity
      onPress={onPress}
      style={styles}
      disabled={disabled}
      activeOpacity={activeOpacity}>
      {iconLeft}
      {iconRight}
      {children}
      {label && (
        <TextComponent label={label} styles={textStyle} color={labelColor} />
      )}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        {
          backgroundColor:
            props.bgColor ?? !disabled ? appColors.blue2 : appColors.coolGray,
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
        <RowComponent styles={{marginVertical: 4}}>
          {iconLeft && iconLeft}
          <TextComponent
            label={label ?? ''}
            color={labelColor ?? appColors.white}
            size={appInfo.size.WIDTH * 0.04}
            font="bold"
            styles={[{paddingVertical: 2, paddingHorizontal: 12}, textStyle]}
          />
          {iconRight && iconRight}
        </RowComponent>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;
