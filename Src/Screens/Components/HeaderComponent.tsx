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
  iconQR?: ReactNode;

  onPress1?: () => void;
  onPress2?: () => void;
  isBcolor?: boolean;
  styles?: StyleProp<ViewStyle>;
  image?: string;
  iconStyle?: boolean;
  titleColor?: string;
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
    iconQR,
    titleColor,
  } = props;
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <RowComponent
      styles={[
        {
          paddingHorizontal: image ? 8 : 16,
          borderBottomColor: isBcolor ? appColors.grey2 : 'tranparent',
          borderBottomWidth: isBcolor ? 0.2 : 0,
          paddingVertical: image ? 4 : 13,
          gap: 0,
        },
        styles,
      ]}>
      <RowComponent styles={{paddingVertical: 6}}>
        <ButtonComponent
          onPress={onPress1 ?? goBack}
          iconLeft={iconLeft}
          type="action"
          styles={iconStyle && localStyles.iconStyles}
        />

        {image && (
          <>
            {image && <Image source={{uri: image}} style={localStyles.image} />}
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
          color={titleColor}
        />
      )}
      <RowComponent>
        <ButtonComponent
          onPress={onPress2}
          iconRight={iconQR}
          type="action"
          styles={iconStyle && localStyles.iconStyles}
        />
        <SpaceComponent width={10} />
        <ButtonComponent
          onPress={onPress2}
          iconRight={iconRight}
          type="action"
          styles={iconStyle && localStyles.iconStyles}
        />
      </RowComponent>
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
    borderRadius: 2,
    padding: 4,
    borderColor: appColors.blue,
  },
});
export default HeaderComponent;
