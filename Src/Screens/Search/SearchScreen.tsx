import {ArrowLeft2, SearchNormal} from 'iconsax-react-native';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ActionIconComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
} from '../Components';
import {useNavigation} from '@react-navigation/native';

const SearchScreen = () => {
  const [value, setValue] = useState('');
  const navigation = useNavigation();
  return (
    <ContainerComponent isScroll styles={styles.container}>
      <RowComponent styles={{gap: 20}}>
        <ActionIconComponent
          onPress={() => navigation.goBack()}
          icon={
            <ArrowLeft2
              size={appInfo.sizeIconBold + 10}
              color={appColors.black}
            />
          }
          styles={{flex: 1}}
        />
        <InputComponent
          styles={{}}
          type="default"
          placehold="Search ..."
          value={value}
          onChange={text => setValue(text)}
          allowClear
          subffix={
            <SearchNormal
              size={appInfo.sizeIcon}
              color={appColors.blue}
              variant="Broken"
            />
          }
          multiline
          numberOfLines={2}
        />
      </RowComponent>
    </ContainerComponent>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
