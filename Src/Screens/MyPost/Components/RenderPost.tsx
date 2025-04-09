import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appColors} from '../../../Theme/Colors/appColors';
import {RowComponent} from '../../Components';
import FastImage from 'react-native-fast-image';
import RenderPostImages from './RenderPostImages';
import {UserInfo} from '../../Untils/UserInfo';

interface Props {
  avatar: string;
  name: string;
  createdAt: any;
  content: string;
  images: string[];
  shares: string;
  comments: string;
  likes: string;
}
const RenderPost = (props: Props) => {
  const {avatar, content, createdAt, name, shares, comments, likes, images} =
    props;
  const theme = useSelector(themeSelector);
  const colors = appColors[theme];
  const getTimestamp = () => {
    let day = UserInfo.getDay(createdAt);
    if (parseInt(day, 10) === new Date().getDay()) {
      return `${UserInfo.getTime(createdAt)} ${day}`;
    }
    return `${UserInfo.getTime(createdAt)} hôm nay`;
  };
  return (
    <View style={[styles.postContainer, {backgroundColor: colors.card}]}>
      {/* Post Header */}
      <RowComponent styles={styles.postHeader}>
        <FastImage source={{uri: avatar}} style={styles.userAvatar} />
        <View style={styles.postHeaderInfo}>
          <Text style={[styles.userName, {color: colors.text}]}>{name}</Text>
          <Text style={[styles.postTime, {color: colors.text2}]}>
            {getTimestamp()}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={22}
            color={colors.text2}
          />
        </TouchableOpacity>
      </RowComponent>

      <View style={styles.postContent}>
        <Text style={[styles.postText, {color: colors.text}]}>{content}</Text>
      </View>

      {/* Post Images */}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <RenderPostImages images={images} />
      </View>
      {/* Post Stats */}
      <RowComponent styles={styles.postStats}>
        <View style={styles.likesContainer}>
          <View style={styles.likeIconContainer}>
            <MaterialCommunityIcons name="thumb-up" size={14} color="#ffffff" />
          </View>
          <Text style={[styles.statsText, {color: colors.text2}]}>{likes}</Text>
        </View>

        <View style={styles.commentsSharesContainer}>
          <Text style={[styles.statsText, {color: colors.text2}]}>
            {comments} bình luận
          </Text>
          <Text style={[styles.statsText, {color: colors.text2}]}>
            {shares} chia sẻ
          </Text>
        </View>
      </RowComponent>

      {/* Post Actions */}
      <View style={[styles.postActions, {borderTopColor: colors.border}]}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons
            name="thumb-up-outline"
            size={22}
            color={colors.text2}
          />
          <Text style={[styles.actionText, {color: colors.text2}]}>Thích</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons
            name="comment-outline"
            size={22}
            color={colors.text2}
          />
          <Text style={[styles.actionText, {color: colors.text2}]}>
            Bình luận
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons
            name="share-outline"
            size={22}
            color={colors.text2}
          />
          <Text style={[styles.actionText, {color: colors.text2}]}>
            Chia sẻ
          </Text>
        </TouchableOpacity>
      </View>
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
    marginRight: 4,
  },
  commentsSharesContainer: {
    flexDirection: 'row',
  },
});
