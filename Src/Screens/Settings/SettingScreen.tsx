import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Sun,
  Moon,
  User,
  Lock,
  LogOut,
  Globe,
  HelpCircle,
  Trash,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {themeSelector, toggleTheme} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {userServices} from '../Services/userService';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import LoadingModal from '../Modal/LoadingModal';
import {ArrowLeft} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {SpaceComponent} from '../Components';

const SettingScreen = () => {
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);

  const [isDarkMode, setIsDarkMode] = useState(
    theme === 'light' ? false : true,
  );

  const dispatch = useDispatch();
  const colors = appColors[theme];
  const handleThemeToggle = async () => {
    setIsLoading(true);
    try {
      dispatch(toggleTheme());
      const res = await userServices.updateThemeforUser(
        auth.userId,
        theme === 'dark' ? 'light' : 'dark',
      );
      if (res && res.data) {
        console.log('res.data', res.data);
      }
      setIsDarkMode(!isDarkMode);
      setIsLoading(false);
    } catch (error) {
      console.log('Update state theme error: ', error);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  const confirmDeleteAccount = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa tài khoản không?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => console.log('Xóa tài khoản'),
      },
    ]);
  };

  const SettingItem = ({icon: Icon, label, onPress, rightComponent}: any) => (
    <TouchableOpacity
      style={[styles.settingItem, {backgroundColor: colors.card}]}
      onPress={onPress}>
      <View style={styles.itemLeft}>
        <Icon size={24} color={colors.icon} />
        <Text style={[styles.itemLabel, {color: colors.text}]}>{label}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ArrowLeft
        color={colors.icon}
        size={appInfo.sizeIconBold}
        onPress={() => navigation.goBack()}
      />
      <SpaceComponent height={16} />
      <Text style={[styles.header, {color: colors.text}]}>Cài đặt</Text>

      <SettingItem
        icon={User}
        label="Thông tin cá nhân"
        onPress={() => navigation.navigate('Profile')}
      />
      <SettingItem
        icon={isDarkMode ? Moon : Sun}
        label="Chế độ tối"
        rightComponent={
          <Switch value={isDarkMode} onValueChange={handleThemeToggle} />
        }
      />

      <SettingItem
        icon={Lock}
        label="Bảo mật & Mật khẩu"
        onPress={() => navigation.navigate('Security')}
      />

      <SettingItem
        icon={Globe}
        label="Ngôn ngữ"
        onPress={() => navigation.navigate('Language')}
      />

      <SettingItem
        icon={HelpCircle}
        label="Trợ giúp & Hỗ trợ"
        onPress={() => navigation.navigate('Help')}
      />

      <SettingItem
        icon={Trash}
        label="Xóa tài khoản"
        onPress={confirmDeleteAccount}
      />

      <SettingItem icon={LogOut} label="Đăng xuất" onPress={handleLogout} />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
});

export default SettingScreen;
