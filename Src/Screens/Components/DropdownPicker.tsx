import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SelectedModel} from '../models/SelectModel';
import {Modalize} from 'react-native-modalize';
import ContainerComponent from './ContainerComponent';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import {
  ArrowDown2,
  Check,
  CloseCircle,
  SearchNormal1,
} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {Portal} from 'react-native-portalize';
import InputComponent from './InputComponent';
import ButtonComponent from './ButtonComponent';
import SpaceComponent from './SpaceComponent';
import CarUserComponent from './CarUserComponent';
import {UserInfo} from '../Untils/UserInfo';
import {appInfo} from '../../Theme/appInfo';
import Entypo from 'react-native-vector-icons/Entypo';
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
  } = props;

  const [value, setValue] = useState('');
  const [backgroundUsers, setBackgroundUsers] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<any>([]);
  const modalizeRef = useRef<Modalize>(null);
  const [selectLeader, setSelectLeader] = useState<any>({});
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
          majoring={users.majorCategory??'chuyên ngành'}
          styles={{borderWidth: 0, gap: 20}}
          img={users.avatar}
        />
      </RowComponent>
    );
  };
  const renderHearder = () => {
    return (
      <RowComponent styles={localStyles.containerHeader}>
        <InputComponent
          value={value}
          onChange={e => setValue(e)}
          styles={{width: '90%'}}
          affix={<SearchNormal1 size={22} color={appColors.grey} />}
          placehold="Search..."
        />
        <ButtonComponent label="Cancel" onPress={onCloseModalize} styles={{}} />
       
      </RowComponent>
    );
  };

  const renderSelectedUsers = () => {
    if (isLeader || isDeputyLeader) {
      // Khi là Leader, chỉ hiển thị tên của leader đã chọn'
      const nameLeader: any = userName ? userName : placeHold;
      return (
        <TextComponent label={nameLeader} styles={{textAlign: 'center'}} />
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
    return <TextComponent label={placeHold} styles={{textAlign: 'center'}} />;
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={[localStyles.borderStyles, {}, styles]}
        onPress={onOpenModalize}>
        {renderSelectedUsers()}
        <ArrowDown2 size={22} color={appColors.grey} />
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight
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
    marginBottom:22
    
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 12,
  },
});
