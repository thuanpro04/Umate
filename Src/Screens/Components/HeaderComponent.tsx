import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import ButtonComponent from './ButtonComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import { StyleProp, ViewStyle } from 'react-native';
interface Props {
  title?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onPress1?: () => void;
  onPress2?: () => void;
  isBcolor?: boolean;
  styles?:StyleProp<ViewStyle>
}
const HeaderComponent = (props: Props) => {
  const {title, iconLeft, iconRight, onPress1, onPress2, isBcolor, styles} = props;
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <RowComponent
      styles={[{
        paddingHorizontal: 18,
        borderBottomColor: isBcolor ? appColors.grey2 : 'tranparent',
        borderBottomWidth: isBcolor ? 0.2 : 0,
        paddingVertical:13
      }, styles]}>
      <ButtonComponent
        onPress={onPress1 ?? goBack}
        iconLeft={iconLeft}
        type="action"
      />
      <TextComponent
        label={title ?? ''}
        styles={{
          fontSize: appInfo.sizeTitle,
          fontWeight: '500',
          fontStyle: 'italic',
        }}
      />
      <ButtonComponent onPress={onPress2} iconRight={iconRight} type="action" />
    </RowComponent>
  );
};

export default HeaderComponent;
