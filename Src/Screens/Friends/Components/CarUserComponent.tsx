import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {globalStyles} from '../../../Styles/globalStyle';
import {UserAdd} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appColors} from '../../../Theme/Colors/appColors';
import {
  Flag,
  MoreVertical,
  MoreVerticalIcon,
  ShieldOff,
  UserX,
} from 'lucide-react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
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
  } = props;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [isVisible, setisVisible] = useState(false);

  const showMenu = () => setisVisible(true);

  const hideMenu = () => {
    setisVisible(false);
  };
  const actionMenu = async (key: string) => {
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
      default:
        if (onPressBlock) {
          hideMenu();
          await onPressBlock();
        }

        break;
    }
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
      <RowComponent onPress={onPress} styles={{marginHorizontal: 8}}>
        <Image source={{uri: props.url}} style={globalStyles.userImg} />
        <View style={styles.main}>
          <TextComponent label={userName} styles={globalStyles.label} />
          <SpaceComponent height={6} />
          <TextComponent label={authori} styles={globalStyles.actionText} />
        </View>
        {addFriend && (
          <UserAdd
            size={appInfo.sizeIconBold}
            color={colors.icon}
            onPress={onPressAdd}
          />
        )}
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
              <MenuItem
                onPress={() => actionMenu('report')}
                style={styles.menuItem}>
                <Flag color={'red'} size={18} />
                <SpaceComponent width={6} />
                <TextComponent label="Báo cáo" styles={styles.menuText} />
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onPress={() => actionMenu('delete')}
                style={styles.menuItem}>
                <UserX color={'yellow'} size={18} />
                <SpaceComponent width={6} />

                <TextComponent label="Xóa bạn" styles={styles.menuText} />
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onPress={() => actionMenu('block')}
                style={styles.menuItem}>
                <ShieldOff color={'green'} size={18} />
                <SpaceComponent width={6} />
                {isBlock ? (
                  <TextComponent label="Bỏ chặn" styles={styles.menuText} />
                ) : (
                  <TextComponent label="Chặn" styles={styles.menuText} />
                )}
              </MenuItem>
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
  menuStyle: {
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
