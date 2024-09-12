import {View, Text} from 'react-native';
import React from 'react';
interface Props {
  width?: number;
  height?: number;
  isCrossBar?: boolean;
  bgCrossBar?: string;
}
const SpaceComponent = (props: Props) => {
  const {width, height, isCrossBar, bgCrossBar} = props;
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: isCrossBar && bgCrossBar ? bgCrossBar : '',
        
      }}
    />
  );
};

export default SpaceComponent;
