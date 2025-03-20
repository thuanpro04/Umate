import {UserAdd} from 'iconsax-react-native';
import React, {ReactNode, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {globalStyles} from '../../../Styles/globalStyle';
import {appColors} from '../../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';

import {useTranslation} from 'react-i18next';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {authSelector} from '../../../redux/reducers/authReducer';
import {Notification} from '../../Untils/Notification';
import FastImage from 'react-native-fast-image';

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
  isBorder?: boolean;
  onNavigationPersonal?: () => void;
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
    onNavigationPersonal,
    isBorder,
  } = props;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [isVisible, setisVisible] = useState(false);
  const auth = useSelector(authSelector);
  const showMenu = () => setisVisible(true);
  const {t} = useTranslation();

  const hideMenu = () => {
    setisVisible(false);
  };

  const actionMenu = async (key: string) => {
    console.log(key);

    switch (key) {
      case 'report':
        hideMenu();
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
      case 'personal':
        console.log('Hello');
        onNavigationPersonal && onNavigationPersonal();
        break;
    }
    setisVisible(false);
  };

  const renderMenu = () => {
    return (
      <MenuItem onPress={() => actionMenu('position')} style={styles.menuItem}>
        <Ionicons name="leaf-outline" color={'blue'} size={18} />
        <SpaceComponent width={6} />
        <TextComponent label={t('transfer_role')} styles={styles.menuText} />
      </MenuItem>
    );
  };
  const isCurrentUserLeader = auth.userId === leaderId;
  const isCurrentUserDeputy = auth.userId === deputyLeaderId;

  // Kiểm tra xem người dùng đang xem có phải là leader hay không
  const isUserLeader = userId === leaderId;

  // Kiểm tra xem có thể chuyển chức cho người dùng này hay không
  const canTransferPosition =
    (isCurrentUserLeader || isCurrentUserDeputy) && leaderId !== userId;

  // Kiểm tra xem có thể kích người dùng này khỏi nhóm hay không
  const canRemoveFromGroup =
    (isCurrentUserLeader || (isCurrentUserDeputy && !isUserLeader)) &&
    auth.userId !== userId;

  return (
    <RowComponent
      styles={[
        styles.card,
        {
          backgroundColor: bgColor ? bgColor : 'transparent',
          borderColor: colors.border,
          borderWidth: isBorder ? 0 : 1,
          borderRadius: 12,
        },
      ]}>
      <RowComponent styles={{marginHorizontal: 8}}>
        <TouchableOpacity onPress={onPress}>
          <FastImage
            source={{
              uri: props.url,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={globalStyles.userImg}
          />
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
                        <SpaceComponent width={12} />
                        <TextComponent
                          label={
                            item.id === 'block'
                              ? `${isBlock ? `${t('unblock')}` : t(item.name)}`
                              : t(item.name)
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
                  <TextComponent
                    label={t('add_friend')}
                    styles={styles.menuText}
                  />
                </MenuItem>
              )}

              {canTransferPosition && (
                <MenuItem
                  onPress={() => actionMenu('position')}
                  style={styles.menuItem}>
                  <Ionicons name="leaf-outline" color={'blue'} size={18} />
                  <SpaceComponent width={6} />
                  <TextComponent
                    label={t('transfer_role')}
                    styles={styles.menuText}
                  />
                </MenuItem>
              )}

              {/* Hiển thị menu kích người khỏi nhóm nếu:
                  - Người dùng hiện tại là leader: có thể kích bất kỳ ai (trừ chính mình)
                  - Người dùng hiện tại là deputy: có thể kích bất kỳ ai NGOẠI TRỪ leader */}
              {canRemoveFromGroup && (
                <MenuItem
                  onPress={() => actionMenu('outgroup')}
                  style={styles.menuItem}>
                  <Ionicons name="cut-outline" color={'coral'} size={18} />
                  <SpaceComponent width={6} />
                  <TextComponent
                    label={t('remove_from_group')}
                    styles={styles.menuText}
                  />
                </MenuItem>
              )}
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
