import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import ButtonImagePicker from '../Messages/Component/ButtonImagePicker';
import {imageService} from '../Services/imageService';
import {ArrowLeft2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {postServices} from '../Services/postServices';
import {authSelector} from '../../redux/reducers/authReducer';
import LoadingModal from '../Modal/LoadingModal';

const CreatePostScreen = ({navigation}: any) => {
  const [postContent, setPostContent] = useState('');
  const [feeling, setFeeling] = useState<any>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<number, boolean>
  >({});
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [postPrivacy, setPostPrivacy] = useState('public'); // 'public', 'friends', 'private'
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profile = useSelector(profileSelector);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const theme = useSelector(themeSelector);
  const colors = appColors[theme];
  const inputRef = useRef(null);
  const {t} = useTranslation();
  const auth = useSelector(authSelector);
  const handleImageSelect = (images: any | any[]) => {
    const newImages = Array.isArray(images) ? images : [images];
    setSelectedImages(prev => [...prev, ...newImages]);
  };
  const getFilePaths = (val: ImageOrVideo[] | ImageOrVideo): string[] => {
    return Array.isArray(val)
      ? val.map(item => item.path).filter(Boolean)
      : [val.path];
  };
  const uploadFileToStorage = useCallback(
    async (filePath: string): Promise<string | null> => {
      if (!filePath) {
        console.log('No file selected.');
        return null;
      }
      const fileName = filePath.split('/').pop();
      const path = `posts/${fileName}`;
      const result = await imageService.uploadImageToFirebase(filePath, path);
      return result ?? '';
    },
    [],
  );
  const onSelectImage = async (val: ImageOrVideo[] | ImageOrVideo) => {
    const filePaths = getFilePaths(val);
    if (filePaths.length > 20) {
      return;
    }
    setIsLoading(true);
    const arrImage = await Promise.all(filePaths.map(uploadFileToStorage));
    const validImageUrls = arrImage.filter(url => url !== null);
    setIsLoading(false);
    handleImageSelect(validImageUrls);
  };
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handlePostSubmit = async () => {
    // Handle post submission logic here
    setIsLoading(true);
    const data = {
      content: postContent,
      images: selectedImages,
      feeling,
      privacy: postPrivacy,
      userId: auth.userId,
    };
    const res = await postServices.handleMyPost(data);
    if (res && res.data) {
      console.log('Post event successfully !!!', res.data);
      setIsLoading(false);
      navigation.navigate(t('post')); // Pass a refresh flag
    }
    setIsLoading(false);
    // Reset form

    setPostContent('');
    setSelectedImages([]);
    setFeeling(null);
    setShowEmojiPicker(false);
  };

  const feelings = [
    {icon: '😁', name: 'Vui vẻ'},
    {icon: '🥲', name: 'Buồn'},
    {icon: '🤩', name: 'Phấn khích'},
    {icon: '😇', name: 'Bình thản'},
    {icon: '😡', name: 'Tức giận'},
    {icon: '🥰', name: 'Đang yêu'},
  ];

  const privacyOptions = [
    {icon: 'earth', value: 'public', label: 'Công khai'},
    {icon: 'account-group', value: 'friends', label: 'Bạn bè'},
    {icon: 'lock', value: 'private', label: 'Chỉ mình tôi'},
  ];

  const renderPrivacySelector = () => {
    const currentOption: any = privacyOptions.find(
      option => option.value === postPrivacy,
    );
    return (
      <TouchableOpacity
        style={styles.privacySelector}
        onPress={() => {
          // Toggle through privacy options
          const currentIndex = privacyOptions.findIndex(
            option => option.value === postPrivacy,
          );
          const nextIndex = (currentIndex + 1) % privacyOptions.length;
          setPostPrivacy(privacyOptions[nextIndex].value);
        }}>
        <MaterialCommunityIcons
          name={currentOption.icon}
          size={16}
          color={colors.primary}
        />
        <Text style={[styles.privacyText, {color: colors.text}]}>
          {currentOption.label}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={colors.text}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <RowComponent styles={styles.header}>
            <RowComponent>
              <ArrowLeft2
                size={appInfo.sizeIconBold}
                color={colors.icon}
                onPress={() => navigation.goBack()}
              />
              <TextComponent
                styles={[styles.headerTitle]}
                label={t('create_post')}
              />
            </RowComponent>
            <TouchableOpacity
              onPress={handlePostSubmit}
              disabled={!postContent.trim() && selectedImages.length === 0}
              style={[
                styles.postButton,
                {
                  backgroundColor:
                    !postContent.trim() && selectedImages.length === 0
                      ? colors.disabledButton
                      : colors.primary,
                },
              ]}>
              <TextComponent
                label={t('post_action')}
                styles={styles.postButtonText}
              />
            </TouchableOpacity>
          </RowComponent>

          {/* User Info & Privacy Selector */}
          <RowComponent styles={styles.userInfoContainer}>
            <FastImage source={{uri: profile.avatar}} style={styles.avatar} />
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, {color: colors.text}]}>
                {profile.name || 'Người dùng'}
                {feeling && (
                  <Text style={{color: colors.text2}}>
                    - {t('feeling_now')} {feeling.name}
                  </Text>
                )}
              </Text>
              {renderPrivacySelector()}
            </View>
          </RowComponent>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={[styles.contentInput, {color: colors.text}]}
              placeholder={t('what_are_you_thinking')}
              placeholderTextColor={colors.text2}
              multiline
              value={postContent}
              onChangeText={setPostContent}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </View>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    {imageLoadingStates[index] ? (
                      <View style={styles.previewImage}>
                        <ActivityIndicator size={18} />
                      </View>
                    ) : (
                      <View>
                        <FastImage
                          onLoad={() => {
                            if (image) {
                              setImageLoadingStates(prev => ({
                                ...prev,
                                [index]: false,
                              }));
                            } else {
                              setImageLoadingStates(prev => ({
                                ...prev,
                                [index]: true,
                              }));
                            }
                          }}
                          source={{
                            uri: image,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                          }}
                          style={styles.previewImage}
                        />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => removeImage(index)}>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={22}
                            color="#d3d3d3"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Add to your post */}
          <View
            style={[styles.addToPostContainer, {borderColor: colors.border}]}>
            <TextComponent
              label={t('add_to_post')}
              styles={[styles.addToPostText, {color: colors.text}]}
            />

            <View style={styles.modernToolbar}>
              <ButtonImagePicker
                styles={styles.modernButton}
                onSelect={val =>
                  val.type === 'url'
                    ? handleImageSelect(val.value)
                    : onSelectImage(val.value as ImageOrVideo)
                }
                multiple
                icon={
                  <View
                    style={[
                      styles.modernButtonInner,
                      {backgroundColor: 'rgba(76, 175, 80, 0.1)'},
                    ]}>
                    <MaterialCommunityIcons
                      name="image-multiple"
                      size={24}
                      color="#4CAF50"
                    />
                    <TextComponent
                      styles={[styles.modernButtonText, {color: '#4CAF50'}]}
                      label={t('images')}
                    />
                  </View>
                }
              />

              <TouchableOpacity
                style={styles.modernButton}
                onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                <View
                  style={[
                    styles.modernButtonInner,
                    {backgroundColor: 'rgba(255, 193, 7, 0.1)'},
                  ]}>
                  <MaterialCommunityIcons
                    name="emoticon-outline"
                    size={24}
                    color="#FFC107"
                  />
                  <TextComponent
                    label={t('feeling')}
                    styles={[styles.modernButtonText, {color: '#FFC107'}]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {showEmojiPicker && (
            <View
              style={[
                styles.emojiPickerContainer,
                {backgroundColor: colors.card},
              ]}>
              <Text style={[styles.emojiPickerTitle, {color: colors.text}]}>
                Bạn cảm thấy thế nào?
              </Text>
              <View style={styles.feelingsList}>
                {feelings.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.feelingItem,
                      feeling?.name === item.name && styles.selectedFeeling,
                      {borderColor: colors.border},
                    ]}
                    onPress={() => {
                      setFeeling(item);
                      setShowEmojiPicker(false);
                    }}>
                    <TextComponent label={item.icon} />
                    <Text style={[styles.feelingText, {color: colors.text}]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <SpaceComponent height={100} />
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontWeight: 'bold',
  },
  userInfoContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  privacySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
  },
  contentInput: {
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  imagePreview: {
    marginRight: 8,
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -1,
    right: -2,
  },
  addToPostContainer: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  addToPostText: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mediaToolbar: {
    flexDirection: 'row',
  },
  mediaButton: {
    marginRight: 12,
  },
  gradientButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emojiPickerContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emojiPickerTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  feelingsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feelingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFeeling: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  feelingText: {
    marginLeft: 4,
  },
  modernToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modernButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 0,
  },
  modernButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modernButtonText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },

  // Modern emoji picker styles
  modernEmojiContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modernEmojiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modernEmojiTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  modernFeelingsList: {
    padding: 16,
  },
  modernFeelingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  modernSelectedFeeling: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  modernEmojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernFeelingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
