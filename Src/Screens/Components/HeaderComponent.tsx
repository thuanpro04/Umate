import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import ButtonComponent from './ButtonComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '../../Theme/Colors/appColors';
interface Props {
  title?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onPress1?: () => void;
  onPress2?: () => void;
}
const HeaderComponent = (props: Props) => {
  const {title, iconLeft, iconRight, onPress1,onPress2} = props;
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <RowComponent
      styles={{
        paddingHorizontal: 18,
        borderBottomColor: appColors.grey2,
        borderBottomWidth: 0.2,
      }}>
      <ButtonComponent
        onPress={onPress1 ?? goBack}
        iconLeft={iconLeft}
        type="action"
      />
      <TextComponent
        label={title ?? ''}
        styles={{fontSize: 22, fontWeight: '500', fontStyle: 'italic'}}
      />
      <ButtonComponent onPress={onPress2} iconRight={iconRight} type="action" />
    </RowComponent>
  );
};

export default HeaderComponent;
