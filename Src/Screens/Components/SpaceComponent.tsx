import {View, Text} from 'react-native';
import React from 'react';
interface Props {
  width?: any;
  height?: number;

  bgCrossBar?: string;
}
const SpaceComponent = (props: Props) => {
  const {width, height, bgCrossBar} = props;
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: bgCrossBar,
        borderWidth: bgCrossBar ? 1 : 0,
      }}
    />
  );
};

export default SpaceComponent;
