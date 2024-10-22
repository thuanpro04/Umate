import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import ButtonComponent from './ButtonComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {globalStyles} from '../../Styles/globalStyle';
import SpaceComponent from './SpaceComponent';
interface Props {
  title?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onPress1?: () => void;
  onPress2?: () => void;
  isBcolor?: boolean;
  styles?: StyleProp<ViewStyle>;
  image?: string;
  iconStyle?: boolean;
}
const HeaderComponent = (props: Props) => {
  const {
    title,
    iconLeft,
    iconRight,
    onPress1,
    onPress2,
    isBcolor,
    styles,
    image,
    iconStyle,
  } = props;
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <RowComponent
      styles={[
        {
          paddingHorizontal: image ? 0 : 16,
          borderBottomColor: isBcolor ? appColors.grey2 : 'tranparent',
          borderBottomWidth: isBcolor ? 0.2 : 0,
          paddingVertical: image ? 4 : 13,
        },
        styles,
      ]}>
      <RowComponent>
        <ButtonComponent
          onPress={onPress1 ?? goBack}
          iconLeft={iconLeft}
          type="action"
          styles={iconStyle && localStyles.iconStyles}
        />
        <SpaceComponent width={5} />
        {image && (
          <>
            <Image source={{uri: image}} style={localStyles.image} />
            <TextComponent
              label={title ?? ''}
              styles={{
                fontSize: appInfo.sizeTitle,
                fontWeight: '500',
                fontStyle: 'italic',
              }}
            />
          </>
        )}
      </RowComponent>
      {!image && (
        <TextComponent
          label={title ?? ''}
          styles={{
            fontSize: appInfo.sizeTitle,
            fontWeight: '500',
            fontStyle: 'italic',
          }}
        />
      )}
      <ButtonComponent
        onPress={onPress2}
        iconRight={iconRight}
        type="action"
        styles={iconStyle && localStyles.iconStyles}
      />
    </RowComponent>
  );
};
const localStyles = StyleSheet.create({
  image: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: appColors.grey2,
  },
  iconStyles: {
    borderWidth: 0.1,
    borderRadius: 4,
    padding: 4,
  },
});
export default HeaderComponent;
