import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextComponent } from '../../Components';
import CommentModal from '../../Modal/CommentModal';

const PostActions = (props: any) => {
  const {navigation, colors, t, onChangeComment} = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  // Lấy 5 bình luận mới nhất
  const fetchRecentComments = async () => {};

  const handleCommentPress = () => {
    fetchRecentComments();
    setModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleCommentPress}>
        <MaterialCommunityIcons
          name="comment-outline"
          size={22}
          color={colors.text2}
        />
        <TextComponent
          label={t('comment')}
          styles={[styles.actionText, {color: colors.text2}]}
        />
        <CommentModal
          onChangeComment={onChangeComment}
          {...props}
          colors={colors}
          t={t}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginVertical: 8,
  },
  commentsList: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    marginVertical: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
});

export default PostActions;
