import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {userServices} from '../Services/userService';
import CarUserComponent from '../Friends/Components/CarUserComponent';
import {MoreVerticalIcon} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {SearchNormal1} from 'iconsax-react-native';
import {debounce} from 'lodash';
interface Props {
  visible: boolean;
  attendId: any[];
  onClose: () => void;
  navigation: any;
}
const AttendedModal = (props: Props) => {
  const {visible, attendId, onClose, navigation} = props;
  const modalRef = useRef<Modalize>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [value, setValue] = useState('');
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  function onOpenModal() {
    modalRef.current?.open();
  }

  const getUserInfo = async () => {
    if (attendId.length === 0) {
      return;
    }
    const res = await userServices.getListUserInfo(attendId);
    if (res && res.data) {
      console.log('Get user info successfully', res.data);
      setUsers(res.data);
      setUserInfo(res.data);
    }
   
  };
  useEffect(() => {
    if (visible) {
      onOpenModal();
      getUserInfo();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);
  useEffect(() => {
    const debounceSearch = debounce(() => {
      setUserInfo(
        users.filter(item =>
          item.name.toLowerCase().includes(value.trim().toLowerCase()),
        ),
      );
    }, 300);
    debounceSearch();
    return () => debounceSearch.cancel(); // Cleanup debounce khi component unmount
  }, [value, users]);

  const renderItems = () => {
    return (
      userInfo &&
      userInfo.map((item, index) => (
        <CarUserComponent
          isBorder
          onPress={() => {
            onClose();
            navigation.navigate('PersonalScreen', {userId: item.userId});
          }}
          key={index}
          userId={item.userId}
          authori={item.majoring ?? t('majoring')}
          userName={item.name}
          url={item.avatar}
        />
      ))
    );
  };
  const renderHearder = () => {
    return (
      <InputComponent
        value={value}
        onChange={e => setValue(e)}
        styles={{
          width: '100%',
          backgroundColor: colors.background,
          paddingVertical: 4,
        }}
        affix={<SearchNormal1 size={22} color={appColors.grey} />}
        placehold={t('search')}
      />
    );
  };
  return (
    <Portal>
      <Modalize
        ref={modalRef}
        handlePosition="inside"
        adjustToContentHeight
        modalStyle={{
          backgroundColor: colors.background,
          paddingHorizontal: 14,
          paddingVertical: StatusBar.currentHeight,
          minHeight: 220,
        }}
        onClose={onClose}>
        <View style={{flex: 1}}>
          {renderHearder()}
          <SpaceComponent height={20} />
          <RowComponent>
            <TextComponent label={t('not_attended')} title />
            <TextComponent label={users.length.toString()} title />
          </RowComponent>
          {renderItems()}
        </View>
      </Modalize>
    </Portal>
  );
};

export default AttendedModal;

const localStyle = StyleSheet.create({
  containerHeader: {
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
