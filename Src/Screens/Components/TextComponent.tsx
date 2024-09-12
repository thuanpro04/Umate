import {View, Text, StyleProp, TextStyle} from 'react-native';
import React from 'react';
import RowComponent from './RowComponent';
import { appColors } from '../../Theme/Colors/appColors';
interface Props {
  label: string;
  label2?: string;
  size?: number;
  color?: string;
  font?: 'bold' | 'regular' | 'semibold' | 'medium';
  title?: boolean;
  styles?: StyleProp<TextStyle>;
  flex?: number;
  numberOfLine?: number;
}
const TextComponent = (props: Props) => {
  const {label, size, color, font, title, styles, flex, numberOfLine, label2} =
    props;
  return label && label2 ? (
    <RowComponent >
      <Text
      style={[
        {
          fontSize: title ? size ?? 26 : size ?? 18,
          color: props.color ?? appColors.white,
          flex: flex ?? 0,
          fontWeight: title ? font ?? 'bold' : 'regular',
        },
        props.styles,
      ]}
      numberOfLines={numberOfLine}>
      {props.label}
    </Text>
    <Text
      style={[
        {
          fontSize: title ? size ?? 26 : size ?? 18,
          color: props.color ?? appColors.blue,
          flex: flex ?? 0,
          fontWeight: title ? font ?? 'bold' : 'regular',
        },
        props.styles,
      ]}
      numberOfLines={numberOfLine}>
      {props.label2}
    </Text>
    </RowComponent>
  ) : (
    <Text
      style={[
        {
          fontSize: title ? size ?? 26 : size ?? 18,
          color: props.color ?? appColors.black,
          flex: flex ?? 0,
          fontWeight: title ? font ?? 'bold' : 'regular',
        },
        props.styles,
      ]}
      numberOfLines={numberOfLine}>
      {props.label}
    </Text>
  );
};

export default TextComponent;
