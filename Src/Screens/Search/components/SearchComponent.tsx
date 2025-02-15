import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../../../Theme/Colors/appColors';
import {RowComponent} from '../../Components';
import {CloseCircle, SearchFavorite} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
interface Props {
  onChangeText: (e: string) => void;
  text: string;
}
const SearchComponent = (props: Props) => {
  const {onChangeText, text} = props;

  return (
    <RowComponent styles={styles.container}>
      <TextInput
        value={text}
        onChangeText={e => onChangeText(e)}
        style={styles.input}
        placeholder="search ..."
        multiline
        maxLength={50}
        placeholderTextColor={appColors.blueBack}
      />
      {text.length > 0 && (
        <CloseCircle
          size={appInfo.sizeIconBold}
          color={appColors.blue}
          style={styles.iconClose}
          onPress={() => {
            Keyboard.dismiss();
            onChangeText('');
          }}
        />
      )}
      <SearchFavorite
        size={appInfo.sizeIconBold}
        color={appColors.blue}
        style={styles.iconSearch}
      />
    </RowComponent>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  container: {flex: 1},
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderColor: appColors.grey,
    flex: 1,
    color: appColors.blueBack,
  },
  iconSearch: {},
  iconClose: {
    position: 'absolute',
    right: 50,
  },
});
