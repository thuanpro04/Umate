import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
} from 'react-native';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {ButtonComponent} from '../Components';
import {profileStyles} from './profileStyles';

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
          <Text style={[profileStyles.name, {color: '#333'}]}>{auth.name}</Text>
          <Text style={[profileStyles.majoring,{color: '#666',}]}>{auth.majoring}</Text>
          <Text style={[profileStyles.bio,{color: '#555',}]}>{userInfo.bio}</Text>
          <TouchableOpacity
            style={locastyles.editButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text style={profileStyles.editButtonText}>Edit Profile</Text>
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
          <Text style={profileStyles.statLabel}>Posts</Text>
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
  },
 


  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'coral',
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default ProfileScreen;
