import React from 'react';
import {
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Smartphone, LogOut, Trash2} from 'lucide-react-native';
import {View} from 'react-native';
import {SpaceComponent, TextComponent} from '../Components';

const SecurityScreen = ({navigation}: any) => {
  const SecurityOption = ({icon: Icon, title, description, onPress}: any) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <View style={{marginRight: 16}}>
          <Icon size={28} color="#4F46E5" />
        </View>
        <View style={{flex: 1}}>
          <TextComponent
            label={title}
            styles={{fontSize: 16, fontWeight: '600', marginBottom: 4}}
          />
          
          <TextComponent
            label={description}
            styles={{fontSize: 14, color: '#6B7280'}}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView
      style={{padding: 16, marginTop: StatusBar.currentHeight, flex: 1}}>
      <TextComponent label="🔒 Cài đặt Bảo mật" />
      <SpaceComponent height={12} />
      <SecurityOption
        icon={Smartphone}
        title="Thiết bị & Phiên đăng nhập"
        description="Xem và quản lý các thiết bị đang đăng nhập"
        onPress={() => navigation.navigate('LoginSessions')}
      />

      <SecurityOption
        icon={LogOut}
        title="Đăng xuất khỏi tất cả thiết bị"
        description="Bảo vệ tài khoản bằng cách đăng xuất khỏi mọi thiết bị"
        onPress={() =>
          Alert.alert('Xác nhận', 'Đăng xuất khỏi tất cả thiết bị?', [
            {text: 'Hủy', style: 'cancel'},
            {text: 'Xác nhận', onPress: () => {}},
          ])
        }
      />

      <SecurityOption
        icon={Trash2}
        title="Xóa tài khoản"
        description="Xóa tài khoản và dữ liệu khỏi hệ thống"
        onPress={() =>
          Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa tài khoản?', [
            {text: 'Hủy', style: 'cancel'},
            {text: 'Xóa', style: 'destructive', onPress: () => {}},
          ])
        }
      />
    </ScrollView>
  );
};

export default SecurityScreen;
