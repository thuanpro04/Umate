import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ArrowLeft2, UserEdit} from 'iconsax-react-native';
import {Repeat} from 'lucide-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {addEvent, eventSelector} from '../../redux/reducers/eventSlice';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import RenderPost from '../MyPost/Components/RenderPost';
import {postServices} from '../Services/postServices';
import {UserInfo} from '../Untils/UserInfo';
import {profileStyles} from './profileStyles';
import LoadingModal from '../Modal/LoadingModal';

const ProfileScreen = ({navigation}: any) => {
  const [isShowPost, setIsShowPost] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  const userData = useSelector(profileSelector);
  const eventData = useSelector(eventSelector);
  const friendData = useSelector(friendSelector);
  const profile = useSelector(profileSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const userInfo = {
    stats: {
      friends: friendData?.friends?.length ?? 0,
      posts: eventData?.eventShares?.length ?? 0,
      likes: profile?.myLove?.length ?? 0,
    },
  };

  const fetchMyPosts = useCallback(async () => {
    setIsLoading(true);
    const res = await postServices.getMyPost(auth.userId, auth.userId);
    if (res?.data) {
      console.log('Fetched my posts successfully:', res.data);
      setPosts(res.data);
    }
    setIsLoading(false);
  }, [auth.userId]);

  const fetchEventShares = useCallback(() => {
    const uniqueShares = eventData.eventShares.filter(
      (item: any, index: any, self: any) =>
        self.findIndex((e: any) => e._id === item._id) === index,
    );
    setPosts(uniqueShares);
  }, [eventData.eventShares]);

  const handleRemovePost = async (id: string, isShared: boolean) => {
    const service = isShared
      ? postServices.handleRemovePostShare
      : postServices.handleRemovePost;

    const res = await service(id, auth.userId);
    if (res?.data) {
      console.log('Post removed successfully:', res.data);
      // Tạo mảng cập nhật mới trước khi sử dụng
      const updatedPosts = posts.filter(post => post.postId !== id);

      // Cập nhật state local
      setPosts(updatedPosts);

      if (isShared) {
        const userData = await UserInfo.getUserData();

        // Đảm bảo event và eventShares tồn tại
        if (userData && userData.event) {
          // Sử dụng mảng đã cập nhật thay vì posts
          userData.event.eventShares = updatedPosts;
          console.log('updatedPosts', updatedPosts);

          await Promise.all([
            AsyncStorage.setItem('userData', JSON.stringify(userData)),
            // Đảm bảo không bao giờ truyền undefined vào action
            dispatch(addEvent({eventShares: updatedPosts} as any)),
          ]);
        }
      }
    }
  };
  const handleLikePost = async (id: string) => {
    const res = await postServices.handleLikePost(auth.userId, id);
    if (res && res.data) {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.postId === id) {
            const isLiked = post.likeCount.includes(auth.userId);
            return {
              ...post,
              likeCount: isLiked
                ? post.likeCount.filter((userId: any) => userId !== auth.userId)
                : [...post.likeCount, auth.userId],
            };
          }
          return post;
        }),
      );
      console.log('Like post successfully !!', res.data);
    }
  };
  const handleHidePostForUser = async (postId: string) => {
    setIsLoading(true);
    const res = await postServices.handleHidePost(
      auth.userId,
      postId,
      'personal',
    );
    if (res && res.data) {
      console.log('Hide post successfully !!', res.data);
      setPosts(res.data);
    }
    setIsLoading(false);
  };
  const handleUpdatePrivacy = async (postId: string, privacy: string) => {
    setIsLoading(true);
    const res = await postServices.handleUpdatePrivacy(postId, privacy);
    if (res && res.data) {
      console.log('Update privacy successfully !!!');
    }
    setIsLoading(false);
  };
  const renderPost = useCallback(
    ({item, index}: any) => {
      return (
        <>
          <RenderPost
            handleUpdatePrivacy={handleUpdatePrivacy}
            isPrivacy={isShowPost}
            isHide={item.hide?.includes(auth.userId)}
            handleHidePostForUser={() => handleHidePostForUser(item.postId)}
            handleRemovePost={() => handleRemovePost(item.postId, !isShowPost)}
            userId={item.userId}
            privacy={item.privacy}
            isFoot
            url={item.url}
            naviagtion={navigation}
            liked={item.likeCount?.includes(auth.userId)}
            id={item.postId}
            comments={item.commentCount}
            shares={item.shareCount}
            likes={item.likeCount}
            images={item.images}
            avatar={item.avatar ?? profile.avatar}
            name={item.name ?? profile.name}
            content={item.content}
            createdAt={item.createdAt}
            key={index}
            handleLikePost={() => handleLikePost(item.postId)}
            styleImage={{height: 220,}}
          />
          <SpaceComponent height={12} />
        </>
      );
    },
    [auth.userId, handleRemovePost, isShowPost, navigation, profile],
  );

  useEffect(() => {
    if (isShowPost) {
      fetchMyPosts();
    } else {
      fetchEventShares();
    }
  }, [isShowPost, fetchMyPosts, fetchEventShares]);

  return (
    <SafeAreaView
      style={[profileStyles.container, {backgroundColor: colors.background}]}>
      <View
        style={[
          locastyles.header,
          {
            backgroundColor: colors.card,
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
      <RowComponent styles={{justifyContent: 'flex-start', paddingRight: 32}}>
        <TextComponent
          styles={[profileStyles.sectionTitle, {flex: 1}]}
          label={isShowPost ? 'Bài đăng gần đây' : t('recently_share')}
        />
        <Repeat
          size={appInfo.sizeIcon}
          color={colors.icon}
          onPress={() => setIsShowPost(prev => !prev)}
        />
      </RowComponent>
      <SpaceComponent height={22} />
      <FlatList
        style={{flex: 1}}
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={profileStyles.postList}
      />
      <LoadingModal visible={isLoading} />
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
