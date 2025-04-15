import {Setting2} from 'iconsax-react-native';
import {debounce} from 'lodash';
import {
  Accessibility,
  Anchor,
  Axe,
  BadgeX,
  Files,
  RemoveFormatting,
  Users,
} from 'lucide-react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  ImageStyle,
  Platform,
  StyleProp,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import CustormImageViewing from '../../Messages/Component/CustormImageViewing';
import LikeListModal from '../../Modal/LikeListModal';
import ShareEventModal from '../../Modal/ShareEventModal';
import {UserInfo} from '../../Untils/UserInfo';
import RenderPostImages from './RenderPostImages';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {postServices} from '../../Services/postServices';
import PrivacySelector from './PrivacySelector';
import Clipboard from '@react-native-clipboard/clipboard';
import PostActions from './PostActions';
interface Props {
  avatar: string;
  name: string;
  createdAt: any;
  content: string;
  images: string[];
  shares: string;
  comments: string;
  likes: string[];
  postId: string;
  liked: boolean;
  handleLikePost: () => void;
  naviagtion: any;
  url: string;
  isFoot?: boolean;
  styleImage?: StyleProp<ImageStyle>;
  privacy: string;
  userId: string;
  handleRemovePost?: () => void;
  isMore?: boolean;
  isReport?: boolean;
  handleHidePostForUser?: () => void;
  isHide?: boolean;
  isPrivacy?: boolean;
  handleUpdatePrivacy?: (postId: string, privacy: string) => void;
  onChangeComment: (count: number) => void;
}
const RenderPost = (props: Props) => {
  const {
    avatar,
    content,
    createdAt,
    name,
    shares,
    comments,
    likes,
    images,
    postId,
    handleLikePost,
    liked,
    naviagtion,
    url,
    isFoot,
    styleImage,
    privacy,
    userId,
    handleRemovePost,
    isMore,
    isReport,
    handleHidePostForUser,
    isHide,
    isPrivacy,
    handleUpdatePrivacy,
    onChangeComment,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [indexImg, setIndexImg] = useState(0);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [isLiked, setLiked] = useState(liked);
  const [showPrivacySelector, setShowPrivacySelector] = useState(false);
  const [privacyOption, setPrivacyOption] = useState(privacy);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const theme = useSelector(themeSelector);
  const auth = useSelector(authSelector);
  const colors = appColors[theme];
  const {t} = useTranslation();

  const getTimestamp = () => {
    const now = new Date();
    const created = new Date(createdAt);

    const isToday =
      now.getDate() === created.getDate() &&
      now.getMonth() === created.getMonth() &&
      now.getFullYear() === created.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      yesterday.getDate() === created.getDate() &&
      yesterday.getMonth() === created.getMonth() &&
      yesterday.getFullYear() === created.getFullYear();

    if (isToday) {
      return `${UserInfo.getTime(createdAt)} hôm nay`;
    } else if (isYesterday) {
      return `${UserInfo.getTime(createdAt)} hôm qua`;
    }

    return `${UserInfo.getTime(createdAt)} ${UserInfo.getDay(createdAt)}`;
  };
  const actionLikePost = debounce(async () => {
    setLiked(!isLiked);
    await handleLikePost();
  }, 500);
  const onPressImage = () => {
    const imgs = images?.length > 0 ? images.map(url => ({uri: url})) : [];
    setDisplayImgs(imgs);
    setIndexImg(0);
    setIsVisible(true);
  };
  const handleCopyPostLink = async () => {
    Clipboard.setString(url);
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        'Đã sao chép liên kết vào bộ nhớ tạm',
        ToastAndroid.SHORT,
      );
    } else {
      Alert.alert('Thành công', 'Đã sao chép liên kết vào bộ nhớ tạm');
    }
  };
  const actionMenu = (key: string) => {
    switch (key) {
      case 'remove':
        handleRemovePost && handleRemovePost();
        break;
      case 'hide':
        handleHidePostForUser && handleHidePostForUser();
        break;
      case 'copy':
        handleCopyPostLink();
        break;
      case 'privacy':
        setShowPrivacySelector(true);
        break;
      case 'report':
        naviagtion.navigate('ReportPostScreen', {
          postId: postId,
          postAuthor: userId,
        });
        break;
    }
    onCloseMenu();
  };

  const menuData = [
    {
      key: 'copy',
      title: 'Sao chép liên kết',
      icon: <Files size={appInfo.sizeIcon} color={'blue'} />,
    },
  ];
  function onCloseMenu() {
    setIsShowMenu(false);
  }

  return (
    <View style={[styles.postContainer, {backgroundColor: colors.card}]}>
      {/* Post Header */}
      <RowComponent styles={styles.postHeader}>
        <TouchableOpacity
          onPress={() => naviagtion.navigate('PersonalScreen', {userId})}>
          <FastImage source={{uri: avatar}} style={styles.userAvatar} />
        </TouchableOpacity>
        <View style={styles.postHeaderInfo}>
          <RowComponent styles={{justifyContent: 'flex-start'}}>
            <TextComponent
              label={name}
              styles={[styles.userName, {color: colors.text}]}
            />
            {privacyOption === 'private' ? (
              <Setting2 size={12} color={colors.icon} />
            ) : privacyOption === 'friends' ? (
              <Users size={12} color={colors.icon} />
            ) : (
              <></>
            )}
          </RowComponent>
          <TextComponent
            label={getTimestamp()}
            styles={[styles.postTime, {color: colors.text2}]}
          />
        </View>
        {!isMore && (
          <Menu
            visible={isShowMenu}
            style={{
              borderRadius: 16,
              paddingVertical: 8,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
              shadowOffset: {width: 0, height: 5},
              elevation: 5,
              backgroundColor: colors.background,
            }}
            anchor={
              <MaterialCommunityIcons
                onPress={() => setIsShowMenu(true)}
                name="dots-horizontal"
                size={22}
                color={colors.text2}
              />
            }
            onRequestClose={onCloseMenu}>
            <View>
              {isReport ? (
                <>
                  <MenuItem
                    style={styles.menuItem}
                    onPress={() => actionMenu('report')}>
                    <BadgeX size={appInfo.sizeIcon} color={'red'} />
                    <SpaceComponent width={12} />
                    <TextComponent label="Báo cáo" />
                  </MenuItem>
                  <MenuDivider />
                </>
              ) : (
                <>
                  <MenuItem
                    style={styles.menuItem}
                    onPress={() => actionMenu('remove')}>
                    <BadgeX size={appInfo.sizeIcon} color={'coral'} />
                    <SpaceComponent width={12} />
                    <TextComponent label={'Xóa bài'} />
                  </MenuItem>
                  <MenuDivider />
                </>
              )}
              {menuData.map(item => {
                return (
                  <React.Fragment key={item.key}>
                    <MenuItem
                      style={styles.menuItem}
                      onPress={() => actionMenu(item.key)}>
                      {item.icon}
                      <SpaceComponent width={12} />
                      <TextComponent label={item.title} />
                    </MenuItem>
                    <MenuDivider />
                  </React.Fragment>
                );
              })}
              {isPrivacy ? (
                <>
                  <MenuItem
                    style={styles.menuItem}
                    onPress={() => actionMenu('privacy')}>
                    <Anchor size={appInfo.sizeIcon} color={'violet'} />
                    <SpaceComponent width={12} />
                    <TextComponent label={'Quyền'} />
                  </MenuItem>
                  <MenuDivider />
                </>
              ) : (
                <>
                  <MenuItem
                    style={styles.menuItem}
                    onPress={() => actionMenu('hide')}>
                    <Axe size={appInfo.sizeIcon} color={'green'} />
                    <SpaceComponent width={12} />
                    <TextComponent label={isHide ? 'Bỏ ẩn' : 'Ẩn bài'} />
                  </MenuItem>
                  <MenuDivider />
                </>
              )}
            </View>
          </Menu>
        )}
      </RowComponent>

      <View style={styles.postContent}>
        <TextComponent
          label={content}
          styles={[styles.postText, {color: colors.text}]}
        />
      </View>

      {/* Post Images */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPressImage}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <RenderPostImages images={images} styleImg={styleImage} />
      </TouchableOpacity>
      <SpaceComponent height={12} />
      {/* Post Stats */}
      {!isFoot && (
        <>
          <RowComponent styles={styles.postStats}>
            <View style={styles.likesContainer}>
              <View style={styles.likeIconContainer}>
                <MaterialCommunityIcons
                  name="thumb-up"
                  size={14}
                  color="#ffffff"
                />
              </View>
              <LikeListModal
                title={likes?.length.toString()}
                listUsers={likes}
                navigation={naviagtion}
              />
            </View>
            <View style={styles.commentsSharesContainer}>
              <TextComponent
                label={`${comments} ${t('comment')}`}
                styles={[styles.statsText, {color: colors.text2}]}
              />
              <TextComponent
                label={`${shares} ${t('share')}`}
                styles={[styles.statsText, {color: colors.text2}]}
              />
            </View>
          </RowComponent>

          {/* Post Actions */}
          <View style={[styles.postActions, {borderTopColor: colors.border}]}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={actionLikePost}>
              <MaterialCommunityIcons
                name="thumb-up-outline"
                size={22}
                color={isLiked ? appColors.blue : colors.icon}
              />
              <TextComponent
                label={t('like')}
                styles={[
                  styles.actionText,
                  {color: isLiked ? appColors.blue : colors.text2},
                ]}
              />
            </TouchableOpacity>

            <PostActions
              {...props}
              navigation={naviagtion}
              colors={colors}
              t={t}
            />
            <ShareEventModal
              {...props}
              styles={[
                styles.btnShare,
                {borderColor: colors.border, borderWidth: 1},
              ]}
              title="Share"
              icon={
                <Foundation
                  name="social-skillshare"
                  size={appInfo.sizeIcon}
                  color={colors.icon}
                />
              }
            />
          </View>
        </>
      )}
      <CustormImageViewing
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
        images={displayImgs}
        onChangeImageIndex={setIndexImg}
        imageIndex={indexImg}
      />
      <PrivacySelector
        visible={showPrivacySelector}
        onClose={() => setShowPrivacySelector(false)}
        onSelect={(value: any) => {
          setPrivacyOption(value);
          handleUpdatePrivacy && handleUpdatePrivacy(postId, value);
        }}
        currentPrivacy={privacyOption}
      />
    </View>
  );
};

export default RenderPost;

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
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
  postHeader: {
    padding: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
  },
  statsText: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 13,
  },
  postStats: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIconContainer: {
    backgroundColor: '#2196F3',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsSharesContainer: {
    flexDirection: 'row',
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: '#FFCDD2',
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
