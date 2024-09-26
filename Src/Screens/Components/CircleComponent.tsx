import {View, Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import { appColors } from '../../Theme/Colors/appColors';

interface Props {
  size?: number;
  children: ReactNode;
  color?: string;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
}
const CircleComponent = (props: Props) => {
  const {size, children, color, onPress, styles} = props;
  const localStyle : any= {
    width: size ?? 40,
    height: size ?? 40,
    backgroundColor: color ?? appColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  };
  return onPress ? (
    <TouchableOpacity onPress={onPress} style={[localStyle, styles]}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={[localStyle, styles]}>{children}</View>
  );
};

export default CircleComponent;
