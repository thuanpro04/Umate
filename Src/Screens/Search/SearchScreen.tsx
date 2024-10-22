import {ArrowLeft2, HeartCircle, SearchNormal} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';

import {debounce} from 'lodash';
import {useSelector} from 'react-redux';
import {Accelerate, Creativity} from '../../assets/svgs/indexSvg';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  CarfeatureComponent,
  CarUserComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import {useRoute} from '@react-navigation/native';
import {messageServices} from '../Services/messageServices';
import CarUserChat from '../Messages/Component/CarUserChat';
const SearchScreen = ({navigation}: any) => {
  const [value, setValue] = useState('');
  const [messageErr, setMessageErr] = useState('');
  const [users, setUsers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const route = useRoute();
  const {key} = route.params as {key: string};

  const [backgroundItem, setBackgroundItem] = useState<any[]>([]);
  const auth = useSelector(authSelector);

  const optionsKey = [
    {
      key: 'byFriends',
      title: 'By friends list',
      icon: <HeartCircle size={appInfo.sizeIconBold} color={appColors.blue} />,
    },
    {
      key: 'byField',
      title: 'By field of study',
      icon: (
        <Creativity
          height={appInfo.sizeIconBold}
          width={appInfo.sizeIconBold}
          color={appColors.blue}
        />
      ),
    },
    {
      key: 'byClass',
      title: 'By class',
      icon: (
        <Accelerate
          height={appInfo.sizeIconBold}
          width={appInfo.sizeIconBold}
          color={appColors.blue}
        />
      ),
    },
  ];
  const selectItems = (key: any) => {
    setBackgroundItem(prev => ({
      ...prev,
      [key]: !backgroundItem[key],
    }));
  };
  const handleSearchFriends = async (keySearch: string) => {
    if (!keySearch) {
      return;
    }
    const url = `/search?currentUserID=${auth.userID}&searchTerm=${keySearch}`;
    try {
      const res = await userServices.getUsers(url);
      setUsers(res);
      console.log('users', users);

      setMessageErr('');
    } catch (error) {
      console.log('handleSearchFriends', error);
    }
  };
  const handleSearchConversations = async (keySearch: string) => {
    const url = `/search-conversations?currentUserID=${auth.userID}&keyWord=${keySearch}`;
    console.log(url);

    try {
      const res = await messageServices.searchConversationUsers(url);
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.log('handleSearchConversations', error);
    }
  };
  const debouncedFetchUsers =
    key === 'searchFriends'
      ? debounce(handleSearchFriends, 300)
      : debounce(handleSearchConversations, 300);
  useEffect(() => {
    debouncedFetchUsers(value);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [value]);
  const renderCarUsers = (item: any, index: number) => {
    const isShowIconAddCancel = item.friends.includes(auth.userID);
    const isShowRequest = item.friendRequests.includes(auth.userID);

    return (
      <View key={index}>
        <SpaceComponent height={20} />
        <CarUserComponent
          userID={item.userID}
          isFind
          name={UserInfo.getName(item?.name)}
          iconAddCancel
          isFriend={isShowIconAddCancel}
          img={item?.avatar}
          isRequestFriend={isShowRequest}
        />
      </View>
    );
  };
  const onNavigationChat = (name: string, avatar: string, userID: string) => {
    navigation.navigate('Chat', {
      userName: name,
      avatar: avatar,
      currentUserID: auth.userID,
      userID: userID,
    });
  };

  const renderItemsConversation = (item: any, index: number) => {
    return (
      <CarUserChat
        key={item.userID}
        name={UserInfo.getName(item.name)}
        massv={UserInfo.getYearOfbirth(item.email)}
        image={item.avatar}
        lastMessage={item.lastMessage}
        onPress={() =>
          onNavigationChat(
            UserInfo.getName(item.name),
            item.avatar,
            item.userID,
          )
        }
      />
    );
  };
  return (
    <ContainerComponent isScroll styles={[{paddingHorizontal: 12}]}>
      <SpaceComponent height={10} />
      <RowComponent styles={{justifyContent: 'center', alignItems: 'center'}}>
        <ArrowLeft2
          size={appInfo.sizeIconBold}
          color={appColors.blue}
          onPress={() => navigation.goBack()}
        />
        <InputComponent
          styles={{paddingVertical: 3}}
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
          subffix={
            <AntDesign
              name="filter"
              size={appInfo.sizeIconBold}
              color={appColors.blue}
            />
          }
          onPressFilter={() => setShowFilter(true)}
        />
      </RowComponent>
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
            label={`${users.length} ${
              key === 'searchFriends' ? 'result' : 'suggest'
            }${users.length > 1 ? 's' : ''}`}
          />
        </View>
      )}
      {key === 'searchFriends' && (
        <>
          <View style={{alignItems: 'center'}}>
            {users &&
              users.map((item: any, index) => renderCarUsers(item, index))}
          </View>
          <SpaceComponent height={20} />
          <View>
            {showFilter &&
              optionsKey.map((item: any, index) => (
                <CarfeatureComponent
                  key={index}
                  onPress={() => selectItems(item.key)}
                  label={item.title}
                  icon={item.icon}
                  styles={[
                    index === 1 && {
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    index === optionsKey.length && {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderBottomColor: appColors.white,
                    },
                    {
                      backgroundColor: backgroundItem[item.key.toString()]
                        ? appColors.blue
                        : appColors.white,
                    },
                  ]}
                  labelColor={
                    backgroundItem[item.key.toString()]
                      ? appColors.white
                      : appColors.black
                  }
                />
              ))}
          </View>
        </>
      )}
      {key === 'searchConversations' &&
        users &&
        users.map((item: any, index) => renderItemsConversation(item, index))}
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
