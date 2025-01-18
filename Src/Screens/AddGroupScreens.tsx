import {View, Text, Image, StyleSheet, ScrollView, Modal} from 'react-native';
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
  const [groupInfo, setGroupInfo] = useState<any>({
    ...initValues,
    authorId: auth.userId,
    avatar: getAvatar(),
  });
  console.log('auth', auth);

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
        const data = res.map(({name, avatar, userId, majorCategory}: any) => ({
          name,
          avatar,
          userId,
          majorCategory,
        }));
        setUsers(data);
      }
    } catch (error) {
      console.error('Post event get users failed', error);
    }
  };
  function getAvatar() {
    const temp =
      'data:image/png;base64,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';
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
  console.log(groupInfo.avatar.name);

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
    console.log('data ne', dataGroup);

    return dataGroup;
  }
  const handleAddGroupUser = async () => {
    try {
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
  console.log('groupInfo', groupInfo);

  return (
    <ContainerComponent>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 color={appColors.blueBack} size={appInfo.sizeIconBold} />
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
          <View style={[globalStyles.overlay, {...localStyles.imgStyles}]}>
            <ButtonImagePicker
              multiple={false}
              icon={
                <Camera size={appInfo.sizeIconBold} color={appColors.grey} />
              }
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
              styles={globalStyles.inputRow}
              onPress={() => handleModal('groupName')}>
              <TextComponent
                label={groupInfo.groupName}
                color={appColors.grey}
              />
              <Edit2 color={appColors.blue2} size={appInfo.sizeIcon} />
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
                color={appColors.grey}
              />
              <Edit2 color={appColors.blue2} size={appInfo.sizeIcon} />
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
            styles={{paddingVertical: 8}}
          />
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
    </ContainerComponent>
  );
};

export default AddGroupScreens;
const localStyles = StyleSheet.create({
  container: {paddingHorizontal: 12},
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
