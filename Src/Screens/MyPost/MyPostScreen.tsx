import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import ButtonImagePicker from '../Messages/Component/ButtonImagePicker';
import RenderPost from './Components/RenderPost';
import {postServices} from '../Services/postServices';
import {useFocusEffect} from '@react-navigation/native';
import {authSelector} from '../../redux/reducers/authReducer';
import {UserInfo} from '../Untils/UserInfo';

// Mock data for demonstration

const MyPostScreen = ({navigation}: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const profile = useSelector(profileSelector);
  const theme = useSelector(themeSelector);
  const colors = appColors[theme];
  const auth = useSelector(authSelector);

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
      setPosts(prevPosts => [...prevPosts, ...res.data]);
      setPage(prev => prev + 1);
    }
    setLoading(false);
  }, [page, auth.userId, loading]);

  useEffect(() => {
    loadMorePosts();
  });

  const renderPost = useCallback(
    ({item, index}: any) => (
      <RenderPost
        comments={item.comments}
        shares={item.shares}
        likes={item.likes}
        images={item.images}
        avatar={item.user.avatar}
        name={item.user.name}
        content={item.content}
        createdAt={item.createdAt}
        key={index}
      />
    ),
    [posts, page],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Bảng tin</Text>
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
        onEndReached={() => (page === posts.length ? loadMorePosts : () => {})}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, {color: colors.text2}]}>
                Đang tải thêm...
              </Text>
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
