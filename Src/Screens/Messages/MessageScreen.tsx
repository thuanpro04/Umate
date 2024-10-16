import { ArrowLeft, BrushSquare } from 'iconsax-react-native';
import React, { useCallback, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { appColors } from '../../Theme/Colors/appColors';
import { appInfo } from '../../Theme/appInfo';
import { authSelector } from '../../redux/reducers/authReducer';
import {
  ContainerComponent,
  HeaderComponent,
  RowComponent,
  SearchFriendsComponent,
  SpaceComponent,
} from '../Components';

import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { userServices } from '../Services/userService';
import { UserInfo } from '../Untils/UserInfo';
import CarUserChat from './Component/CarUserChat';
const MessageScreen = ({navigation}: any) => {
  const [value, setValue] = useState('');
  const [users, setUsers] = useState([]);
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);

  const getUsers = async () => {
    const url = `/get-all?currentUserID=${auth.userID}`;
    setIsLoading(true);
    try {
      const res = await userServices.getUsers(url);
      setUsers(res);
      setIsLoading(false);
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );
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
        isBcolor
        iconLeft={
          <ArrowLeft color={appColors.black} size={appInfo.sizeIconBold} />
        }
        iconRight={
          <BrushSquare color={appColors.black} size={appInfo.sizeIconBold} />
        }
      />
      <SpaceComponent height={10} />
      <RowComponent
        styles={{
          justifyContent: 'center',
          paddingHorizontal: 22,
          alignItems: 'center',
        }}>
        <SearchFriendsComponent onPress={() => navigation.navigate('Search')} />
        <Feather
          size={appInfo.sizeIconBold}
          color={appColors.black}
          name="filter"
        />
      </RowComponent>
      <ContainerComponent isScroll styles={{paddingVertical: 0}}>
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
              massv="22"
              image={item.avatar}
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
      </ContainerComponent>
    </ContainerComponent>
  );
};

export default MessageScreen;
