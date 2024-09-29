import React from 'react';
import {Image, StatusBar, View} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {
  RowComponent,
  SearchFriendsComponent,
  SpaceComponent,
} from '../Components';
import TabTopNavigator from '../Navigators/TabTopNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../Styles/globalStyle';

const MyFriendScreen = ({navigation}: any) => {
  const user = useSelector(authSelector);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appColors.white,
        marginTop: StatusBar.currentHeight,
      }}>
      <RowComponent styles={{paddingHorizontal: 12}}>
        <Image source={{uri: user.avatar}} style={globalStyles.avatar} />
        <SearchFriendsComponent onPress={() => navigation.navigate('Search')} />
      </RowComponent>
      <View style={{flex: 1}}>
        <TabTopNavigator />
      </View>
    </View>
  );
};

export default MyFriendScreen;
