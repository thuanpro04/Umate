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
}
const CarfeatureComponent = (props: Props) => {
  const {label,  onPress, icon, styles} = props;
  return (
    <RowComponent onPress={onPress} styles={[localStyle.carStyles, {}, styles]}>
      <RowComponent>
        {icon && icon}
        <TextComponent
          label={label}
          size={appInfo.sizeTitle}
          color="#363B4BC2"
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
    backgroundColor: appColors.grey2 + '3D',
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey,
    paddingVertical: 12,
  },
});
