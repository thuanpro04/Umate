import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import RowComponent from './RowComponent';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {themeSelector} from '../../redux/reducers/themeSlice';
interface Props {
  label: string;
  size?: number;
  color?: string;
  font?: 'bold' | 'regular' | 'semibold' | 'medium';
  title?: boolean;
  styles?: StyleProp<TextStyle>;
  flex?: number;
  numberOfLine?: number;
  handleTextLayout?: (e: any) => void;
}
const TextComponent = (props: Props) => {
  const {
    label,
    size,
    color,
    font,
    title,
    styles,
    flex,
    numberOfLine,
    handleTextLayout,
  } = props;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  return (
    <Text
      onTextLayout={handleTextLayout}
      style={[
        {
          fontSize: title
            ? size ?? appInfo.sizeTitle
            : size ?? appInfo.sizeText,
          color: props.color
            ? props.color
            : theme
            ? colors.text
            : appColors.black,
          flex: flex ?? 0,
          fontWeight: title ? font ?? '500' : 'regular',
        },
        styles,
      ]}
      numberOfLines={numberOfLine}>
      {props.label}
    </Text>
  );
};

export default TextComponent;
