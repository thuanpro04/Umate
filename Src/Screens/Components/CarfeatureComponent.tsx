import { ArrowRight2 } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { useSelector } from 'react-redux';
import { themeSelector } from '../../redux/reducers/themeSlice';
import { appInfo } from '../../Theme/appInfo';
import { appColors } from '../../Theme/Colors/appColors';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
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
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  return (
    <RowComponent
      onPress={onPress}
      styles={[
        localStyle.carStyles,
        {
          borderBottomColor: isBottomColor ? appColors.grey : 'transparent',
          
        },
        styles,
      ]}>
      <RowComponent>
        {icon && icon}
        <TextComponent
          label={label}
          size={appInfo.sizeTitle}
          color={labelColor ?? colors.text}
        />
      </RowComponent>
      {isArrow && (
        <ArrowRight2 size={appInfo.sizeIconBold} color={colors.icon} />
      )}
    </RowComponent>
  );
};

export default CarfeatureComponent;
const localStyle = StyleSheet.create({
  carStyles: {
    paddingHorizontal: 12,

    borderBottomWidth: 1,

    paddingVertical: 12,
  },
});
