import {useNavigation} from '@react-navigation/native';
import {SearchNormal} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';

import {
  CarfeatureComponent,
  CarUserComponent,
  ContainerComponent,
  HeaderComponent,
  InputComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {Users} from '../Services/friendService.';
import {debounce} from 'lodash';
import {authSelector} from '../../redux/reducers/authReducer';
import {useSelector} from 'react-redux';
import {UserInfo} from '../Untils/UserInfo';
const SearchScreen = () => {
  const [value, setValue] = useState('');
  const [messageErr, setMessageErr] = useState('');
  const [users, setUsers] = useState([]);
  const auth = useSelector(authSelector);
  
  const handleSearchFriends = async (key: string) => {
    if (!key) {
      return;
    }
    const url = `/search?currentUserID=${auth.userID}&&searchTerm=${key}`;
    try {
      const res = await Users.getUsers(url);
      setUsers(res);
      setMessageErr('');
    } catch (error) {
      console.log('handleSearchFriends', error);
    }
  };
  const debouncedFetchUsers = debounce(handleSearchFriends, 300);
  useEffect(() => {
    debouncedFetchUsers(value);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [value]);
 
  return (
    <ContainerComponent isScroll styles={[{paddingHorizontal: 12}]}>
      <HeaderComponent
        styles={{}}
        isBcolor
        iconLeft={
          <AntDesign
            name="close"
            size={appInfo.sizeIconBold}
            color={appColors.black}
          />
        }
        title="Find friends"
      />
      <SpaceComponent height={20} />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <InputComponent
          styles={{}}
          type="default"
          placehold="Search ..."
          value={value}
          onChange={text => setValue(text)}
          allowClear
          affix={
            <SearchNormal
              size={appInfo.sizeIcon}
              color={appColors.blue}
              variant="Broken"
            />
          }
          onEnd={() => {
            !value && setMessageErr('Search term is required!');
          }}
          multiline
          numberOfLines={2}
        />
      </View>
      <SpaceComponent height={4} />
      <View style={{paddingLeft: 18}}>
        {messageErr && (
          <TextComponent label={messageErr} color={appColors.red} />
        )}
      </View>
      <SpaceComponent height={20} />

      <View
        style={{
          borderTopColor: appColors.grey2,
          borderTopWidth: 0.2,
        }}
      />
      {users && (
        <View style={{marginLeft: 15}}>
          <TextComponent
            title
            label={`${users.length} result${users.length > 1 ? 's' : ''}`}
          />
        </View>
      )}
      <View style={{alignItems: 'center'}}>
        {users &&
          users.map((item: any, index) => (
            <View key={index}>
              <SpaceComponent height={20} />
              <CarUserComponent
                isFind
                name={UserInfo.getName(item?.name)}
                iconF
                img={item?.avatar}
              />
            </View>
          ))}
      </View>
      <SpaceComponent height={20} />
      <View>
        <CarfeatureComponent
          onPress={() => console.log('hello')}
          label={'By friends list'}
          icon={
            <Feather
              name="book-open"
              size={appInfo.sizeIcon}
              color={'#363B4BC2'}
            />
          }
          styles={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}
        />
        <CarfeatureComponent
          label={'Theo khoa'}
          icon={
            <Feather
              name="external-link"
              size={appInfo.sizeIcon}
              color={'#363B4BC2'}
            />
          }
        />
        <CarfeatureComponent
          label={'By class'}
          icon={
            <Feather
              name="user-plus"
              size={appInfo.sizeIcon}
              color={'#363B4BC2'}
            />
          }
          styles={{
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomColor: appColors.white,
          }}
        />
      </View>
      <SpaceComponent height={40} />
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
