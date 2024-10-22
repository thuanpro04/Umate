import {
  ArrowLeft,
  ArrowLeft2,
  ArrowLeft3,
  BrushSquare,
  CloseCircle,
  More,
  SearchNormal,
} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  ContainerComponent,
  HeaderComponent,
  InputComponent,
  RowComponent,
  SearchFriendsComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Keyboard, View} from 'react-native';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import CarUserChat from './Component/CarUserChat';
import {messageServices} from '../Services/messageServices';

const MessageScreen = ({navigation}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );

  const getUsers = async () => {
    const url = `/get-all-conversation?currentUserID=${auth.userID}`;
    setIsLoading(true);
    try {
      const res = await messageServices.getAllConversationUsers(url);
      if (res?.data.usersInfo && res) {
        setUsers(res?.data.usersInfo);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false);
    }
  };
  const onNavigationChat = (name: string, avatar: string, userID: string) => {
    navigation.navigate('Chat', {
      userName: name,
      avatar: avatar,
      currentUserID: auth.userID,
      userID: userID,
    });
  };

  return (
    <ContainerComponent>
      <HeaderComponent
        iconStyle
        styles={{justifyContent: 'space-between'}}
        iconLeft={
          <ArrowLeft2 color={appColors.black} size={appInfo.sizeIconBold} />
        }
        iconRight={<More color={appColors.black} size={appInfo.sizeIconBold} />}
        title="Messages"
      />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <SearchFriendsComponent
          styles={{
            flex: 0,
            width: '90%',
          }}
          placeHold="conversations ..."
          onPress={() =>
            navigation.navigate('Search', {key: 'searchConversations'})
          }
        />
      </View>
      <ContainerComponent
        isScroll
        styles={{
          paddingVertical: 0,
        }}>
        {isLoading ? (
          <>
            <SpaceComponent height={200} />
            <ActivityIndicator />
          </>
        ) : (
          users &&
          users.map((item: any, index) => (
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
          ))
        )}
        {users.length === 0 && (
          <View style={{alignItems: 'center'}}>
            <SpaceComponent height={200} />
            <TextComponent
              label={'Chats not found !!'}
              color={appColors.grey2}
              styles={{fontStyle: 'italic', fontWeight: '300'}}
            />
          </View>
        )}
      </ContainerComponent>
    </ContainerComponent>
  );
};

export default MessageScreen;
