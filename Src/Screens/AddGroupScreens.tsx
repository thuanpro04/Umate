import {useFocusEffect} from '@react-navigation/native';
import {ArrowLeft2, Camera, Edit2} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {globalStyles} from '../Styles/globalStyle';
import {appColors} from '../Theme/Colors/appColors';
import {appInfo} from '../Theme/appInfo';
import {authSelector} from '../redux/reducers/authReducer';
import {themeSelector} from '../redux/reducers/themeSlice';
import {
  ButtonComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from './Components';
import DropdownPicker from './Components/DropdownPicker';
import ButtonImagePicker from './Messages/Component/ButtonImagePicker';
import UpdateInfoModal from './Modal/UpdateInfoModal';
import {groupServices} from './Services/groupServices';
import {imageService} from './Services/imageService';
import {userServices} from './Services/userService';
import {Validate} from './Untils/Validate';
import {useTranslation} from 'react-i18next';
const initValues = {
  groupName: '',
  description: '',
  invitedUsers: [],
  authorId: '',
  leader: '',
  deputyLeader: '',
  avatar: '',
};
const AddGroupScreens = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const [visible, setVisible] = useState(false);
  const [nameField, setNameField] = useState('');
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [messageErrors, setMessageErrors] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  const [groupInfo, setGroupInfo] = useState<any>({
    ...initValues,
    authorId: auth.userId,
    avatar: getAvatar(),
  });

  useFocusEffect(
    useCallback(() => {
      getAllUsers();
    }, []),
  );
  useEffect(() => {
    setMessageErrors(Validate.groupValidation(groupInfo));
  }, [groupInfo]);

  const getAllUsers = async () => {
    const res = await userServices.getEquestFriendUsers(auth.userId, '');
    if (res) {
      const data = res.data.map(
        ({name, avatar, userId, majorCategory}: any) => ({
          name,
          avatar,
          userId,
          majorCategory,
        }),
      );
      setUsers(data);
    }
   
  };
  function getAvatar() {
    const temp =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1newdbzQNEDeE0F8ky3T40yrgWDpsNzX4Rw&s';
    return temp;
  }
  const handleModal = (key: string, event?: React.SyntheticEvent) => {
    if (event) {
      event.persist(); // Prevent React from nullifying the event properties
    }
    setNameField(key);
    setVisible(true);
  };
  const onCloseModal = () => {
    setVisible(false);
  };
  const onChangeGroupInfo = (key: any, value: any) => {
    setGroupInfo((prev: any) => ({...prev, [key]: value}));
  };
  const handleSelected = async (val: ImageOrVideo) => {
    const filePath = val.path;
    const fileName = filePath.split('/').pop();
    const path = `avatars/${fileName}`;
    console.log('path: ', path);

    const urlImage = await imageService.uploadImageToFirebase(filePath, path);
    console.log('Url: ', urlImage);

    onChangeGroupInfo('avatar', {
      name: urlImage,
      data: {userId: auth.userId},
    });
   
  };

  function getDataGroup() {
    const member = groupInfo.invitedUsers.map((item: any) => ({
      ...item.data,
      userName: item.name,
    }));

    const currentUser = {
      userId: auth.userId,
      userName: auth.name,
      avatar: auth.avatar,
      majoring: auth.majoring,
    };
    const dataGroup = {
      authorId: groupInfo.authorId,
      groupName: groupInfo.groupName,
      description: groupInfo.description,
      avatar:
        groupInfo.avatar &&
        typeof groupInfo.avatar === 'object' &&
        groupInfo.avatar.name
          ? groupInfo.avatar.name
          : groupInfo.avatar,
      invitedUsers: [...member, currentUser],
      leader: {
        userId: groupInfo.leader.data
          ? groupInfo.leader.data.userId
          : auth.userId,
      },
      deputyLeader: {
        userId: groupInfo.deputyLeader.data.userId,
      },
      type: 'group',
    };
    // console.log('data ne', dataGroup);

    return dataGroup;
  }
  const handleAddGroupUser = async () => {
    try {
      console.log(getDataGroup().invitedUsers, 123);

      const res = await groupServices.handelNewGroupUser(
        getDataGroup(),
        'post',
      );

      if (res) {
        navigation.navigate('Messages');
      }
    } catch (error) {
      console.log('handleAddGroupUser', error);
    }
  };

  return (
    <ScrollView
      style={[localStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 color={colors.icon} size={appInfo.sizeIconBold} />
        }
      />
      <ScrollView>
        <View style={localStyles.containerImages}>
          {loading && (
            <View
              style={{
                ...localStyles.imgStyles,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color="#555" />
            </View>
          )}

          <FastImage
            source={{
              uri: groupInfo.avatar ? groupInfo.avatar.name : getAvatar(),
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
            style={[localStyles.imgStyles, {zIndex: -1}]}
            onLoadStart={() => setLoading(true)} // Bắt đầu tải
            onLoadEnd={() => setLoading(false)} // Hoàn tất tải
          />
          <SpaceComponent height={12} />
          <View style={[globalStyles.overlay, {...localStyles.imgStyles}]}>
            <ButtonImagePicker
              multiple={false}
              icon={<Camera size={appInfo.sizeIconBold} color={colors.icon} />}
              onSelect={x => {
                x.type === 'url'
                  ? onChangeGroupInfo('avatar', {
                      name: x.value.toString().trim(),
                      data: {userId: auth.userId},
                    })
                  : handleSelected(x.value as ImageOrVideo);
              }}
            />
          </View>
        </View>
        <View style={{paddingHorizontal: 18}}>
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent
              label={t('group_name')}
              styles={globalStyles.label}
            />
            <RowComponent
              styles={[globalStyles.inputRow, {borderColor: colors.border}]}
              onPress={() => handleModal('groupName')}>
              <TextComponent label={groupInfo.groupName} color={colors.text2} />
              <Edit2
                color={
                  messageErrors.includes('groupName') ? 'red' : colors.icon
                }
                size={appInfo.sizeIcon}
              />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={20} />
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent
              label={t('description')}
              styles={globalStyles.label}
            />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('description')}>
              <TextComponent
                label={groupInfo.description}
                color={colors.text2}
              />
              <Edit2 color={colors.icon} size={appInfo.sizeIcon} />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={20} />
          <View style={{}}>
            <TextComponent label={t('member')} styles={globalStyles.label} />
            <SpaceComponent height={10} />
            <DropdownPicker
              placeHold={t('select')}
              users={users}
              color={
                messageErrors.includes('invitedUsers') ? 'red' : colors.icon
              }
              nameField="invitedUsers"
              onChangeValue={onChangeGroupInfo}
              userSelected={groupInfo.invitedUsers}
            />
          </View>
          <SpaceComponent height={20} />
          <View>
            <TextComponent label={t('leader')} styles={globalStyles.label} />
            <SpaceComponent height={10} />
            <DropdownPicker
              placeHold={t('select')}
              users={groupInfo.invitedUsers}
              onChangeValue={onChangeGroupInfo}
              userSelected={groupInfo.leader}
              nameField="leader"
              isLeader
              userName={groupInfo.leader.name}
              styles={{width: '85%'}}
            />
          </View>
          <SpaceComponent height={20} />
          <View>
            <TextComponent
              label={t('deputy_leader')}
              styles={globalStyles.label}
            />
            <SpaceComponent height={10} />
            <DropdownPicker
              placeHold={t('select')}
              users={
                groupInfo.invitedUsers && groupInfo.leader
                  ? groupInfo.invitedUsers.filter(
                      (item: any) =>
                        item.data.userId != groupInfo.leader.data.userId,
                    )
                  : groupInfo.invitedUsers
              }
              color={
                messageErrors.includes('deputyLeader') ? 'red' : colors.icon
              }
              onChangeValue={onChangeGroupInfo}
              userSelected={[]}
              nameField="deputyLeader"
              isDeputyLeader
              userName={groupInfo.deputyLeader.name}
              styles={{width: '80%'}}
            />
          </View>

          <SpaceComponent height={30} />
          <ButtonComponent
            type="primary"
            onPress={() => messageErrors.length === 0 && handleAddGroupUser()}
            label={t('create_group')}
            styles={{paddingVertical: 6}}
          />
          <SpaceComponent height={30} />
        </View>
      </ScrollView>
      {visible && (
        <UpdateInfoModal
          onChangeProfile={onChangeGroupInfo}
          onCloseModal={onCloseModal}
          isVisible={visible}
          nameField={nameField}
        />
      )}
    </ScrollView>
  );
};

export default AddGroupScreens;
const localStyles = StyleSheet.create({
  container: {marginTop: StatusBar.currentHeight},
  containerImages: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyles: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
});
