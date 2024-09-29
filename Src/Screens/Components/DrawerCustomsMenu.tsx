import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
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

const DrawerCustomsMenu = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const disPathch = useDispatch();
  const user = useSelector(authSelector);
  const getName = (fullName: string) => {
    const name = fullName.split(' ');
    const splitName = name[0] + ' ' + name[1];
    return splitName;
  };
  const handleSignOutWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      disPathch(removeAuth());
      await AsyncStorage.removeItem('auth');
    } catch (error) {
      console.log('Sign out', error);
    }
  };
  const handleShowItemMenu = async (key: string) => {
    setIsLoading(true);
    switch (key) {
      case 'profile':
        navigation.closeDrawer();
        navigation.navigate('Profile', {
          screen: 'profile',
        });
        break;

      case 'message':
        navigation.closeDrawer();
        navigation.navigate('Message', {
          screen: 'message',
        });
        break;
      case 'settings':
        navigation.closeDrawer();
        navigation.navigate('Setting', {
          screen: 'settings',
        });
        break;
      case 'contactUs':
        navigation.closeDrawer();
        navigation.navigate('ContactUs', {
          screen: 'contactUs',
        });
        break;

      case 'signOut':
        await handleSignOutWithGoogle();
        break;
    }
    setIsLoading(false);
  };
  return (
    <View style={localStyle.container}>
      <StatusBar backgroundColor={appColors.background} />
      <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('Profile', {
            screen: 'profile',
          });
        }}>
        {user.avatar ? (
          <Image source={{uri: user.avatar}} style={globalStyles.avatar} />
        ) : (
          <Image
            source={require('../../assets/images/User-Icon.jpg')}
            style={globalStyles.avatar}
          />
        )}
        <TextComponent label={getName(user.name ?? ' ')} title size={28} />
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={MenuItems}
        style={{flex: 1, marginVertical: 20}}
        keyExtractor={item => item.key}
        renderItem={({item, index}) => (
          <RowComponent
            styles={[localStyle.listItem]}
            key={index}
            onPress={() => handleShowItemMenu(item.key)}>
            {item.icon}
            <TextComponent
              label={item.title}
              styles={localStyle.listItemText}
            />
          </RowComponent>
        )}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default DrawerCustomsMenu;
const localStyle = StyleSheet.create({
  container: {
    padding: 18,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    flex: 1,
    backgroundColor: appColors.background,
  },
  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  listItemText: {
    paddingLeft: 12,
  },
});
