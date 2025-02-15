import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {ArrowLeft, SearchNormal, UserMinus} from 'iconsax-react-native';
import {globalStyles} from '../../Styles/globalStyle';
import {HeaderComponent, RowComponent, TextComponent} from '../Components';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';

const FriendScreens = () => {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: '3',
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  ]);

  const renderFriendItem = ({item}: any) => (
    <View style={styles.friendItem}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>• Đang hoạt động</Text>
      </View>
      <TouchableOpacity style={styles.removeButton}>
        <UserMinus color="white" size={22} />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#E3F2FD', '#ffffff']}
      style={globalStyles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}

        <RowComponent>
          <ArrowLeft size={appInfo.sizeIconBold} color={appColors.blue} />
          <TextComponent label="Quản lí bạn bè" styles={styles.title} />
        </RowComponent>
        {/* Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <SearchNormal size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Tìm kiếm bạn bè..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Danh sách bạn bè */}
        <FlatList
          data={friends}
          keyExtractor={item => item.id}
          renderItem={renderFriendItem}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FriendScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    height: 45,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  friendStatus: {
    fontSize: 14,
    color: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
  },
});
