import {View, Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
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
  onPress?: () => void;
  disabled?: boolean;
  flex?: number;
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
  } = props;
  return type === 'action' ? (
    <TouchableOpacity onPress={onPress} style={styles}>
      {iconLeft}
      {iconRight}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        {
          backgroundColor: props.bgColor ?? appColors.pink,
          width: '80%',
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
            paddingVertical: 8,
          },
        ]}
        disabled={disabled}
        onPress={onPress}>
        <RowComponent styles={{}}>
          {iconLeft && iconLeft}
          <TextComponent
            label={lable ?? ''}
            color={lableColor}
            size={appInfo.size.WIDTH * 0.05}
            font="bold"
            styles={{fontWeight: '500', lineHeight: 23.87}}
          />
          {iconRight && iconRight}
        </RowComponent>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;
