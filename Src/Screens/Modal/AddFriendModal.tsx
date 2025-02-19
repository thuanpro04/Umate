import {
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {ButtonComponent, InputComponent, SpaceComponent} from '../Components';
import {SearchFavorite} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import CarUserComponent from '../Friends/Components/CarUserComponent';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import {searchServices} from '../Services/searchServices';
import {debounce} from 'lodash';
interface Props {
  userId: string;
  visible: Boolean;
  onClose: () => void;
  existingUser: any[];
  onPressInviteToGroup?: (selectUser: string[]) => void;
}
const AddFriendModal = (props: Props) => {
  const {userId, visible, onClose, existingUser, onPressInviteToGroup} = props;
  const [text, setText] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [bgUser, setBgUser] = useState<{[key: string]: Boolean}>({});
  const [selectUser, setSelectUser] = useState<string[]>([]);
  const modalizeRef = useRef<Modalize>(null);
  useEffect(() => {
    if (visible) {
      getFriendForUser();
      modalizeRef.current?.open();
    } else {
      onCloseModal();
    }
  }, [visible]);
  const onCloseModal = () => {
    modalizeRef.current?.close();
  };
  const onChangeBgUser = (key: string) => {
    setBgUser(prev => {
      const newBgUser = {
        ...prev,
        [key]: !prev[key],
      };

      // Sử dụng giá trị mới của `newBgUser[key]`
      if (selectUser.includes(key) && !newBgUser[key]) {
        setSelectUser(prevSelect => prevSelect.filter(id => id !== key));
      } else if (!selectUser.includes(key)) {
        setSelectUser(prevSelect => [...prevSelect, key]);
      }

      return newBgUser;
    });
  };
  const getFriendForUser = async () => {
    try {
      const res = await userServices.getEquestFriendUsers(userId, '');
      if (res) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const searchFriends = async (value: string) => {
    try {
      const res = await searchServices.findFriendForUser(userId, value);
      if (res && res.data) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.log('Find friends fail error: ', error);
    }
  };
  const debounceFindFriends = debounce(searchFriends, 300);

  const checkExistingUser = (userId: any) => {
    return existingUser.some(item => item.userId === userId);
  };
  const renderItemUser = ({item, index}: any) => {
    return index < 7 && checkExistingUser(item.userId) ? (
      <CarUserComponent
        key={index}
        onPress={() => onChangeBgUser(item.userId)}
        onPressAdd={() => {}}
        url={item.avatar}
        userName={UserInfo.getName(item.name)}
        bgColor={bgUser[item.userId] ? appColors.grey2 + '8C' : 'transparent'}
      />
    ) : (
      <SpaceComponent height={12} key={index} />
    );
  };

  useEffect(() => {
    debounceFindFriends(text);
    return () => debounceFindFriends.cancel();
  }, [text]);
  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        handlePosition="inside"
        onClose={onClose}
        adjustToContentHeight
        modalStyle={{
          paddingHorizontal: 12,
          paddingTop: StatusBar.currentHeight,
        }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <InputComponent
            value={text}
            onChange={setText}
            allowClear
            placehold="search friend"
            affix={
              <SearchFavorite size={appInfo.sizeIcon} color={appColors.blue} />
            }
          />
          <SpaceComponent height={14} />
          {allUsers.map((item, index) => renderItemUser({item, index}))}
          <ButtonComponent
            label="Mời vào nhóm"
            onPress={() => {
              onPressInviteToGroup &&
                selectUser.length > 0 &&
                onPressInviteToGroup(selectUser);
              onCloseModal();
              setSelectUser([]);
            }}
          />
          <SpaceComponent height={6} />
        </View>
      </Modalize>
    </Portal>
  );
};

export default AddFriendModal;

const styles = StyleSheet.create({});
