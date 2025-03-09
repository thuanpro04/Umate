import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {globalStyles} from '../../../Styles/globalStyle';
import {UserAdd} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appColors} from '../../../Theme/Colors/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Flag,
  MoreVertical,
  MoreVerticalIcon,
  ShieldOff,
  UserX,
} from 'lucide-react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {MenuChat} from '../../../data/MenuItems';
import {groupServices} from '../../Services/groupServices';
import {authSelector} from '../../../redux/reducers/authReducer';
import {Notification} from '../../Untils/Notification';
interface Props {
  userName: string;
  authori: string;
  url: string;
  addFriend?: Boolean;
  onPress?: () => void;
  onPressAdd?: () => void;
  bgColor?: string;
  icon?: ReactNode;
  onPressMore?: () => void;
  navigation?: any;
  userId: string;
  onPressUnFriend?: () => void;
  onPressBlock?: () => void;
  isBlock?: Boolean;
  menuData?: any[];
  leaderId?: string;
  onPressOutGroup?: () => void;
  onPressPosition?: () => void;
  deputyLeaderId?: string;
}
const CarUserComponent = (props: Props) => {
  const {
    userName,
    authori,
    url,
    addFriend,
    onPress,
    onPressAdd,
    bgColor,
    onPressMore,
    icon,
    navigation,
    userId,
    onPressUnFriend,
    onPressBlock,
    isBlock,
    menuData,
    leaderId,
    onPressOutGroup,
    onPressPosition,
    deputyLeaderId,
  } = props;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [isVisible, setisVisible] = useState(false);
  const auth = useSelector(authSelector);
  const showMenu = () => setisVisible(true);

  const hideMenu = () => {
    setisVisible(false);
  };

  const actionMenu = async (key: string) => {
    console.log(key);

    switch (key) {
      case 'report':
        navigation.navigate('ReportScreen', {name: userName, userId});
        break;
      case 'delete':
        if (onPressUnFriend) {
          hideMenu();
          await onPressUnFriend();
        }
        break;
      case 'block':
        if (onPressBlock) {
          hideMenu();
          await onPressBlock();
        }
        break;
      case 'addfriend':
        if (!addFriend) {
          console.log('Đã là bạn.');
          break;
        }
        onPressAdd && onPressAdd();
        break;
      case 'outgroup':
        if (leaderId === userId) {
          Notification.showSnackbar('Không thể kích trưởng nhóm');
          break;
        }
        onPressOutGroup && onPressOutGroup();
        break;
      case 'position':
        onPressPosition && onPressPosition();
        break;
    }
    setisVisible(false);
  };
  const renderMenu = () => {
    return (
      <MenuItem onPress={() => actionMenu('position')} style={styles.menuItem}>
        <Ionicons name="leaf-outline" color={'blue'} size={18} />
        <SpaceComponent width={6} />
        <TextComponent label={'Nhường chức'} styles={styles.menuText} />
      </MenuItem>
    );
  };
  return (
    <RowComponent
      styles={[
        styles.card,
        {
          backgroundColor: bgColor ? bgColor : 'transparent',
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
        },
      ]}>
      <RowComponent styles={{marginHorizontal: 8}}>
        <TouchableOpacity onPress={onPress}>
          <Image source={{uri: props.url}} style={globalStyles.userImg} />
        </TouchableOpacity>
        <View style={styles.main}>
          <TextComponent label={userName} styles={globalStyles.label} />
          <SpaceComponent height={6} />
          <TextComponent label={authori} styles={globalStyles.actionText} />
        </View>

        {icon && (
          <View style={{flex: 0}}>
            <Menu
              visible={isVisible}
              onRequestClose={hideMenu}
              anchor={
                <TouchableOpacity onPress={showMenu}>{icon}</TouchableOpacity>
              }
              style={{
                borderRadius: 16,
                paddingVertical: 8,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: {width: 0, height: 5},
                elevation: 5,
                backgroundColor: colors.background,
              }}>
              {menuData &&
                menuData.map((item, index) => {
                  return (
                    <View key={index} style={{}}>
                      <MenuItem
                        onPress={() => actionMenu(item.id)}
                        style={styles.menuItem}>
                        {item.icon}
                        <SpaceComponent width={6} />
                        <TextComponent
                          label={
                            item.id === 'block'
                              ? `${isBlock ? `Bỏ ${item.name}` : item.name}`
                              : item.name
                          }
                          styles={styles.menuText}
                        />
                      </MenuItem>
                      <MenuDivider />
                    </View>
                  );
                })}

              {addFriend && (
                <MenuItem
                  onPress={() => actionMenu('addfriend')}
                  style={styles.menuItem}>
                  <UserAdd color={'green'} size={18} />
                  <SpaceComponent width={6} />
                  <TextComponent label={'Thêm bạn'} styles={styles.menuText} />
                </MenuItem>
              )}

              {leaderId === auth.userId && renderMenu()}
              {deputyLeaderId === auth.userId && renderMenu()}

              {leaderId === userId ||
                (deputyLeaderId === auth.userId && (
                  <MenuItem
                    onPress={() => actionMenu('outgroup')}
                    style={styles.menuItem}>
                    <Ionicons name="cut-outline" color={'coral'} size={18} />
                    <SpaceComponent width={6} />
                    <TextComponent label={'Kích'} styles={styles.menuText} />
                  </MenuItem>
                ))}
            </Menu>
          </View>
        )}
      </RowComponent>
    </RowComponent>
  );
};

export default CarUserComponent;

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
  },
  main: {
    flex: 1,
  },

  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
