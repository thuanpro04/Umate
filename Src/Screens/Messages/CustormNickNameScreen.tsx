import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import UpdateInfoModal from '../Modal/UpdateInfoModal';
import {messageServices} from '../Services/messageServices';
import {UserInfo} from '../Untils/UserInfo';
import {userServices} from '../Services/userService';
import {useTranslation} from 'react-i18next';

const CustormNickNameScreen = () => {
  const {converInfo} = useRoute().params as {converInfo: any};
  const [selectUser, setSelectUser] = useState<any>('');
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [converData, setConverData] = useState(converInfo);
  const [value, setValue] = useState('');
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const [visible, setVisible] = useState(false);
  const colors = appColors[theme ?? 'light'];
  const key = converInfo.type;
  const {t} = useTranslation();

  const fetchUserInfos = async () => {
    try {
      const res = await userServices.getListUserInfo(converInfo.invitedUsers);
      if (res && res.data) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error('fetch use info fail: ', error);
    }
  };
  const data = [
    {
      userId: converData.userId,
      name:
        converData.nickNames && converData.nickNames[converData.userId]
          ? converData.nickNames[converData.userId]
          : UserInfo.getName(converData.name),
      avatar: converData.avatar,
    },
    {
      userId: auth.userId,
      name:
        converData.nickNames && converData.nickNames[auth.userId]
          ? converData.nickNames[auth.userId]
          : UserInfo.getName(profile.name),
      avatar: profile.avatar,
    },
  ];
  const onOpenModal = (item: any) => {
    setSelectUser(item);
    setVisible(true);
  };
  const handleUpdateNickName = async (userId: string, value: string) => {
    if (!userId || value.length < 6) {
      console.log('Check user or value not exist');

      return;
    }
    setValue(value);
    try {
      const res = await messageServices.updateNickNameConversation({
        userId,
        value,
        id: key === 'personal' ? converInfo.conversationId : converInfo.groupId,
        key,
      });
      if (res && res.data) {
        console.log('Update nick name successfully!!', res.data);
        await AsyncStorage.setItem(
          'ConversationInfo',
          JSON.stringify({...converInfo, nickNames: res.data}),
        );
        const updateData = {...converInfo, nickNames: res.data};
        setConverData(updateData);
      }
    } catch (error) {
      console.log('Update nick name fail: ', error);
    }
  };
  const getNameInGroup = (item: any) => {
    if (converData.nickNames && converData.nickNames[item.userId]) {
      return converData.nickNames[item.userId];
    }
    return UserInfo.getName(item.name);
  };
  const renderCard = useCallback(
    ({item, index}: any) => {
      return (
        item && (
          <RowComponent styles={{marginBottom: 12}} key={index}>
            <FastImage
              source={{
                uri: item.avatar,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={globalStyles.avatar}
            />
            <SpaceComponent />
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => onOpenModal(item)}>
              <TextComponent label={t('alias')} />
              <SpaceComponent height={3} />
              <TextComponent
                label={getNameInGroup(item)}
                color={colors.text2}
              />
            </TouchableOpacity>
          </RowComponent>
        )
      );
    },
    [converData, converInfo, userInfo, handleUpdateNickName],
  );
  useEffect(() => {
    if (converInfo) {
      fetchUserInfos();
    }
  }, [converInfo]);

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title={t('nickname')}
      />
      <View style={{paddingHorizontal: 12}}>
        {!converData.groupId ? (
          <View style={{}}>
            {data.map((item, index) => renderCard({item, index}))}
          </View>
        ) : (
          <FlatList
            data={userInfo}
            keyExtractor={item => item.userId}
            renderItem={renderCard}
          />
        )}
      </View>
      <UpdateInfoModal
        isVisible={visible}
        nickName={t('set_nickname')}
        nameField={UserInfo.getName(selectUser.name)}
        onCloseModal={() => setVisible(false)}
        onChangeProfile={(key, value) =>
          handleUpdateNickName(selectUser.userId, value)
        }
      />
    </SafeAreaView>
  );
};

export default CustormNickNameScreen;

const styles = StyleSheet.create({});
