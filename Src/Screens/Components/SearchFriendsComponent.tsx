import {SearchNormal} from 'iconsax-react-native';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import HeaderComponent from './HeaderComponent';
import {globalStyles} from '../../Styles/globalStyle';

interface Props {
  onPress?: () => void;
  placeHold?: string;
  styles?: StyleProp<ViewStyle>;
}
const SearchFriendsComponent = (props: Props) => {
  const {onPress, placeHold, styles} = props;
  return (
    <View style={[localStyles.container, styles]}>
      <RowComponent onPress={onPress} styles={globalStyles.searchStyles}>
        <SearchNormal
          size={appInfo.sizeIcon}
          color={appColors.grey}
          variant="Broken"
        />
        <TextComponent
          label={placeHold ?? 'Search ...'}
          styles={{fontWeight: '400', color: appColors.grey}}
        />
      </RowComponent>
    </View>
  );
};

export default SearchFriendsComponent;
const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
