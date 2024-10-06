import {SearchNormal} from 'iconsax-react-native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import HeaderComponent from './HeaderComponent';

interface Props {
  onPress?: () => void;
}
const SearchFriendsComponent = (props: Props) => {
  const {onPress} = props;
  return (
    <View style={styles.container}>
      
      <RowComponent onPress={onPress} styles={styles.searchStyles}>
        <SearchNormal
          size={appInfo.sizeIcon}
          color={appColors.grey}
          variant="Broken"
        />
        <TextComponent
          label="Search ..."
          styles={{fontWeight: '400', color: appColors.grey}}
        />
      </RowComponent>
    </View>
  );
};

export default SearchFriendsComponent;
const styles = StyleSheet.create({
  searchStyles: {
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: appColors.grey2,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
