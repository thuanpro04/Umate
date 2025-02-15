import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import RowComponent from './RowComponent';
interface Props {
  label: string;
  size?: number;
  color?: string;
  font?: 'bold' | 'regular' | 'semibold' | 'medium';
  title?: boolean;
  styles?: StyleProp<TextStyle>;
  flex?: number;
  numberOfLine?: number;

}
const TextComponent = (props: Props) => {
  const {label, size, color, font, title, styles, flex, numberOfLine} = props;

  return (
    <Text
      style={[
        {
          fontSize: title
            ? size ?? appInfo.sizeTitle
            : size ?? appInfo.sizeText,
          color: props.color ?? appColors.black,
          flex: flex ?? 0,
          fontWeight: title ? font ?? 'bold' : 'regular',
        },
        styles,
      ]}
      
      numberOfLines={numberOfLine}>
      {props.label}
    </Text>
  );
};

export default TextComponent;
