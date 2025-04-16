import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {TextComponent} from '../Components';
import CommentInput from '../MyPost/Components/CommentInput';
import RenderComment from '../MyPost/Components/RenderComment';
import {postServices} from '../Services/postServices';
import LoadingModal from './LoadingModal';
import {authSelector} from '../../redux/reducers/authReducer';

const CommentModal = (props: any) => {
  const {navigation, colors, t, visible, onClose, onChangeComment} = props;
  const [comments, setComments] = useState<any[]>([]);
  const modalRef = useRef<Modalize>(null);
  const commentInputRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null); // Track which comment we're replying to
  const handleReply = (item: any) => {
    setReplyingTo(item); // Set which comment we're replying to
    commentInputRef.current?.openKeyboard();
  };
  const profile = useSelector(profileSelector);
  const auth = useSelector(authSelector);
  useEffect(() => {
    console.log(comments, 123);

    if (visible) {
      onOpenModal();
    } else {
      onCloseModal();
    }
  }, [visible]);
  useFocusEffect(
    useCallback(() => {
      if (visible) {
        fetchRecentComments();
      }
      return () => {};
    }, [visible, props.postId]),
  );
  function onOpenModal() {
    modalRef.current?.open();
  }
  function onCloseModal() {
    setComments([]);
    modalRef.current?.close();
  }
  const fetchRecentComments = async () => {
    setIsLoading(true);
    const res = await postServices.getCommentForUser(props.postId);
    if (res?.data) {
      console.log('Get comment successfully !!', res.data);
      setComments(prev => [...prev, res.data]);
    }
    setIsLoading(false);
  };
  const handleReplyComment = async (data: any) => {
    const commentRepId = `cmt_${Date.now()}_${Math.floor(
      Math.random() * 10000,
    )}`;
    const newReply = {...data, commentRepId, commentId: replyingTo.commentId};
    setComments(prev => {
      return prev.map(comment => {
        if (comment.commentId === replyingTo.commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply], // thêm reply vào mảng replies
          };
        }
        return comment;
      });
    });
    console.log('Reply: ', data.comment);
    const res = await postServices.handleReplyComment({
      ...newReply,
      receiverId: replyingTo.userId,
    });
    if (res?.data) {
      console.log('Reply comment successfully!!');
    }
    setReplyingTo(null);
  };
  const handleSendComment = async (comment: string) => {
    const data = {
      postId: props.postId,
      userId: auth.userId,
      name: profile.name,
      comment,
      avatar: profile.avatar,
      timestamp: Date.now(),
      createdAt: new Date(),
    };
    onChangeComment(1);
    if (replyingTo) {
      handleReplyComment(data);
    } else {
      const commentId = `cmt_${Date.now()}_${Math.floor(
        Math.random() * 10000,
      )}`;
      const newComment = {...data, replies: [], commentId};
      setComments(prev => [...prev, newComment]);
      console.log('Data comment: ', newComment);
      const res = await postServices.handleCreateComment(newComment);
      if (res && res.data) {
        console.log('Create comment successfully !!!', res.data);
      }
    }
  };

  return (
    <Portal>
      <Modalize
        onClose={onClose}
        adjustToContentHeight
        ref={modalRef}
        handlePosition="inside"
        modalStyle={{
          backgroundColor: colors.background,
          paddingHorizontal: 12,
          paddingVertical: StatusBar.currentHeight,
          flex: 1,
        }}
        HeaderComponent={
          <View style={{flex: 1}}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <TextComponent
                  label={t('comment')}
                  styles={styles.modalTitle}
                />
                <TouchableOpacity onPress={onCloseModal}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>
              {comments.length > 0 ? (
                <ScrollView style={{maxHeight: 700}} nestedScrollEnabled={true}>
                  {comments.map((item, index) => (
                    <RenderComment
                      key={item.commentId} // Use a unique ID instead of index
                      item={item}
                      index={index}
                      colors={colors}
                      handleReply={handleReply}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextComponent label="Không có bình luận nào" />
                </View>
              )}
            </View>
          </View>
        }
        FooterComponent={
          <CommentInput
            value={replyingTo ? `@${replyingTo.name} ` : ''}
            onClearItem={() => setReplyingTo(null)}
            user={replyingTo}
            ref={commentInputRef}
            colors={colors}
            t={t}
            onSendComment={handleSendComment}
          />
        }
      />
      <LoadingModal visible={isLoading} />
    </Portal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    paddingTop: 16,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
  },
  commentsList: {
    maxHeight: '60%',
    flex: 1,
  },
  commentContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultAvatar: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userTextContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  optionsButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
});
