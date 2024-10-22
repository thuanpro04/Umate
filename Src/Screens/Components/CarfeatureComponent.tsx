import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {ArrowRight2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
interface Props {
  label: string;
  onPress?: () => void;
  icon: ReactNode;
  styles?: StyleProp<ViewStyle>;
  labelColor?: string;
}
const CarfeatureComponent = (props: Props) => {
  const {label, onPress, icon, styles, labelColor} = props;
  return (
    <RowComponent onPress={onPress} styles={[localStyle.carStyles, {}, styles]}>
      <RowComponent>
        {icon && icon}
        <TextComponent
          label={label}
          size={appInfo.sizeTitle}
          color={labelColor ?? '#363B4BC2'}
        />
      </RowComponent>
      <ArrowRight2 size={appInfo.sizeIconBold} color={appColors.black} />
    </RowComponent>
  );
};

export default CarfeatureComponent;
const localStyle = StyleSheet.create({
  carStyles: {
    paddingHorizontal: 12,
    backgroundColor: ' #F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey,
    paddingVertical: 12,
  },
});
