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
import {themeSelector} from '../../redux/reducers/themeSlice';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
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
  const {t} = useTranslation();

  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
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
    const res = await userServices.getEquestFriendUsers(userId, '');
    if (res) {
      setAllUsers(res.data.users);
    }
    
  };
  const searchFriends = async (value: string) => {
    const res = await searchServices.findFriendForUser(userId, value);
    if (res && res.data) {
      setAllUsers(res.data);
    }
 
  };
  const debounceFindFriends = debounce(searchFriends, 300);

  const renderItemUser = ({item, index}: any) => {
    return index < 7 && !existingUser.includes(item.userId) ? (
      <CarUserComponent
        userId={item.userId}
        authori={item.majoring ?? t('majoring')}
        key={index}
        onPress={() => onChangeBgUser(item.userId)}
        onPressAdd={() => {}}
        url={item.avatar}
        userName={item.name}
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
          backgroundColor: colors.background,
        }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <InputComponent
            value={text}
            onChange={setText}
            allowClear
            placehold={t('search_friend')}
            affix={
              <SearchFavorite size={appInfo.sizeIconBold} color={colors.icon} />
            }
          />
          <SpaceComponent height={6} />
          {allUsers.map((item, index) => renderItemUser({item, index}))}
          <ButtonComponent
            label={t('invite_group')}
            onPress={() => {
              if (onPressInviteToGroup && selectUser.length > 0) {
                onPressInviteToGroup(selectUser);
                onCloseModal();
                setSelectUser([]);
              }
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
