import {UserEdit} from 'iconsax-react-native';
import React, {useCallback} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import {UserInfo} from '../Untils/UserInfo';
import {profileStyles} from './profileStyles';
import {eventSevices} from '../Services/eventService';
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {globalStyles} from '../../Styles/globalStyle';
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

  const getEventShared = async () => {
    const res = await eventSevices.getEventShared(auth.eventShares);
    if (res?.data) {
      console.log(res.data);
    }
  };

  const renderPost = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailEvent', {href: item.href})}
        style={profileStyles.postContainer}
        key={index}>
        <Image source={{uri: item.urlImage}} style={profileStyles.postImage} />
        <Text style={profileStyles.postContent}>
          {item.content ? item.content : '...'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <View style={locastyles.header}>
        <ZoomImageComponent url={auth.avatar} styles={profileStyles.avatar} />
        <View style={profileStyles.infoContainer}>
          
            <TextComponent
              styles={[profileStyles.name, {color: '#333'}]}
              label={UserInfo.getName(auth.name)}
            />
          <SpaceComponent height={6} />

          <TextComponent
            styles={[profileStyles.majoring, {color: '#333', marginLeft: 4}]}
            label={auth.majoring ?? 'Chuyên ngành'}
          />
          <SpaceComponent height={6} />
          <RowComponent>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/18499/18499153.png',
              }}
              style={[globalStyles.iconImage]}
            />
            <TextComponent
              styles={[profileStyles.bio, {color: '#888', flex: 1}]}
              label={auth.bio ?? 'Tiểu sử'}
              numberOfLine={5}
            />
          </RowComponent>
          <SpaceComponent height={6} />
          <RowComponent>
            <TouchableOpacity
              style={locastyles.editButton}
              onPress={() => navigation.navigate('EditProfile')}>
              <UserEdit color={appColors.white} size={appInfo.sizeIcon} />
              <TextComponent
                styles={profileStyles.editButtonText}
                label="Edit Profile"
              />
            </TouchableOpacity>
            <ButtonComponent
              type="action"
              onPress={() => navigation.navigate('UserQRCode')}
              styles={{borderWidth: 0.5, padding: 6, borderRadius: 6}}>
              <MaterialIcons
                name="qr-code-scanner"
                size={appInfo.sizeIconBold}
                color={appColors.blue}
              />
            </ButtonComponent>
          </RowComponent>
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
      <Text style={profileStyles.sectionTitle}>Recent Share</Text>
      <FlatList
        data={auth.eventShares}
        renderItem={renderPost}
        inverted
        keyExtractor={item => item._id}
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
