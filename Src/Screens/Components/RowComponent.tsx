import {View, Text, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../../Styles/globalStyle';
interface Props {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
const RowComponent = (props: Props) => {
  const {children, styles, onPress} = props;
  return onPress ? (
    <TouchableOpacity
      style={[globalStyles.row, styles]}
      onPress={onPress}
      activeOpacity={0.5}>
      {props.children}
    </TouchableOpacity>
  ) : (
    <View style={[globalStyles.row, {}, styles]}>{props.children}</View>
  );
};

export default RowComponent;
