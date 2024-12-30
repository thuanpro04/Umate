import React, {ReactNode} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
interface Props {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
  isScroll?: boolean;
  isbg?: boolean;
}
const ContainerComponent = (props: Props) => {
  const {children, styles, isScroll, isbg} = props;
  return isScroll ? (
    <ScrollView style={[globalStyles.container,{}, styles]}>{children}</ScrollView>
  ) : isbg ? (
    <ImageBackground
      style={[globalStyles.container, {}, styles]}
      source={require('../../assets/images/digital-art-isolated-house.jpg')}>
      {children}
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container, styles]}>{children}</SafeAreaView>
  );
};

export default ContainerComponent;
