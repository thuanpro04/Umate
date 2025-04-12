import {ArrowLeft2, UserEdit} from 'iconsax-react-native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {eventSelector} from '../../redux/reducers/eventSlice';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import {profileStyles} from './profileStyles';
import {use} from 'i18next';
import RenderPost from '../MyPost/Components/RenderPost';
import {authSelector} from '../../redux/reducers/authReducer';
const ProfileScreen = ({navigation}: any) => {
  const userData = useSelector(profileSelector);
  const eventData = useSelector(eventSelector);
  const friendData = useSelector(friendSelector);
  const profile = useSelector(profileSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const auth = useSelector(authSelector);
  const {t} = useTranslation();
  const userInfo = {
    stats: {
      friends: friendData?.friends?.length ?? 0,
      posts: eventData?.eventShares?.length ?? 0,
      likes: profile?.myLove?.length ?? 0,
    },
  };
  const renderPost = useCallback(
    ({item, index}: any) => {
      console.log(index, item);

      return (
        <RenderPost
          privacy={item.privacy}
          isFoot
          url={item.url}
          naviagtion={navigation}
          liked={item.likes?.includes(auth.userId)}
          id={item.id}
          comments={item.comments}
          shares={item.shares}
          likes={item.likes}
          images={item.images}
          avatar={item.avatar}
          name={item.name}
          content={item.content}
          createdAt={item.createdAt}
          key={index}
          handleLikePost={() => {}}
          styleImage={{height: 220, width: '80%'}}
        />
      );
    },
    [eventData],
  );

  const uniqueEventShares = eventData.eventShares.filter(
    (item: any, index: any, self: any) =>
      self.findIndex((e: any) => e._id === item._id) === index,
  );

  return (
    <SafeAreaView
      style={[profileStyles.container, {backgroundColor: colors.background}]}>
      <View
        style={[
          locastyles.header,
          {
            backgroundColor: theme === 'light' ? colors.card : colors.card,
            paddingHorizontal: 12,
          },
        ]}>
        <View>
          <ArrowLeft2
            size={appInfo.sizeIconBold}
            color={colors.icon}
            style={{position: 'absolute', top: '-22%'}}
            onPress={() => navigation.goBack()}
          />
          <ZoomImageComponent
            url={userData.avatar}
            styles={profileStyles.avatar}
          />
        </View>
        <View style={[profileStyles.infoContainer]}>
          <TextComponent styles={[profileStyles.name]} label={userData.name} />
          <SpaceComponent height={6} />

          <TextComponent
            styles={[profileStyles.majoring, {marginLeft: 4}]}
            label={userData.majoring ?? t('majoring')}
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
              label={userData.bio ?? 'bio'}
              numberOfLine={3}
            />
          </RowComponent>
          <SpaceComponent height={6} />
          <RowComponent styles={{paddingHorizontal: 12}}>
            <TouchableOpacity
              style={[locastyles.editButton, {flex: 1}]}
              onPress={() => navigation.navigate('EditProfile')}>
              <UserEdit color={appColors.white} size={appInfo.sizeIcon} />
              <TextComponent
                styles={profileStyles.editButtonText}
                label={t('edit_profile')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('UserQRCode')}
              style={{
                borderWidth: 0.5,
                padding: 6,
                borderRadius: 6,
                borderColor: colors.border,
                marginTop: 10,
              }}>
              <MaterialIcons
                name="qr-code-scanner"
                size={appInfo.sizeIconBold}
                color={appColors.blue}
              />
            </TouchableOpacity>
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
          <TextComponent label={t('friend')} styles={profileStyles.statLabel} />
        </View>
        <View style={[profileStyles.stat, {backgroundColor: colors.card}]}>
          <TextComponent
            label={userInfo.stats.posts}
            styles={profileStyles.statNumber}
          />
          <TextComponent label={t('share')} styles={profileStyles.statLabel} />
        </View>
        <View style={[profileStyles.stat, {backgroundColor: colors.card}]}>
          <TextComponent
            label={userInfo.stats.likes.toString()}
            styles={profileStyles.statNumber}
          />
          <TextComponent label={t('like')} styles={profileStyles.statLabel} />
        </View>
      </View>

      {/* Recent Posts */}
      <TextComponent
        styles={profileStyles.sectionTitle}
        label={t('recently_share')}
      />
      <FlatList
        style={{flex: 1}}
        data={uniqueEventShares}
        renderItem={renderPost}
        keyExtractor={(item, index) => item._id.toString()}
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
