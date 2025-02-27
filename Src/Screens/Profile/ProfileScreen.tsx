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
import {profileSelector} from '../../redux/reducers/profileSlice';
import {eventSelector} from '../../redux/reducers/eventSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {friendSelector} from '../../redux/reducers/friendSlice';
const ProfileScreen = ({navigation}: any) => {
  const userData = useSelector(profileSelector);
  const eventData = useSelector(eventSelector);
  const friendData = useSelector(friendSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const userInfo = {
    stats: {
      friends: friendData && friendData.friends ? friendData.friends.length : 0,
      posts:
        eventData && eventData.eventShares ? eventData.eventShares.length : 0,
      likes: 230,
    },
  };


  const getEventShared = async () => {
    const res = await eventSevices.getEventShared(eventData.eventShares);
    if (res?.data) {
      console.log(res.data);
    }
  };

  const renderPost = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailEvent', {href: item.href})}
        style={[
          profileStyles.postContainer,
          {backgroundColor: colors.background},
        ]}
        key={index}>
        <Image source={{uri: item.urlImage}} style={profileStyles.postImage} />
        <TextComponent
          styles={profileStyles.postContent}
          label={item.content ? item.content : '...'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[profileStyles.container, {backgroundColor: colors.background}]}>
      <View
        style={[
          locastyles.header,
          {backgroundColor: theme === 'light' ? colors.card: colors.card},
        ]}>
        <ZoomImageComponent
          url={userData.avatar}
          styles={profileStyles.avatar}
        />
        <View style={[profileStyles.infoContainer]}>
          <TextComponent
            styles={[profileStyles.name]}
            label={UserInfo.getName(userData.name)}
          />
          <SpaceComponent height={6} />

          <TextComponent
            styles={[profileStyles.majoring, {marginLeft: 4}]}
            label={userData.majoring ?? 'Chuyên ngành'}
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
              label={userData.bio ?? 'Tiểu sử'}
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
              styles={{
                borderWidth: 0.5,
                padding: 6,
                borderRadius: 6,
                borderColor: colors.border,
              }}>
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
        <View style={[profileStyles.stat, {backgroundColor: colors.card}]}>
          <TextComponent
            label={userInfo.stats.friends}
            styles={profileStyles.statNumber}
          />
          <Text style={profileStyles.statLabel}>Friends</Text>
        </View>
        <View style={[profileStyles.stat, {backgroundColor: colors.card}]}>
          <TextComponent
            label={userInfo.stats.posts}
            styles={profileStyles.statNumber}
          />
          <Text style={profileStyles.statLabel}>Shares</Text>
        </View>
        <View style={[profileStyles.stat, {backgroundColor: colors.card}]}>
          <TextComponent
            label={userInfo.stats.likes.toString()}
            styles={profileStyles.statNumber}
          />

          <Text style={profileStyles.statLabel}>Likes</Text>
        </View>
      </View>

      {/* Recent Posts */}
      <TextComponent styles={profileStyles.sectionTitle} label="Recent Share" />
      <FlatList
        data={eventData.eventShares}
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

    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 12,
  },

  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: appColors.blue,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    gap: 10,
  },
});

export default ProfileScreen;
