import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {CloseCircle, Send2} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
import {RowComponent, TextComponent} from '../../Components';
import FastImage from 'react-native-fast-image';
import {X} from 'lucide-react-native';

interface Props {
  colors: any;
  t: any;
  onSendComment: (comment: string) => void;
  user: any;
  onClearItem: () => void;
  value: string;
}

const CommentInput = (props: Props, ref: any) => {
  const {colors, t, onSendComment, user, onClearItem, value} = props;
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendComment(text);
      setText('');
    }
  };
  useImperativeHandle(ref, () => ({
    openKeyboard: () => {
      inputRef.current?.focus();
    },
  }));
  useEffect(() => {
    setText(value || '');
  }, [value]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      {user && (
        <View
          style={{
            backgroundColor: colors.card,
            paddingBottom: 6,
            paddingHorizontal: 6,
          }}>
          <RowComponent
            styles={{
              justifyContent: 'flex-start',
              paddingVertical: 4,
            }}>
            <FastImage
              source={{
                uri: user?.avatar,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              style={{height: 32, width: 32, borderRadius: 50}}
            />
            <RowComponent>
              <TextComponent label={user.name} size={12} />
            </RowComponent>
          </RowComponent>
          <RowComponent>
            <Image
              style={{height: 25, width: 25}}
              source={require('../../../assets/images/vietnam.png')}
            />
            <TextComponent
              label={user.comment}
              size={12}
              numberOfLine={3}
              styles={{flex: 1}}
            />
            <CloseCircle color={'coral'} size={16} onPress={onClearItem} />
          </RowComponent>
        </View>
      )}
      <RowComponent
        styles={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          style={[styles.input, {color: colors.text, flex: 1}]}
          placeholder={t('Nhập bình luận...')}
          placeholderTextColor={colors.text2}
          multiline
          blurOnSubmit={false}
          accessibilityLabel="Comment input"
        />

        <View style={styles.iconsContainer}>
          {text.length > 0 && (
            <TouchableOpacity
              onPress={() => setText('')}
              style={styles.iconButton}>
              <CloseCircle color={colors.icon} size={22} />
            </TouchableOpacity>
          )}

          <Send2
            onPress={handleSend}
            color={text.trim() ? '#1E90FF' : colors.text2}
            size={appInfo.sizeIconBold}
            variant={text.trim() ? 'Bold' : 'Linear'}
          />
        </View>
      </RowComponent>
    </KeyboardAvoidingView>
  );
};

export default React.forwardRef(CommentInput);

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.select({
      ios: 16,
      android: 8,
    }),
    paddingHorizontal: 8,
    borderTopWidth: 0.5,
  },
  inputContainer: {
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  input: {
    paddingVertical: Platform.select({
      ios: 8,
      android: 4,
    }),
    paddingHorizontal: 12,
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});
