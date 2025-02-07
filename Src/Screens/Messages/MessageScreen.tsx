import {
  HambergerMenu,
  More,
  ScanBarcode
} from 'iconsax-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { appColors } from '../../Theme/Colors/appColors';
import { appInfo } from '../../Theme/appInfo';
import { authSelector } from '../../redux/reducers/authReducer';
import {
  HeaderComponent,
  SearchFriendsComponent,
  SpaceComponent,
  TextComponent
} from '../Components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, SafeAreaView, View } from 'react-native';
import { globalStyles } from '../../Styles/globalStyle';
import InfomationModal from '../Modal/InfomationModal';
import { messageServices } from '../Services/messageServices';
import { UserInfo } from '../Untils/UserInfo';
import CarUserChat from './Component/CarUserChat';

const MessageScreen = ({navigation}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const memoizedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const dateA = new Date(a.lastMessageTimestamp).getTime();
      const dateB = new Date(b.lastMessageTimestamp).getTime();
      return  dateA - dateB;
    });
  }, [users]);

  const getAllConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await messageServices.getAllConversationUsers(auth.userId);
      if (res?.data && res) {
        setUsers(res?.data);
        console.log(res?.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false);
    }
  }, []);
  const onNavigation = async (item: any) => {
    // console.log(item,124);
    
    await AsyncStorage.setItem('ConversationInfo', JSON.stringify(item));
    navigation.navigate('Chat');
  };
  const onCloseModal = () => {
    setIsVisible(false);
  };
  const handleAddGroup = () => {
    navigation.navigate('AddGroup');
    onCloseModal();
  };
  useFocusEffect(
    useCallback(() => {
      getAllConversation();
    }, []),
  );
  const renderCardItems = ({item, index}: any) => {
    return (
      <CarUserChat
        key={index}
        name={item.groupName ?? UserInfo.getName(item.name)}
        massv={
          item.type === 'group'
            ? item.invitedUsers.length
            : UserInfo.getYearOfbirth(item.email)
        }
        image={item.avatar}
        lastMessage={item.lastMessage}
        onPress={() => onNavigation(item)}
      />
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <HeaderComponent
        iconStyle
        styles={{justifyContent: 'space-between'}}
        
        iconRight={<More color={appColors.blue2} size={appInfo.sizeIconBold} />}
        // title="Messages"
        iconQR={
          <ScanBarcode color={appColors.blue2} size={appInfo.sizeIconBold} />
        }
        onPress2={() => setIsVisible(true)}
      />
      <View style={{paddingLeft: 18}}>
        <TextComponent
          label="Messages"
          styles={{
            fontSize: 28, // Tăng kích thước chữ một chút để nổi bật
            fontStyle: 'italic', // Giữ phong cách nghiêng để tạo sự khác biệt
            fontWeight: '700', // Đặt độ đậm của chữ rõ ràng
            color: appColors.blueBack, // Thêm màu sắc cho tiêu đề để dễ nhìn
          }}
        />
      </View>
      <SpaceComponent height={18} />
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
      {isLoading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator />

          {!memoizedUsers && (
            <TextComponent
              label={'Chats not found !!'}
              color={appColors.grey2}
              styles={{fontStyle: 'italic', fontWeight: '300'}}
            />
          )}
        </View>
      ) : memoizedUsers.length > 0 ? (
        <FlatList
          data={memoizedUsers}
          key={'listMessage'}
          keyExtractor={item =>
            item.type === 'personal' ? item.conversationId : item.groupId
          }
          renderItem={renderCardItems}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextComponent
            label={'Chats not found !!'}
            color={appColors.grey2}
            styles={{
              fontStyle: 'italic',
              fontWeight: '300',
              color: appColors.black,
            }}
          />
        </View>
      )}
      <InfomationModal
        visible={isVisible}
        onClose={onCloseModal}
        onPressAddGroud={handleAddGroup}
      />
    </SafeAreaView>
  );
};

export default MessageScreen;
