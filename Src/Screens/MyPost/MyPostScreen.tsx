import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1); // Reset page to 1 on refresh
    postServices.getEventForUser(1, auth.userId).then(res => {
      if (res && res.data) {
        setPosts(res.data);
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
        const newPosts = [...prevPosts, ...res.data];
        const uniquePosts = newPosts.filter(
          (post, index, self) =>
            self.findIndex(p => p.id === post.id) === index,
        );
        return uniquePosts;
      });
      setPage(prev => prev + 1);
      // setLimitPage(res.data.totalPage);
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
          if (post.id === id) {
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
  const renderPost = useCallback(
    ({item, index}: any) => {

      return (
        <RenderPost
          privacy={item.privacy}
          url={item.url}
          naviagtion={navigation}
          liked={item.likes.includes(auth.userId)}
          id={item.id}
          comments={item.comments}
          shares={item.shares}
          likes={item.likes}
          images={item.images}
          avatar={item.user.avatar}
          name={item.user.name}
          content={item.content}
          createdAt={item.createdAt}
          key={index}
          handleLikePost={() => handleLikePost(item.id)}
        />
      );
    },
    [posts, page, handleLikePost],
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
        onEndReached={() => page <= limitPage && loadMorePosts()}
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
