import React from 'react';
import {Image, StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {RowComponent, SearchFriendsComponent} from '../Components';
import TabViewFriend from '../Navigators/TabViewFriend';
import FastImage from 'react-native-fast-image';

const MyFriendScreen = ({navigation}: any) => {
  const user = useSelector(profileSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        marginTop: StatusBar.currentHeight,
      }}>
      <RowComponent styles={{paddingHorizontal: 12, paddingVertical: 6}}>
        <RowComponent onPress={() => navigation.openDrawer()}>
          <FastImage
            source={{
              uri: user.avatar,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={globalStyles.avatar}
          />
        </RowComponent>
        <SearchFriendsComponent
          onPress={() => navigation.navigate('Search', {key: 'searchFriends'})}
        />
      </RowComponent>
      <View style={{flex: 1}}>
        {/* <TabTopNavigator/> */}
        <TabViewFriend />
      </View>
    </View>
  );
};

export default MyFriendScreen;
