import {View, Text, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '../../Theme/Colors/appColors';
interface Props {
  icon: ReactNode;
  quantity?: any;
  styles?: StyleProp<ViewStyle>;
  status?: boolean;
  onPress?: () => void;
  title?: string;
  bgIcon?: string;
}
const ActionIconComponent = (props: Props) => {
  const {icon, quantity, styles, status, onPress, title, bgIcon} = props;
  return (
    <RowComponent
      styles={[
        {
          backgroundColor: bgIcon ?? appColors.white,
          borderRadius: 10,
        },
        styles,
      ]}>
      <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>
      <TextComponent label={quantity ? quantity : title ? title : ''} />
    </RowComponent>
  );
};

export default ActionIconComponent;
