import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import React, {useCallback, useState} from 'react';
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
const initValues = {
  groupName: '',
  description: '',
  invitedUsers: [],
  authorId: '',
  leader: '',
  deputyLeader: '',
  avatar: '',
};
const AddGroupScreens = () => {
  const auth = useSelector(authSelector);
  const [visible, setVisible] = useState(false);
  const [nameField, setNameField] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState<any>([]);
  const [groupInfo, setGroupInfo] = useState<any>({
    ...initValues,
    authorId: auth.userID,
  });
  useFocusEffect(
    useCallback(() => {
      getAllUsers();
    }, []),
  );
  const getAllUsers = async () => {
    try {
      const res = await userServices.getEquestFriendUsers(auth.userID, '');
      if (res) {
        const data = res.map((user: any) => ({
          name: user.name,
          avatar: user.avatar,
          userID: user.userID,
          majorCategory: user.majorCategory,
        }));
        setUsers(data);
      }
    } catch (error) {
      console.log('Post event get users failed');
    }
  };
  const handleModal = (key: string) => {
    setNameField(key);
    setVisible(true);
  };
  const onCloseModal = () => {
    setVisible(false);
  };
  const onChangeGroupInfo = async (
    key: string,
    value: {name: string | string[]; data?: any} | string,
  ) => {
    console.log(key, value);
    setGroupInfo({...groupInfo, [key]: value});
    setRefreshKey(prevKey => prevKey + 1);
    console.log(groupInfo);
  };
  const handleSelected = async (val: ImageOrVideo) => {
    try {
      const filePath = val.path;
      const fileName = filePath.split('/').pop();
      const path = `avatars/${fileName}`;
      const urlImage = await imageService.uploadImageToFirebase(filePath, path);
      onChangeGroupInfo('avatar', {
        name: urlImage,
        data: {userID: auth.userID},
      });
    } catch (error) {
      console.log('upload failed', error);
    }
  };
  console.log(groupInfo);

  return (
    <ContainerComponent isScroll key={refreshKey}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 color={appColors.blueBack} size={appInfo.sizeIconBold} />
        }
        title="Add Group"
      />
      <View style={localStyles.containerImages}>
        <Image
          source={{
            uri:
              groupInfo.avatar.name ??
              'data:image/jpeg;base64,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',
          }}
          resizeMode="cover"
          style={[localStyles.imgStyles, {zIndex: -1}]}
        />
        <View style={[globalStyles.overlay, {...localStyles.imgStyles}]}>
          <ButtonImagePicker
            multiple={false}
            icon={<Camera size={appInfo.sizeIconBold} color={appColors.grey} />}
            onSelect={x => {
              x.type === 'url'
                ? onChangeGroupInfo('avatar', {
                    name: x.value.toString().trim(),
                    data: {userID: auth.userID},
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
            <TextComponent label={groupInfo.groupName} color={appColors.grey} />
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
          <TextComponent label={'Invited users'} styles={globalStyles.label} />
          <SpaceComponent height={10} />
          <DropdownPicker
            placeHold="Selected"
            users={users}
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
            styles={{width: '85%'}}
          />
        </View>
        <SpaceComponent height={20} />
        <View>
          <TextComponent label="DeputyLeader" styles={globalStyles.label} />
          <SpaceComponent height={10} />
          <DropdownPicker
            placeHold="Select Deputy Leader"
            users={[]}
            onChangeValue={onChangeGroupInfo}
            userSelected={[]}
            nameField="deputyLeader"
            isLeader
            styles={{width: '80%'}}
          />
        </View>
        <SpaceComponent height={30} />
        <ButtonComponent
          type="primary"
          onPress={() => {}}
          label="Agree"
          styles={{paddingVertical: 8}}
        />
      </View>
      <SpaceComponent height={50} />
      <AddGroupModal
        nameField={nameField}
        onChangeGroup={onChangeGroupInfo}
        isVisible={visible}
        onClose={onCloseModal}
      />
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
