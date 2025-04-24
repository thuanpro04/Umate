import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {ArrowLeft, Message2, UserAdd} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {
  Alert,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {addEvent, eventSelector} from '../../redux/reducers/eventSlice';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import LoadingModal from '../Modal/LoadingModal';
import {friendServices} from '../Services/friendService.';
import {messageServices} from '../Services/messageServices';
import {userServices} from '../Services/userService';
import {profileStyles} from './profileStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {profileSelector, setMylove} from '../../redux/reducers/profileSlice';
import {debounce} from 'lodash';
import RenderPost from '../MyPost/Components/RenderPost';
import {Repeat} from 'lucide-react-native';
import {postServices} from '../Services/postServices';
import {UserInfo} from '../Untils/UserInfo';
import SocketService from '../Services/SocketService';

const PersonalScreen = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const [userInfo, setUserInfo] = useState<any>(null);
  const profile = useSelector(profileSelector);
  const [isHeart, setIsHeart] = useState(
    profile?.myLove?.includes(auth.userId),
  );
  
  const {userId} = useRoute().params as {userId: string};
  const [isLoading, setIsLoading] = useState(false);
  const [isDetail, setDetail] = useState(false);
  const [isShowPost, setIsShowPost] = useState(false);
  const eventData = useSelector(eventSelector);
  const [posts, setPosts] = useState<any[]>([]);
  const {t} = useTranslation();
  const bgColor = useSharedValue('#009688');
  const event = useSelector(eventSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const dispatch = useDispatch();

  const infoUser = {
    stats: {
      friend: userInfo?.friends?.length ?? 0,
      share: userInfo?.eventShares?.length ?? 0,
      like: profile?.myLove?.length ?? 0,
    },
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isDetail ? colors.bgProfile : colors.bgProfile2,
        {
          duration: 900,
        },
      ),
    };
  });
  useFocusEffect(
    useCallback(() => {
      handleGetUserInfoById(userId);
    }, [userId, navigation]),
  );

  const handleGetUserInfoById = async (userId: string) => {
    setIsLoading(true);
    const res = await userServices.getUserInfo(userId);
    if (res && res.data) {
      setUserInfo(res.data);
      setPosts(
        res.data?.eventShares.filter(
          (item: any) => !item.hide.includes(userId),
        ),
      );
    }
    setIsLoading(false);
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
  const toggleDetail = () => {
    setDetail(!isDetail);
    bgColor.value = isDetail ? '#009688' : '#009688';
  };
  const onChangePost = () => {
    setTimeout(() => {
      setIsShowPost(!isShowPost);
    }, 300);
  };
  const fetchMypost = async () => {
    const res = await postServices.getMyPost(userId, auth.userId);
    if (res?.data) {
      console.log('get my post successfully !!', res.data);
      setPosts(res.data);
    }
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
  const renderPost = useCallback(
    ({item, index}: any) => {
      return (
        <>
          <RenderPost
            onChangeShare={(count: number) => onChangeShare(count, item.postId)}
            onChangeComment={(count: number) =>
              onChangeComment(count, item.postId)
            }
            isMore
            userId={item.userId}
            privacy={item.privacy}
            isFoot={!isShowPost}
            url={item.url}
            naviagtion={navigation}
            liked={item.likeCount?.includes(auth.userId)}
            postId={item.postId}
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
            styleImage={{height: 220, width: '80%'}}
          />
          <SpaceComponent height={12} />
        </>
      );
    },
    [posts, userInfo],
  );

  const handleAddFriend = async (friendUserId: string) => {
    const res = await friendServices.handleFriendActionAdd_Cancel(
      friendUserId,
      'add',
      auth.userId,
    );
    if (res && res.data) {
      console.log('Add friend sucessfully !!');
    }
  };
  const onPressMyLove = debounce(async () => {
    setIsHeart(!isHeart);
    const res = await userServices.handleMylove(userId, auth.userId, isHeart);
    if (res && res.data) {
      console.log('Add my love sucessfully !!', res.data);
      dispatch(setMylove(auth.userId));
    }
  }, 1000);
  useEffect(() => {
    if (isShowPost) {
      fetchMypost();
    } else {
      setPosts(
        userInfo?.eventShares.filter(
          (item: any) => !item.hide?.includes(userId),
        ),
      );
    }
  }, [isShowPost]);
  const renderHeader = () => {
    const dataUser = [
      {
        key: 'majoring',
        content: (
          <TextComponent
            styles={profileStyles.majoring}
            label={userInfo?.majoring ?? t('majoring')}
          />
        ),
        icon: <Icon name="school" size={20} color={'#1b4f72'} />,
      },
      {
        key: 'link',
        content: (
          <ButtonComponent
            type="action"
            onPress={() => {
              if (userInfo?.link) {
                Linking.openURL(userInfo.link).catch(err =>
                  Alert.alert('Lỗi', 'Không thể mở liên kết'),
                );
              }
            }}>
            <TextComponent
              styles={profileStyles.link}
              label={
                userInfo?.link ? userInfo?.link.slice(0, 24) + '...' : 'Link'
              }
            />
          </ButtonComponent>
        ),
        icon: <Icon name="link" size={20} color={appColors.blue} />,
      },
      {
        key: 'email',
        content: (
          <TextComponent label={userInfo?.email} styles={profileStyles.email} />
        ),
        icon: <Icon name="email" size={20} color={appColors.pink} />,
      },
      {
        key: 'majoring',
        content: (
          <TextComponent
            styles={profileStyles.majoring}
            label={userInfo?.address ? userInfo?.address : 'Địa chỉ'}
          />
        ),
        icon: <Icon name="location-on" size={20} color={appColors.green2} />,
      },
    ];

    return (
      <Animated.View style={[profileStyles.header, animatedStyle]}>
        <ArrowLeft
          onPress={() => navigation.goBack()}
          size={appInfo.sizeIconBold}
          color={appColors.white}
          style={{position: 'absolute', left: '5%', top: '5%'}}
        />
        {userId !== auth.userId ? (
          !friendData.friends?.includes(userId) ? (
            <UserAdd
              onPress={() => handleAddFriend(userId)}
              size={appInfo.sizeIconBold}
              color={appColors.white}
              style={localStyles.iconHeader}
            />
          ) : (
            <Message2
              onPress={onNavigationMessage}
              size={appInfo.sizeIconBold}
              color={appColors.white}
              style={localStyles.iconHeader}
            />
          )
        ) : (
          <></>
        )}
        {userInfo ? (
          isDetail ? (
            <View style={profileStyles.profileContainer}>
              <TextComponent
                styles={profileStyles.name}
                label={userInfo.name}
              />
              <SpaceComponent height={8} />
              <Animated.View style={[{alignItems: 'flex-start'}]}>
                {dataUser.map((item, index) => {
                  return (
                    <RowComponent key={index} styles={{marginBottom: 12}}>
                      {item.icon}
                      {item.content}
                    </RowComponent>
                  );
                })}
                <RowComponent styles={{}}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/18438/18438783.png',
                    }}
                    style={globalStyles.iconImage}
                  />
                  <TextComponent
                    label={userInfo.bio ?? 'bio'}
                    styles={profileStyles.bio}
                    color={colors.text2}
                  />
                </RowComponent>
              </Animated.View>
              <SpaceComponent height={10} />
              <ButtonComponent
                onPress={toggleDetail}
                type="action"
                label={t('cancel')}
                textStyle={[profileStyles.btn_Detail]}
                styles={{}}
              />
            </View>
          ) : (
            <View style={profileStyles.profileContainer}>
              <RowComponent>
                <ZoomImageComponent
                  url={
                    userInfo.avatar
                      ? userInfo.avatar
                      : 'https://via.placeholder.com/150'
                  }
                  styles={[profileStyles.avatar, {zIndex: -1}]}
                />
                {userInfo.online && (
                  <View
                    style={{
                      backgroundColor: 'green',
                      padding: 6,
                      borderRadius: 50,
                      position: 'absolute',
                      top: 0,
                      right: 20,
                    }}
                  />
                )}
              </RowComponent>
              <SpaceComponent height={16} />
              <TextComponent
                styles={profileStyles.name}
                label={userInfo.name}
              />
              <SpaceComponent height={6} />
              <TextComponent
                styles={profileStyles.majoring}
                label={userInfo.majoring ?? t('majoring')}
              />
              <SpaceComponent height={8} />
              <RowComponent styles={{marginHorizontal: 12}}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/18438/18438783.png',
                  }}
                  style={globalStyles.iconImage}
                />
                <TextComponent
                  label={userInfo.bio ?? 'bio'}
                  styles={[profileStyles.bio]}
                  color={colors.text2}
                  numberOfLine={2}
                />
              </RowComponent>
              <SpaceComponent height={18} />
              <ButtonComponent
                onPress={toggleDetail}
                type="action"
                label={t('detail')}
                textStyle={[profileStyles.btn_Detail]}
              />
              <SpaceComponent height={6} />
              <TouchableOpacity
                onPress={onPressMyLove}
                style={{
                  transform: [{rotate: '-180deg'}],
                }}>
                {isHeart ? (
                  <AntDesign name="heart" size={22} color="red" />
                ) : (
                  <AntDesign name="hearto" size={22} color="pink" />
                )}
              </TouchableOpacity>
            </View>
          )
        ) : (
          <></>
        )}
      </Animated.View>
    );
  };
  const onNavigationMessage = async () => {
    setIsLoading(true);
    const res = await messageServices.checkConversation(
      auth.userId,
      userInfo.userId,
    );

    if (res && res.data) {
      await AsyncStorage.setItem(
        'ConversationInfo',
        JSON.stringify({
          ...userInfo,
          conversationId: res.data,
          type: 'personal',
        }),
      );
    } else {
      await AsyncStorage.setItem(
        'ConversationInfo',
        JSON.stringify({...userInfo, type: 'personal'}),
      );
    }
    setIsLoading(false);
    navigation.navigate('Chat');
  };

  return !isLoading ? (
    <SafeAreaView
      style={[
        profileStyles.container,
        {backgroundColor: colors.background, marginBottom: 12},
      ]}>
      <StatusBar barStyle="dark-content" />

      {userInfo ? (
        <>
          {renderHeader()}
          <View style={[profileStyles.statsContainer, ,]}>
            {Object.entries(infoUser.stats).map(([key, value]) => (
              <View
                key={key}
                style={[
                  profileStyles.stat,
                  {
                    backgroundColor:
                      theme === 'light' ? colors.background : colors.border,
                    shadowColor: colors.shadow,
                  },
                ]}>
                <TextComponent
                  styles={profileStyles.statNumber}
                  label={value}
                />
                <TextComponent
                  styles={profileStyles.statLabel}
                  label={t(key).toUpperCase()}
                />
              </View>
            ))}
          </View>

          <RowComponent
            styles={{justifyContent: 'flex-start', paddingRight: 32}}>
            {isShowPost ? (
              <TextComponent
                styles={[profileStyles.sectionTitle, {flex: 1}]}
                label={'Bài đăng gần đây'}
              />
            ) : (
              <TextComponent
                styles={[profileStyles.sectionTitle, {flex: 1}]}
                label={t('recently_share')}
              />
            )}

            <Repeat
              size={appInfo.sizeIcon}
              color={colors.icon}
              onPress={onChangePost}
            />
          </RowComponent>
          {userInfo.eventShares && (
            <FlatList
              inverted
              data={posts}
              renderItem={renderPost}
              keyExtractor={item => item._id}
              contentContainerStyle={profileStyles.postList}
            />
          )}
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextComponent label="Tài khoản không tồn tại." />
        </View>
      )}
    </SafeAreaView>
  ) : (
    <LoadingModal visible={isLoading} />
  );
};
const localStyles = StyleSheet.create({
  iconHeader: {position: 'absolute', right: '5%', top: '5%'},
});
export default PersonalScreen;
