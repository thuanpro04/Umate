import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {ArrowLeft2, HeartCircle, SearchNormal} from 'iconsax-react-native';
import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {Accelerate, Creativity} from '../../assets/svgs/indexSvg';
import {authSelector} from '../../redux/reducers/authReducer';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  CarfeatureComponent,
  CarUserComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import CarUserChat from '../Messages/Component/CarUserChat';
import {messageServices} from '../Services/messageServices';
import {searchServices} from '../Services/searchServices';
import {UserInfo} from '../Untils/UserInfo';
import {useTranslation} from 'react-i18next';
const SearchScreen = ({navigation}: any) => {
  const [value, setValue] = useState('');
  const [messageErr, setMessageErr] = useState('');
  const [users, setUsers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [titleSearch, setTitleSearch] = useState<any[]>([]);
  const route = useRoute();
  const {key} = route.params as {key: string};

  const [backgroundItem, setBackgroundItem] = useState<any[]>([]);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  const optionsKey = [
    {
      key: 'friends',
      title: t('by_friends_list'),
      icon: <HeartCircle size={appInfo.sizeIconBold} color={appColors.blue} />,
    },
    {
      key: 'majorCategory',
      title: t('by_major'),
      icon: (
        <Creativity
          height={appInfo.sizeIconBold}
          width={appInfo.sizeIconBold}
          color={appColors.blue}
        />
      ),
    },
    {
      key: 'className',
      title: t('by_class'),
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
    const data = titleSearch.includes(key)
      ? titleSearch.filter((item: any) => item !== key) // Xóa key nếu đã tồn tại
      : [...titleSearch, key]; // Thêm key nếu chưa tồn tại
    setTitleSearch(data);
  };

  const handleSearchFriends = async (keySearch: string) => {
    if (!keySearch) {
      return;
    }

    try {
      const res = await searchServices.handleSearchFriends(
        auth.userId,
        keySearch,
        titleSearch,
      );
      if (res?.data) {
        setUsers(res.data);
      }
      setMessageErr('');
    } catch (error) {
      console.log('handleSearchFriends', error);
    }
  };
  const handleSearchConversations = async (keySearch: string) => {
    try {
      const res = await searchServices.searchConversationUsers(
        auth.userId,
        keySearch,
      );
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
    const isShowIconAddCancel = item.friends.includes(auth.userId);
    const isShowRequest = item.friendRequests.includes(auth.userId);

    return (
      <View key={index}>
        <SpaceComponent height={20} />
        <CarUserComponent
          userId={item.userId}
          isFind
          name={UserInfo.getName(item?.name)}
          iconAddCancel
          isFriend={isShowIconAddCancel}
          img={item?.avatar}
          isRequestFriend={isShowRequest}
          majoring={item.majoring ?? t('majoring')}
        />
      </View>
    );
  };
  const onNavigationChat = async (item: any) => {
    try {
      const res = await messageServices.checkConversation(
        auth.userId,
        item.userId,
      );
      res && console.log('res.data', res.data);

      if (res && res.data) {
        let conversationId = res.data;
        await AsyncStorage.setItem(
          'ConversationInfo',
          JSON.stringify({...item, conversationId}),
        );
      } else {
        await AsyncStorage.setItem(
          'ConversationInfo',
          JSON.stringify({...item, type: 'personal'}),
        );
      }
      navigation.navigate('Chat');
    } catch (error) {
      console.error('Respond save user error ', error);
    }
  };

  const renderItemsConversation = (item: any, index: number) => {
    return (
      <CarUserChat
        key={item.userId}
        name={item.groupName ?? UserInfo.getName(item.name)}
        massv={
          item.type === 'group'
            ? item.invitedUsers.length
            : UserInfo.getYearOfbirth(item.email)
        }
        image={item.avatar}
        lastMessage={item.lastMessage}
        onPress={() => onNavigationChat(item)}
      />
    );
  };
  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        {paddingHorizontal: 12, backgroundColor: colors.background},
      ]}>
      <SpaceComponent height={10} />
      <RowComponent styles={{justifyContent: 'center', alignItems: 'center'}}>
        <ArrowLeft2
          size={appInfo.sizeIconBold}
          color={colors.icon}
          onPress={() => navigation.goBack()}
        />
        <InputComponent
          styles={{paddingVertical: 3}}
          type="default"
          placehold={t('search')}
          value={value}
          onChange={text => setValue(text)}
          allowClear
          affix={
            <SearchNormal
              size={appInfo.sizeIcon}
              color={colors.icon}
              variant="Broken"
            />
          }
          onEnd={() => {
            !value && setMessageErr('Search term is required!');
          }}
          multiline
          numberOfLines={2}
          subffix={
            key !== 'searchConversations' && (
              <AntDesign
                name="filter"
                size={appInfo.sizeIconBold}
                color={colors.icon}
              />
            )
          }
          onPressFilter={() => setShowFilter(!showFilter)}
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
          borderTopColor: colors.border,
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
                    index === 0 && {
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    index === optionsKey.length - 1 && {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderBottomColor: colors.border,
                    },
                    {
                      backgroundColor: backgroundItem[item.key.toString()]
                        ? appColors.blue
                        : colors.background,
                    },
                  ]}
                  labelColor={
                    backgroundItem[item.key.toString()] || theme === 'dark'
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
    </SafeAreaView>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
