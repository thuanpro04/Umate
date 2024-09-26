import {View, Text, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import { globalStyles } from '../../Styles/globalStyle';
interface Props {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
}
const RowComponent = (props: Props) => {
  const {children, styles} = props;
  return (
    <View
      style={[globalStyles.row,{}, styles]}>
      {props.children}
    </View>
  );
};

export default RowComponent;
