import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../Styles/globalStyle';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, removeAuth} from '../../redux/reducers/authReducer';
import TextComponent from './TextComponent';
import {appColors} from '../../Theme/Colors/appColors';
import {MenuItems} from '../../data/MenuItems';
import RowComponent from './RowComponent';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../Modal/LoadingModal';
import {UserInfo} from '../Untils/UserInfo';

const DrawerCustomMenuMessages = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleShowItemMenu = async (key: string) => {
    switch (key) {
      case 'MemberGroup':
        navigation.closeDrawer();
        navigation.navigate('MemberGroup', {
          screen: 'MemberGroup',
        });
        break;

      case 'Library':
        navigation.closeDrawer();
        navigation.navigate('Library', {
          screen: 'Library',
        });
        break;
    }
    setIsLoading(false);
  };
  return (
    <View style={localStyle.container}>
      <StatusBar backgroundColor={appColors.background} />
      <TextComponent label="Thuan Phan" />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default DrawerCustomMenuMessages;
const localStyle = StyleSheet.create({
  container: {
    padding: 18,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  listItemText: {
    paddingLeft: 12,
  },
});
