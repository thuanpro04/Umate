import {View, Text} from 'react-native';
import React from 'react';
import {appColors} from '../../Theme/Colors/appColors';
interface Props {
  width?: any;
  height?: number;
  isCrossBar?: boolean;
  bgCrossBar?: string;
}
const SpaceComponent = (props: Props) => {
  const {width, height, bgCrossBar, isCrossBar} = props;
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: isCrossBar ? bgCrossBar ?? appColors.grey2 : '',
        borderWidth: isCrossBar ? 0.01 : 0,
      }}
    />
  );
};

export default SpaceComponent;
