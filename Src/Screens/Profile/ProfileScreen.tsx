import { UserEdit } from 'iconsax-react-native';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { appColors } from '../../Theme/Colors/appColors';
import { appInfo } from '../../Theme/appInfo';
import { authSelector } from '../../redux/reducers/authReducer';
import { RowComponent, TextComponent } from '../Components';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import { UserInfo } from '../Untils/UserInfo';
import { profileStyles } from './profileStyles';
const ProfileScreen = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const userInfo = {
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    majoring: 'johndoe@gmail.com',
    bio: 'Loving life, learning every day!',
    stats: {
      friends: 120,
      posts: 45,
      likes: 230,
    },
    recentPosts: [
      {
        id: '1',
        content: 'Had an amazing day!',
        image: 'https://via.placeholder.com/200',
      },
      {
        id: '2',
        content: 'Exploring new places.',
        image: 'https://via.placeholder.com/200',
      },
      {
        id: '3',
        content: 'React Native is awesome!',
        image: 'https://via.placeholder.com/200',
      },
    ],
  };

  const renderPost = ({item}: any) => (
    <View style={profileStyles.postContainer}>
      <Image source={{uri: item.image}} style={profileStyles.postImage} />
      <Text style={profileStyles.postContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={profileStyles.container}>
      <View style={locastyles.header}>
        <ZoomImageComponent url={auth.avatar} styles={profileStyles.avatar} />
        <View style={profileStyles.infoContainer}>
          <RowComponent>
            <TextComponent
              styles={[profileStyles.name, {color: '#333'}]}
              label={UserInfo.getName(auth.name)}
            />
            {/* <TouchableOpacity
              onPress={() => console.log('Đang quét')}
              style={{
                padding: 6,
                borderWidth: 1,
                borderColor: appColors.blue,
                borderRadius: 4,
              }}>
              <MaterialCommunityIcons name='qrcode' color={appColors.blue} size={appInfo.sizeIcon} />
            </TouchableOpacity> */}
          </RowComponent>

          <TextComponent
            styles={[profileStyles.bio, {color: '#555'}]}
            label={auth.bio ?? 'Tiểu sử'}
          />
          <TextComponent
            styles={[profileStyles.majoring, {color: '#666'}]}
            label={auth.majoring ?? 'Chuyên ngành'}
          />

          <TouchableOpacity
            style={locastyles.editButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <UserEdit color={appColors.white} size={appInfo.sizeIcon} />
            <TextComponent
              styles={profileStyles.editButtonText}
              label="Edit Profile"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={profileStyles.statsContainer}>
        <View style={profileStyles.stat}>
          <Text style={profileStyles.statNumber}>{userInfo.stats.friends}</Text>
          <Text style={profileStyles.statLabel}>Friends</Text>
        </View>
        <View style={profileStyles.stat}>
          <Text style={profileStyles.statNumber}>{userInfo.stats.posts}</Text>
          <Text style={profileStyles.statLabel}>Shares</Text>
        </View>
        <View style={profileStyles.stat}>
          <Text style={profileStyles.statNumber}>{userInfo.stats.likes}</Text>
          <Text style={profileStyles.statLabel}>Likes</Text>
        </View>
      </View> 

      {/* Recent Posts */}
      <Text style={profileStyles.sectionTitle}>Recent Posts</Text>
      <FlatList
        data={userInfo.recentPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={profileStyles.postList}
      />
    </SafeAreaView>
  );
};

const locastyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 12,
  },

  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'coral',
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    gap: 10,
  },
});

export default ProfileScreen;
