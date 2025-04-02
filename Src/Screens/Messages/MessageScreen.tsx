import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {HambergerMenu, More, ScanBarcode} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  CustormLongPress,
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
import {useTranslation} from 'react-i18next';
import UpdateInfoModal from '../Modal/UpdateInfoModal';

const MessageScreen = ({navigation}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const auth = useSelector(authSelector);
  const [page, setPage] = useState(1);
  const [limitPage, setLimitPage] = useState(1);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();
  const sortUsersByPinnedStatus = (users: any) => {
    if (!users || users.length === 0) return [];
    return [...users].sort((a, b) => {
      const isAPinned = a.pinnedBy && a.pinnedBy.includes(auth.userId);
      const isBPinned = b.pinnedBy && b.pinnedBy.includes(auth.userId);
      if (isAPinned && !isBPinned) return -1;
      if (!isAPinned && isBPinned) return 1;
      return 0; // Keep original order if both pinned or both unpinned
    });
  };
  const getAllConversation = useCallback(async () => {
    setIsLoading(true);
    if (page > limitPage) {
      return;
    }
    const res = await messageServices.getAllConversationUsers(
      auth.userId,
      page,
    );
    if (res?.data && res) {
      const sortedUsers = sortUsersByPinnedStatus(res?.data.allConversations);
      setUsers(sortedUsers);
      setLimitPage(res.data.totalPage);
      setPage(prevPage => prevPage + 1);
    } else {
      setUsers([]);
    }
    setIsLoading(false);
  }, []);
  const onNavigation = async (item: any) => {
    await AsyncStorage.setItem('ConversationInfo', JSON.stringify(item));
    navigation.navigate('Chat');
  };
  const onCloseModal = () => {
    setIsVisible(false);
  };
  const handleAddGroup = () => {
    onCloseModal();
    navigation.navigate('AddGroup');
  };
  const handleDeleteConversation = async (user: any) => {
    setIsLoading(true);
    const id = user.type === 'group' ? user.groupId : user.conversationId;
    const res = await messageServices.deleteConversation({
      [user.type]: [id],
    });
    if (res) {
      console.log('✅ Delete conversation successfully!');
      // Cập nhật danh sách users
      setUsers(prevUsers =>
        prevUsers.filter(
          item =>
            (item.type === 'personal' && item.conversationId !== id) ||
            (item.type === 'group' && item.groupId !== id),
        ),
      );
    }
    setIsLoading(false);
  };
  const handleGhimConversation = async (user: any) => {
    const res = await messageServices.actionGhimConversation(
      user.type === 'personal' ? user.conversationId : user.groupId,
      auth.userId,
      user.type,
    );
    if (res && res.data) {
      console.log('Ghim conversation successfully !!!', res.data);
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(item => {
          // Check if this is the item we just pinned
          if (
            (user.type === 'personal' &&
              item.conversationId === user.conversationId) ||
            (user.type === 'group' && item.groupId === user.groupId)
          ) {
            // Create a new object with updated pinnedBy property
            let isPinned = item.pinnedBy?.includes(auth.userId);
            const pinnedBy = isPinned
              ? item.pinnedBy?.filter((id: any) => id !== auth.userId) // Bỏ ghim
              : [...(item.pinnedBy || []), auth.userId]; // Ghim

            return {
              ...item,
              pinnedBy,
            };
          }
          return item;
        });

        // Resort the conversations to move pinned ones to the top
        return sortUsersByPinnedStatus(updatedUsers);
      });
    }
  };
 
  const renderCardItems = useCallback(
    ({item, index}: any) => {
      const sumUsers =  item?.invitedUsers?.length ?? 0;
      const name = item.nickNames?.[item.userId] ?? item.name;

      return (
        <CustormLongPress
          handleDeleteConversation={() => handleDeleteConversation(item)}
          user={item}
          handleGhimConversation={() => handleGhimConversation(item)}
          onGroupNameUpdated={getAllConversation} // Truyền callback để tải lại danh sách
        >
          <CarUserChat
            isGhim={item.pinnedBy?.includes(auth.userId)}
            key={index}
            name={item.groupName ?? name}
            massv={
              item.type === 'group'
                ? sumUsers
                : UserInfo.getYearOfbirth(item.email)
            }
            image={item.avatar}
            lastMessage={item.lastMessage}
            onPress={() => onNavigation(item)}
            lastMessageColor={
              item.statusLastMessage ? appColors.blueBack : appColors.grey
            }
          />
        </CustormLongPress>
      );
    },
    [users, handleGhimConversation],
  );
  useEffect(() => {
    getAllConversation(); // Cập nhật danh sách khi users thay đổi
    navigation.addListener('focus', () => getAllConversation());
  }, []);
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
        iconQR={
          <MaterialIcons
            name="qr-code-scanner"
            size={appInfo.sizeIconBold}
            color={appColors.blue}
          />
        }
        onPress1={() => navigation.openDrawer()}
        onPress2={() => setIsVisible(true)}
        onPressQR={() => navigation.navigate('UserQRCode')}
      />
      <View style={{paddingLeft: 18}}>
        <TextComponent
          label={t('message')}
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
          placeHold={t('search')}
          onPress={() =>
            navigation.navigate('Search', {key: 'searchConversations'})
          }
        />
      </View>
      <SpaceComponent height={16} />
      {isLoading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator />

          {!users && (
            <TextComponent
              label={t('conversation_found')}
              styles={{fontStyle: 'italic', fontWeight: '300'}}
            />
          )}
        </View>
      ) : users && users.length > 0 ? (
        <FlatList
          data={users}
          key={'listMessage'}
          style={{flex: 1}}
          keyExtractor={item =>
            item.type === 'personal' ? item.conversationId : item.groupId
          }
          extraData={users}
          ListHeaderComponent={() =>
            page < limitPage ? <ActivityIndicator size={22} /> : null
          }
          onEndReached={page <= limitPage ? getAllConversation : () => {}}
          renderItem={renderCardItems}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextComponent
            label={t('conversation_found')}
            styles={{
              fontStyle: 'italic',
              fontWeight: '300',
            }}
          />
        </View>
      )}
      <InfomationModal
        onPressRemove={() => {
          onCloseModal();
          navigation.navigate('TrashConversation', {users});
        }}
        visible={isVisible}
        onClose={onCloseModal}
        onPressAddGroud={handleAddGroup}
      />
      
    </SafeAreaView>
  );
};

export default MessageScreen;
