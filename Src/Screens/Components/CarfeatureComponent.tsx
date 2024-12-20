import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import React, {ReactNode} from 'react';
import {ArrowRight2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import {globalStyles} from '../../Styles/globalStyle';
interface Props {
  label: string;
  onPress?: () => void;
  icon: ReactNode;
  styles?: StyleProp<ViewStyle>;
  labelColor?: string;
  isBottomColor?: boolean;
  isArrow?: boolean;
}
const CarfeatureComponent = (props: Props) => {
  const {label, onPress, icon, styles, labelColor, isBottomColor, isArrow} =
    props;
  return (
    <RowComponent
      onPress={onPress}
      styles={[
        localStyle.carStyles,
        {borderBottomColor: isBottomColor ? appColors.grey : 'transparent'},
        styles,
      ]}>
      <RowComponent>
        {icon && icon}
        <TextComponent
          label={label}
          size={appInfo.sizeTitle}
          color={labelColor ?? '#363B4BC2'}
        />
      </RowComponent>
      {isArrow && (
        <ArrowRight2 size={appInfo.sizeIconBold} color={appColors.black} />
      )}
    </RowComponent>
  );
};

export default CarfeatureComponent;
const localStyle = StyleSheet.create({
  carStyles: {
    paddingHorizontal: 12,
    backgroundColor: ' #F8F9FA',
    borderBottomWidth: 1,

    paddingVertical: 12,
  },
});
