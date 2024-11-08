import {ArrowLeft2, More} from 'iconsax-react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  ContainerComponent,
  HeaderComponent,
  SearchFriendsComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';

import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator, View} from 'react-native';
import {messageServices} from '../Services/messageServices';
import {UserInfo} from '../Untils/UserInfo';
import CarUserChat from './Component/CarUserChat';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import InfomationModal from '../Modal/InfomationModal';

const MessageScreen = ({navigation}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getAllConversation();
    }, []),
  );

  const getAllConversation = async () => {
    setIsLoading(true);
    try {
      const res = await messageServices.getAllConversationUsers(auth.userID);
      if (res?.data && res) {
        setUsers(res?.data);
        console.log(users);
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
  const onCloseModal=() =>{
    setIsVisible(false)
  }
  const handleAddGroup =() =>{
    navigation.navigate('AddGroup')
    onCloseModal()
  }
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
        onPress2={() => setIsVisible(true)}
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
        ) : users.length > 0 ? (
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
        ) : (
          <></>
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
      <InfomationModal visible={isVisible} onClose={onCloseModal} onPressAddGroud={handleAddGroup}/>
    </ContainerComponent>
  );
};

export default MessageScreen;
