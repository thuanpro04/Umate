import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  HeaderComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from './Components';
import {ArrowLeft2, ArrowSquareDown, Camera, Edit2} from 'iconsax-react-native';
import {appColors} from '../Theme/Colors/appColors';
import {appInfo} from '../Theme/appInfo';
import {globalStyles} from '../Styles/globalStyle';
import ButtonImagePicker from './Messages/Component/ButtonImagePicker';
import {imageService} from './Services/imageService';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/reducers/authReducer';
import EditUserModal from './Modal/EditUserModal';
import DropdownPicker from './Components/DropdownPicker';
import {useFocusEffect} from '@react-navigation/native';
import {userServices} from './Services/userService';
import AddGroupModal from './Modal/AddGroupModal';
import {Validate} from './Untils/Validate';
import {UserInfo} from './Untils/UserInfo';
import UpdateInfoModal from './Modal/UpdateInfoModal';
import {groupServices} from './Services/groupServices';
import {themeSelector} from '../redux/reducers/themeSlice';
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
  const [messageErrors, setMessageErrors] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
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
    try {
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
    } catch (error) {
      console.error('Post event get users failed', error);
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
    try {
      const filePath = val.path;
      const fileName = filePath.split('/').pop();
      const path = `avatars/${fileName}`;
      const urlImage = await imageService.uploadImageToFirebase(filePath, path);
      onChangeGroupInfo('avatar', {
        name: urlImage,
        data: {userId: auth.userId},
      });
    } catch (error) {
      console.log('upload failed', error);
    }
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
  // console.log('groupInfo', groupInfo);

  return (
    <ScrollView
      style={[localStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 color={colors.icon} size={appInfo.sizeIconBold} />
        }
        title="Add Group"
      />
      <ScrollView>
        <View style={localStyles.containerImages}>
          <Image
            source={{
              uri: groupInfo.avatar.name ?? getAvatar(),
            }}
            resizeMode="cover"
            style={[localStyles.imgStyles, {zIndex: -1}]}
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
            <TextComponent label="Group Name" styles={globalStyles.label} />
            <RowComponent
              styles={[globalStyles.inputRow, {borderColor: colors.border}]}
              onPress={() => handleModal('groupName')}>
              <TextComponent label={groupInfo.groupName} color={colors.text2} />
              <Edit2 color={colors.icon} size={appInfo.sizeIcon} />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={20} />
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label="Description" styles={globalStyles.label} />
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
            <TextComponent
              label={'Invited users'}
              styles={globalStyles.label}
            />
            <SpaceComponent height={10} />
            <DropdownPicker
              placeHold="Selected"
              users={users}
              nameField="invitedUsers"
              onChangeValue={onChangeGroupInfo}
              userSelected={groupInfo.invitedUsers}
            />
          </View>
          <SpaceComponent height={20} />
          <View>
            <TextComponent label="Leader" styles={globalStyles.label} />
            <SpaceComponent height={10} />
            <DropdownPicker
              placeHold="select leader"
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
            <TextComponent label="DeputyLeader" styles={globalStyles.label} />
            <SpaceComponent height={10} />
            <DropdownPicker
              placeHold="Select Deputy Leader"
              users={
                groupInfo.invitedUsers && groupInfo.leader
                  ? groupInfo.invitedUsers.filter(
                      (item: any) =>
                        item.data.userId != groupInfo.leader.data.userId,
                    )
                  : groupInfo.invitedUsers
              }
              onChangeValue={onChangeGroupInfo}
              userSelected={[]}
              nameField="deputyLeader"
              isDeputyLeader
              userName={groupInfo.deputyLeader.name}
              styles={{width: '80%'}}
            />
          </View>
          <SpaceComponent height={10} />
          {messageErrors.length > 0 && (
            <View>
              {messageErrors.map((item, index) => (
                <TextComponent
                  key={index}
                  label={item}
                  color={appColors.red}
                  styles={{marginBottom: 12}}
                />
              ))}
            </View>
          )}
          <SpaceComponent height={30} />
          <ButtonComponent
            type="primary"
            onPress={() => messageErrors.length === 0 && handleAddGroupUser()}
            label="Add Group"
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
