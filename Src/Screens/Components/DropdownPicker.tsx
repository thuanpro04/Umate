import {ArrowDown2, SearchNormal1} from 'iconsax-react-native';
import React, {useRef, useState} from 'react';
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {SelectedModel} from '../models/SelectModel';
import ButtonComponent from './ButtonComponent';
import CarUserComponent from './CarUserComponent';
import InputComponent from './InputComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {useTranslation} from 'react-i18next';
interface SelectedUser {
  name: string;
  data?: {
    userId?: any;
    avatar?: string;
    majorCategory?: string;
  };
}
interface Props {
  placeHold: string;
  users: SelectedModel[];
  onChangeValue: (
    key: string,
    val: {name: string | string[]; data?: any},
  ) => void;
  userSelected: SelectedUser[];
  nameField: string;
  isLeader?: boolean;
  styles?: StyleProp<ViewStyle>;
  userName?: string;
  isDeputyLeader?: boolean;
  color?: string;
}

const DropdownPicker = (props: Props) => {
  const {
    userName,
    placeHold,
    users,
    onChangeValue,
    userSelected,
    nameField,
    isLeader,
    isDeputyLeader,
    styles,
    color,
  } = props;

  const [value, setValue] = useState('');
  const [backgroundUsers, setBackgroundUsers] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<any>([]);
  const modalizeRef = useRef<Modalize>(null);
  const {t} = useTranslation();

  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const onOpenModalize = () => {
    if (!isLeader) {
      setTempSelectedUsers(
        userSelected.length > 0
          ? [
              ...new Map(
                userSelected.map((item: any) => [item.data.userId, item]),
              ).values(),
            ]
          : userSelected,
      );

      setBackgroundUsers(
        userSelected.length > 0 &&
          userSelected.reduce((acc: any, user: any) => {
            acc[user.data.userId] = true; // Đánh dấu người dùng đã được chọn
            return acc;
          }, {}),
      );
    }

    modalizeRef.current?.open();
  };

  const optionUsers = (
    key: any,
    name: any,
    avatar: any,
    majorCategory: any,
  ) => {
    const data: any = {userId: key, avatar, majorCategory};

    const userSelect = [{name, data}];
    if (isLeader) {
      setTempSelectedUsers(userSelect);
      // setSelectLeader(userSelect); // Cập nhật leader đã chọn
      onChangeValue('leader', {name, data});
      onCloseModalize();
    } else if (isDeputyLeader) {
      setTempSelectedUsers(userSelect);
      onChangeValue('deputyLeader', {name, data});
      onCloseModalize();
    } else {
      setBackgroundUsers(prev => ({
        ...prev,
        [key]: !prev[key],
      }));

      const userExists = tempSelectedUsers.find(
        (user: any) => user.data.userId === key,
      );
      let userSelect = [];
      if (userExists) {
        userSelect = tempSelectedUsers.filter(
          (x: any) => x.data.userId !== key,
        );
      } else {
        userSelect = [...tempSelectedUsers, {name, data}];
      }
      setTempSelectedUsers(userSelect);
    }
  };
  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };
  const renderFooter = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 22,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ButtonComponent
          type="primary"
          onPress={() => {
            // Loại bỏ các phần tử trùng lặp trước khi lưu
            const uniqueSelectedUsers: any = [
              ...new Map(
                tempSelectedUsers.map((item: any) => [item.data.userId, item]),
              ).values(),
            ];
            setSelectedUsers(uniqueSelectedUsers);
            onChangeValue(nameField ?? 'invitedUsers', uniqueSelectedUsers);
            onCloseModalize();
          }}
          label="Agree"
          styles={{paddingVertical: 4, width: '90%'}}
        />
      </View>
    );
  };
  const renderUsers = (item: any, index: number) => {
    const users = item.data ? item.data : item;
    return (
      <RowComponent
        key={index}
        onPress={() =>
          optionUsers(
            users.userId,
            item.name,
            users.avatar,
            users.majorCategory,
          )
        }
        styles={[
          localStyles.card,
          {paddingHorizontal: backgroundUsers[item.userId] ? 30 : 8},
        ]}>
        {backgroundUsers[item.userId] && (
          <Entypo
            name="check"
            size={appInfo.sizeIconBold}
            color={appColors.blue}
          />
        )}
        <CarUserComponent
          name={item.name}
          isFind
          majoring={users.majorCategory ?? t('majoring')}
          styles={{borderWidth: 0, gap: 20}}
          img={users.avatar}
        />
      </RowComponent>
    );
  };
  const renderHearder = () => {
    return (
      <RowComponent styles={[localStyles.containerHeader]}>
        <InputComponent
          value={value}
          onChange={e => setValue(e)}
          styles={{width: '90%', backgroundColor: colors.background}}
          affix={<SearchNormal1 size={22} color={appColors.grey} />}
          placehold={t('search')}
        />
        <ButtonComponent label={t('close')} onPress={onCloseModalize} styles={{}} />
      </RowComponent>
    );
  };

  const renderSelectedUsers = () => {
    if (isLeader || isDeputyLeader) {
      // Khi là Leader, chỉ hiển thị tên của leader đã chọn'
      const nameLeader: any = userName ? userName : placeHold;
      return (
        <TextComponent
          label={nameLeader}
          styles={{textAlign: 'center', color: color ?? colors.text}}
        />
      );
    } else {
      if (userSelected && userSelected.length > 0) {
        return userSelected.map((item: any, index: number) => (
          <TextComponent
            key={index}
            label={item.name}
            styles={{textAlign: 'center'}}
          />
        ));
      }
    }
    return (
      <TextComponent
        label={placeHold}
        styles={{textAlign: 'center', color: color ?? colors.text}}
      />
    );
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
      <TouchableOpacity
        style={[localStyles.borderStyles, {borderColor: colors.border}, styles]}
        onPress={onOpenModalize}>
        {renderSelectedUsers()}
        <ArrowDown2 size={22} color={appColors.grey} />
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight
          modalStyle={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
          }}
          HeaderComponent={renderHearder()}
          FooterComponent={!(isDeputyLeader || isLeader) && renderFooter()}>
          {users.map((item: any, index: number) => renderUsers(item, index))}
        </Modalize>
      </Portal>
    </View>
  );
};

export default DropdownPicker;

const localStyles = StyleSheet.create({
  borderStyles: {
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '90%',
  },
  containerHeader: {
    paddingHorizontal: 32,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 12,
  },
});
