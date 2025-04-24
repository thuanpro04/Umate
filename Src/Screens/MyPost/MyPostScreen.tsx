import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import {postServices} from '../Services/postServices';
import RenderPost from './Components/RenderPost';

const MyPostScreen = ({navigation}: any) => {
  const route = useRoute();
  let notifiPostId =
    (route.params as {notifiPostId?: string})?.notifiPostId ?? null;
  const [scrollToPostId, setScrollToPostId] = useState<string | null>(
    notifiPostId,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limitPage, setLimitPage] = useState(1);
  const profile = useSelector(profileSelector);
  const theme = useSelector(themeSelector);
  const colors = appColors[theme];
  const auth = useSelector(authSelector);
  const {t} = useTranslation();
  const flatlistRef = useRef<FlatList>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1); // Reset page to 1 on refresh
    postServices.getEventForUser(1, auth.userId).then(res => {
      if (res && res.data) {
        setPosts(res.data.postData);
        setLimitPage(res.data.totalPage);
      }
      setRefreshing(false);
    });
  }, [auth.userId]);

  const loadMorePosts = useCallback(async () => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);
    const res = await postServices.getEventForUser(page, auth.userId);
    if (res && res.data) {
      setPosts(prevPosts => {
        const newPosts = [...prevPosts, ...res.data.postData];
        const uniquePosts = newPosts.filter(
          (post, index, self) =>
            self.findIndex(p => p.id === post.id) === index,
        );
        return uniquePosts;
      });
      setPage(prev => prev + 1);
      setLimitPage(res.data.totalPage);
    }
    setLoading(false);
  }, [page, auth.userId, loading]);
  useFocusEffect(
    useCallback(() => {
      onRefresh(); // Trigger refresh when coming back from CreatePostScreen
    }, [navigation, onRefresh]),
  );
  const handleLikePost = async (id: string) => {
    const res = await postServices.handleLikePost(auth.userId, id);
    if (res && res.data) {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.postId === id) {
            const isLiked = post.likes.includes(auth.userId);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((userId: any) => userId !== auth.userId)
                : [...post.likes, auth.userId],
            };
          }
          return post;
        }),
      );
      console.log('Like post successfully !!', res.data);
    }
  };
  const handleRemovePost = async (id: string) => {
    setLoading(true);
    const res = await postServices.handleRemovePost(id);
    if (res?.data) {
      setPosts(prev => prev.filter(e => e.postId !== id));
      console.log('Remove post successfully!! ', res.data);
      ToastAndroid.show('Đã xóa bài !!', ToastAndroid.SHORT);
    }
    setLoading(false);
  };
  const handleHidePostForUser = async (postId: string) => {
    setLoading(true);
    const res = await postServices.handleHidePost(auth.userId, postId);
    if (res && res.data) {
      console.log('Hide post successfully !!', res.data);
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.postId === postId) {
            return {
              ...post,
              hide: [...post.hide, res.data],
            };
          }
          return post;
        }),
      );
      ToastAndroid.show('Đã ẩn bài !!', ToastAndroid.SHORT);
    }
    setLoading(false);
  };
  const onChangeComment = (count: number, postId: string) => {
    console.log('Count: ', count);
    setPosts(prev => {
      return prev.map(item => {
        if (item.postId === postId) {
          return {
            ...item,
            comments: item.comments + count,
          };
        }
        return item;
      });
    });
  };
  const onChangeShare = (count: number, postId: string) => {
    setPosts(prev => {
      return prev.map(post => {
        if (post.postId === postId) {
          return {
            ...post,
            shares: post.shares + count,
          };
        }
        return post;
      });
    });
  };
  useEffect(() => {
    if (scrollToPostId && posts.length > 0 && flatlistRef.current) {
      const index = posts.findIndex(post => post.postId === scrollToPostId);
      if (index !== -1) {
        flatlistRef.current.scrollToIndex({index, animated: true});
        setScrollToPostId(null); // Sử dụng setState để cập nhật state
      }
    }
  }, [scrollToPostId, posts]);

  // Cập nhật khi có notifiPostId mới từ route.params
  useEffect(() => {
    if (notifiPostId) {
      setScrollToPostId(notifiPostId);
    }
  }, [notifiPostId]);
  const renderPost = useCallback(
    ({item, index}: any) => {
      const isLike = item.likes.includes(auth.userId);

      return (
        <RenderPost
          onChangeComment={(count: number) =>
            onChangeComment(count, item.postId)
          }
          onChangeShare={(count: number) => onChangeShare(count, item.postId)}
          handleHidePostForUser={() => handleHidePostForUser(item.postId)}
          isReport={auth.userId !== item.userId}
          handleRemovePost={() => handleRemovePost(item.postId)}
          userId={item.userId}
          privacy={item.privacy}
          url={item.url}
          naviagtion={navigation}
          liked={isLike}
          postId={item.postId}
          comments={item.comments}
          shares={item.shares}
          likes={item.likes}
          images={item.images}
          avatar={item.avatar}
          name={item.name}
          content={item.content}
          createdAt={item.createdAt}
          key={index}
          handleLikePost={() => handleLikePost(item.postId)}
          item={item}
        />
      );
    },
    [posts, page, handleLikePost, handleRemovePost],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <TextComponent
          label={t('news_feed')}
          styles={[styles.headerTitle, {color: colors.text}]}
        />
      </View>

      <SpaceComponent height={10} />
      <RowComponent
        styles={[styles.createPostContainer, {backgroundColor: colors.card}]}>
        <FastImage
          source={{uri: profile.avatar}}
          style={styles.currentUserAvatar}
        />
        <TouchableOpacity
          style={styles.createPostInput}
          onPress={() => navigation.navigate('create_post')}>
          <TextComponent label="Viết gì đi bạn ?" color={colors.text2} />
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="image-edit-outline"
          size={22}
          color={'green'}
          onPress={() => navigation.navigate('create_post')}
        />
      </RowComponent>

      <SpaceComponent height={10} />

      <FlatList
        ref={flatlistRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary || '#000']}
          />
        }
        onEndReached={() => page < limitPage && loadMorePosts()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <TextComponent
                label={t('loading_more')}
                styles={[styles.loadingText, {color: colors.text2}]}
              />
            </View>
          ) : null
        }
        nestedScrollEnabled={true}
      />
    </SafeAreaView>
  );
};

export default MyPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    justifyContent: 'flex-end',
  },
  searchButton: {
    marginRight: 12,
  },
  notificationButton: {
    position: 'relative',
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontWeight: '600',
  },
  createPostContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  createPostInput: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  imagePickerButton: {
    marginBottom: -10,
    justifyContent: 'center',
  },

  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
