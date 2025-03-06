import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {HambergerMenu, More, ScanBarcode} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  HeaderComponent,
  SearchFriendsComponent,
  SpaceComponent,
  TextComponent,
} from '../Components'; 
import InfomationModal from '../Modal/InfomationModal';
import {messageServices} from '../Services/messageServices';
import {UserInfo} from '../Untils/UserInfo';
import CarUserChat from './Component/CarUserChat';
import {themeSelector} from '../../redux/reducers/themeSlice';

const MessageScreen = ({navigation}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];

  const getAllConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await messageServices.getAllConversationUsers(auth.userId);
      if (res?.data && res) {
        setUsers(res?.data);
        // console.log(res?.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false);
    }
  }, []);
  const onNavigation = async (item: any) => {
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
  
  const renderCardItems = useCallback(({item, index}: any) => {
    const sumUsers = item.invitedUsers ? item.invitedUsers.length : 0;

    return (
      <CarUserChat
        key={index}
        name={item.groupName ?? UserInfo.getName(item.name)}
        massv={
          item.type === 'group' ? sumUsers : UserInfo.getYearOfbirth(item.email)
        }
        image={item.avatar}
        lastMessage={item.lastMessage}
        onPress={() => onNavigation(item)}
        lastMessageColor={
          item.statusLastMessage ? appColors.blueBack : appColors.grey
        }
      />
    );
  },[users])

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconStyle
        iconLeft={
          <HambergerMenu size={appInfo.sizeIconBold} color={colors.icon} />
        }
        styles={{justifyContent: 'space-between'}}
        iconRight={<More color={colors.icon} size={appInfo.sizeIconBold} />}
        // title="Messages"
        iconQR={
          <ScanBarcode color={appColors.blue} size={appInfo.sizeIconBold} />
        }
        onPress1={() => navigation.openDrawer()}
        onPress2={() => setIsVisible(true)}
      />
      <View style={{paddingLeft: 18}}>
        <TextComponent
          label="Messages"
          styles={{
            fontSize: 28, // Tăng kích thước chữ một chút để nổi bật
            fontStyle: 'italic', // Giữ phong cách nghiêng để tạo sự khác biệt
            fontWeight: '700', // Đặt độ đậm của chữ rõ ràng
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
      <SpaceComponent height={12} />
      {isLoading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator />

          {!users && (
            <TextComponent
              label={'Chats not found !!'}
              styles={{fontStyle: 'italic', fontWeight: '300'}}
            />
          )}
        </View>
      ) : users && users.length > 0 ? (
        <FlatList
          data={users}
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
            styles={{
              fontStyle: 'italic',
              fontWeight: '300',
            }}
          />
        </View>
      )}
      <InfomationModal
        onPressRemove={()=> {
          setIsVisible(false)
          navigation.navigate('TrashConversation',{users})
        }}
        visible={isVisible}
        onClose={onCloseModal}
        onPressAddGroud={handleAddGroup}
      />
    </SafeAreaView>
  );
};

export default MessageScreen;
