import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useRef, useState} from 'react';
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

interface Props {
  placeHold: string;
  users: SelectedModel[];
  onChangeValue: (
    key: string,
    val: {name: string | string[]; data?: any},
  ) => void;
  userSelected: SelectedModel[];
  nameField?: string;
  isLeader?: boolean;
  styles?: StyleProp<ViewStyle>;
}

const DropdownPicker = (props: Props) => {
  const {
    placeHold,
    users,
    onChangeValue,
    userSelected,
    nameField,
    isLeader,
    styles,
  } = props;
  console.log('userSelected', userSelected);

  const [value, setValue] = useState('');
  const [backgroundUsers, setBackgroundUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<any>([]); // Temp state for selections
  const modalizeRef = useRef<Modalize>(null);

  const onOpenModalize = () => {
    // Khi mở modal, đồng bộ `backgroundUsers` từ `selectedUsers`
    setTempSelectedUsers(selectedUsers);
    setBackgroundUsers(
      selectedUsers.reduce((acc: any, user: any) => {
        acc[user.userID] = true; // Đánh dấu người dùng đã được chọn
        return acc;
      }, {}),
    );
    modalizeRef.current?.open();
  };

  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };

  

  const optionUsers = (
    key: any,
    name: any,
    avatar: any,
    majorCategory: any,
  ) => {
    const data = { userID: key, avatar, majorCategory };

    if (isLeader) {
      // Cập nhật backgroundUsers và chỉ chọn một leader
      setBackgroundUsers((prev) => {
        const newBackgroundUsers: any = {};
        // Đặt tất cả giá trị thành false, chỉ chọn người leader
        Object.keys(prev).forEach((userID) => {
          newBackgroundUsers[userID] = false;
        });
        newBackgroundUsers[key] = true; // Đánh dấu người leader là true
        return newBackgroundUsers;
      });

      // Cập nhật danh sách người được chọn chỉ với leader
      const userSelect = [{ name, data }];
      setTempSelectedUsers(userSelect);

      // Gửi giá trị của leader nếu cần
      onChangeValue(nameField ?? 'leader', { name, data });

      // Nếu modal được mở thì không đóng khi chọn leader
      if (modalizeRef.current) {
        modalizeRef.current.open();
      }

    } else {
      // Cập nhật trạng thái chọn người dùng
      setBackgroundUsers((prev) => ({
        ...prev,
        [key]: !prev[key], // Toggle trạng thái chọn hoặc bỏ chọn
      }));

      // Tránh trùng lặp khi thêm người vào danh sách
      const userExists = tempSelectedUsers.find((user: any) => user.userID === key);
      let userSelect = [];

      if (userExists) {
        // Nếu đã chọn thì bỏ chọn (remove from list)
        userSelect = tempSelectedUsers.filter((x: any) => x.userID !== key);
      } else {
        // Nếu chưa chọn thì thêm vào danh sách (add to list)
        userSelect = [...tempSelectedUsers, { name, data }];
      }                     

      // Cập nhật lại danh sách người dùng đã chọn
      setTempSelectedUsers(userSelect);
    }
  };
  const renderUsers = (item: any, index: number) => {
    return (
      <RowComponent
        key={index}
        onPress={() =>
          optionUsers(item.userID, item.name, item.avatar, item.majorCategory)
        }
        styles={{
          justifyContent: 'center',
          paddingHorizontal: backgroundUsers[item.userID] ? 30 : 8,
          alignItems: 'center',
          flex: 1,
        }}>
        {backgroundUsers[item.userID] && (
          <Entypo
            name="check"
            size={appInfo.sizeIconBold}
            color={appColors.blue}
          />
        )}
        <CarUserComponent
          name={item.name}
          isFind
          majoring={item.majorCategory}
          styles={{borderWidth: 0, gap: 20}}
          img={item.avatar}
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
          styles={{width: '90%', paddingVertical: 6}}
          affix={<SearchNormal1 size={22} color={appColors.grey} />}
          placehold="Search..."
        />
        <ButtonComponent
          label="Cancel"
          onPress={onCloseModalize}
          styles={{paddingVertical: 6}}
        />
      </RowComponent>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{paddingHorizontal: 20, paddingBottom: 30}}>
        <ButtonComponent
          type="primary"
          onPress={() => {
            setSelectedUsers(tempSelectedUsers); // Confirm selections
            onChangeValue(nameField ?? 'invitedUsers', tempSelectedUsers);
            onCloseModalize();
          }}
          label="Agree"
          styles={{paddingVertical: 6}}
        />
      </View>
    );
  };
  console.log('item', tempSelectedUsers);

  const renderSelectedUsers = (item: any, index: number) => {
    
    return (
      <TextComponent
        key={index}
        label={item.name}
        styles={{textAlign: 'center'}}
      />
    );
  };
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={[localStyles.borderStyles, {}, styles]}
        onPress={onOpenModalize}>
        {userSelected.length > 0 ? (
          userSelected.map((item: any, index: number) =>
            renderSelectedUsers(item, index),
          )
        ) : (
          <RowComponent>
            <TextComponent
              label={placeHold}
              flex={1}
              styles={{textAlign: 'center'}}
            />
            <ArrowDown2 size={22} color={appColors.grey} />
          </RowComponent>
        )}
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalHeight={650}
          HeaderComponent={renderHearder()}
          FooterComponent={renderFooter()}>
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
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
