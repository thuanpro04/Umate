import {useRoute} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import {Check, Trash} from 'lucide-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent} from '../Components';
import {UserInfo} from '../Untils/UserInfo';
import CarUserChat from './Component/CarUserChat';
import {messageServices} from '../Services/messageServices';
import {authSelector} from '../../redux/reducers/authReducer';
import LoadingModal from '../Modal/LoadingModal';
import {useTranslation} from 'react-i18next';

const TrashConversation = () => {
  const {users} = useRoute().params as {users: any[]};
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const [isBgUsers, setIsBgUsers] = useState<{[key: string]: Boolean}>({});
  const [selectItems, setSelectItems] = useState<{[key: string]: string[]}>({});
  const [userInfo, setUserInfo] = useState<any[]>(users);
  const [isLoading, setIsLoading] = useState(false);
  const colors = appColors[theme ?? 'light'];
  const auth = useSelector(authSelector);
  const {t} = useTranslation();

  const onChangeItems = (type: string, key: string) => {
    setIsBgUsers(prev => {
      const newItems = {
        ...prev,
        [key]: !prev[key],
      };
      return newItems;
    });
    setSelectItems(prev => {
      const newItems = {...prev};
      if (!newItems[type]) {
        newItems[type] = [];
      }
      if (newItems[type].includes(key)) {
        newItems[type] = newItems[type].filter(item => item !== key);
      } else {
        newItems[type].push(key);
      }

      return newItems;
    });
  };
  const actionDeleteConversation = () => {
    if (Object.keys(selectItems).length === 0) {
      return;
    }
    Alert.alert(t('confirm_delete'), t('confirm_delete_chat'), [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: async () => await handleDeleteConversation(),
      },
    ]);
  };
  const handleDeleteConversation = async () => {
    if (Object.keys(selectItems).length === 0) {
      return;
    }

    try {
      const res = await messageServices.deleteConversation(selectItems);
      if (res) {
        console.log('Delete conversation successfully !!!');
      }
      setSelectItems({});
      setIsBgUsers({});
      await getAllConversation();
    } catch (error) {
      console.log('Delete conversation fail: ', error);
    }
  };
  const getAllConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await messageServices.getAllConversationUsers(auth.userId);
      if (res?.data && res) {
        setUserInfo(res?.data);
        // console.log(res?.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false);
    }
  }, [handleDeleteConversation]);

  const renderCardItems = useCallback(
    ({item, index}: any) => {
      const sumUsers = item.invitedUsers ? item.invitedUsers.length : 0;

      return (
        <CarUserChat
          key={index}
          name={item.groupName ?? UserInfo.getName(item.name)}
          massv={
            item.type === 'group'
              ? sumUsers
              : UserInfo.getYearOfbirth(item.email)
          }
          image={item.avatar}
          lastMessage={item.lastMessage}
          onPress={() =>
            onChangeItems(
              item.type,
              item.type === 'group' ? item.groupId : item.conversationId,
            )
          }
          lastMessageColor={
            item.statusLastMessage ? appColors.blueBack : appColors.grey
          }
          iconCheck={
            isBgUsers[
              item.type === 'group' ? item.groupId : item.conversationId
            ] ? (
              <Check size={appInfo.sizeIconBold} color={'red'} />
            ) : null
          }
        />
      );
    },
    [users, isBgUsers, selectItems],
  );

  return (
    <View
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        title=""
        iconRight={<Trash size={appInfo.sizeIconBold} color={colors.icon} />}
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        onPress2={actionDeleteConversation}
      />
      {userInfo && userInfo.length > 0 && (
        <FlatList
          data={userInfo}
          key={'listMessage'}
          keyExtractor={item =>
            item.type === 'personal' ? item.conversationId : item.groupId
          }
          renderItem={renderCardItems}
        />
      )}
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default TrashConversation;

const styles = StyleSheet.create({});
