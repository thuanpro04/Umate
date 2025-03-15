import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {
  ArrowLeft2,
  ArrowSquareDown,
  Camera,
  Edit2,
  Man,
  Woman,
} from 'iconsax-react-native';
import {debounce} from 'lodash';
import React, {useCallback, useState} from 'react';
import {Image, SafeAreaView, ScrollView, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {address} from '../../data/address';
import {majors} from '../../data/majoring';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import ButtonImagePicker from '../Messages/Component/ButtonImagePicker';
import EditUserModal from '../Modal/EditUserModal';
import LoadingModal from '../Modal/LoadingModal';
import UpdateInfoModal from '../Modal/UpdateInfoModal';
import {imageService} from '../Services/imageService';
import {userServices} from '../Services/userService';
import {Notification} from '../Untils/Notification';
import {UserInfo} from '../Untils/UserInfo';
import {profileStyles} from './profileStyles';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
interface ProfileType {
  userName: string;
  majoring: string;
  className: string;
  avatar: string;
  sex: string;
  majorCategory: string;
  link: string;
  address: string;
  bio: string;
}

const SetUpProfile = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const user = useSelector(profileSelector);
  const [isLoading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [errors, setErrors] = useState({className: '', majoring: '', sex: ''});
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  const initialProfile: ProfileType = {
    userName: user.name,
    majoring: user.majoring ?? '',
    className: user.className ?? '',
    avatar: user.avatar ?? '',
    sex: user.sex ?? '',
    majorCategory: user.majorCategory ?? '',
    address: '',
    bio: '',
    link: '',
  };
  const {getItem} = useAsyncStorage('ConvesationInfo');
  const response = async () => {
    const res = await getItem();
    console.log('getItem', res);
  };
  response();
  const [profile, setProfile] = useState(initialProfile);
  const [visible, setVisible] = useState(false);
  const [nameField, setNameField] = useState('');

  const dispatch = useDispatch();
  const onNavigation = () => {
    navigation.navigate('Profile');
  };
  const onchangeProfile = useCallback((key: string, value: string) => {
    setProfile(prev => ({...prev, [key]: value.trim()}));
    setVisible(false);
    setErrors(prev => ({...prev, [key]: ''}));
  }, []);

  const handleModal = (key: string) => {
    setNameField(key);
    setVisible(true);
  };
  const onCloseModal = () => {
    setVisible(false);
  };
  const validateFields = () => {
    let valid = true;
    const requiredFields: Array<'className' | 'majoring' | 'sex'> = [
      'className',
      'majoring',
      'sex',
    ];

    const newErrors = requiredFields.reduce((acc, field) => {
      if (!profile[field]) {
        acc[field] = `${field} is required`;
        valid = false;
      }
      return acc;
    }, {} as {className?: string; majoring?: string; sex?: string});

    setErrors(newErrors as {className: string; majoring: string; sex: string});
    console.log(newErrors);
    return valid;
  };
  const handleSelected = async (val: ImageOrVideo) => {
    const filePath = val.path;
    const fileName = filePath.split('/').pop();
    const path = `avatars/${fileName}`;
    const urlImage = await imageService.uploadImageToFirebase(filePath, path);
    console.log(urlImage);
    onchangeProfile('avatar', urlImage ?? auth.avatar);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleNotification = (key: 'error' | 'sucess') => {
    key === 'error'
      ? Notification.showToast('error', t('save_failed'), t('fill_all_info'))
      : Notification.showToast(
          'success',
          t('setup_success'),
          t('welcome_umate'),
        );
  };

  const setUpProfileUser = async () => {
    if (!validateFields()) {
      handleNotification('error');
      return;
    }
    const userInfo = {
      ...profile,
      userId: auth.userId,
      name: profile.userName,
    };
    // console.log(userInfo);
    const isChanged = UserInfo.compareObject(initialProfile, userInfo);
    if (isChanged) {
      const res = await userServices.updateUsersById(userInfo);
      if (res && res.data) {
        const updatedData = {...res.data, accesstoken: auth.accesstoken};
        dispatch(addAuth(updatedData));
        await AsyncStorage.setItem('auth', JSON.stringify(updatedData));
        handleNotification('sucess');
        onNavigation();
      }
      setLoading(false);
    } else {
      console.log('Vui lòng thay đổi thông tin');
      setLoading(false);
    }
  };
  const renderGenderButton = (
    gender: string,
    label: string,
    IconComponent: any,
  ) => (
    <View>
      <ButtonComponent
        type="action"
        iconLeft={
          <IconComponent
            color={
              errors.sex
                ? appColors.red
                : profile.sex === gender
                ? appColors.white
                : appColors.blue2
            }
            size={appInfo.sizeIcon}
          />
        }
        styles={[
          profileStyles.buttonStyles,
          {
            backgroundColor:
              profile.sex === gender ? appColors.blue : colors.card,
            borderColor: errors.sex ? appColors.red : appColors.blueBack,
          },
        ]}
        onPress={() => onchangeProfile('sex', gender)}
      />
      <TextComponent
        label={profile.sex === gender ? label : ''}
        size={12}
        styles={profileStyles.italicText}
      />
    </View>
  );
  return (
    <SafeAreaView
      style={[profileStyles.container, {backgroundColor: colors.background}]}
      key={refreshKey}>
      <HeaderComponent
        title={t('profile')}
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
      />
      <SpaceComponent height={12} />
      <ScrollView>
        <View style={profileStyles.centered}>
          <FastImage
            source={{
              uri: profile.avatar,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode="cover"
            style={[
              globalStyles.userImg,
              {zIndex: -1, width: 160, height: 160},
            ]}
          />
          <View style={[globalStyles.overlay, {...globalStyles.imgStyles}]}>
            <ButtonImagePicker
              multiple={false}
              icon={<Camera size={appInfo.sizeIconBold} color={colors.icon} />}
              onSelect={val => {
                val.type === 'url'
                  ? onchangeProfile('avatar', val.value.toString().trim())
                  : handleSelected(val.value as ImageOrVideo);
              }}
            />
          </View>
        </View>
        <SpaceComponent height={20} />
        <View style={profileStyles.content}>
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label={t('name')} styles={globalStyles.label} />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('userName')}>
              <TextComponent label={profile.userName} color={appColors.grey} />
              <Edit2 color={colors.icon} size={appInfo.sizeIcon} />
            </RowComponent>
          </RowComponent>

          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label={t('sex')} styles={globalStyles.label} />
            <RowComponent styles={profileStyles.genderRow}>
              {renderGenderButton('men', 'Men', Man)}
              {renderGenderButton('woman', 'Women', Woman)}
            </RowComponent>
          </RowComponent>

          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label={t('majoring')} styles={globalStyles.label} />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('majoring')}>
              <TextComponent
                label={profile.majoring.slice(0, 19) + '...'}
                color={appColors.grey}
              />
              <ArrowSquareDown
                color={errors.majoring ? appColors.red : colors.icon}
                size={appInfo.sizeIconBold}
              />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={18} />
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label={t('classname')} styles={globalStyles.label} />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('className')}>
              <TextComponent label={profile.className} color={appColors.grey} />
              <Edit2
                color={errors.majoring ? appColors.red : colors.icon}
                size={appInfo.sizeIcon}
              />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={18} />
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label={t('address')} styles={globalStyles.label} />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('address')}>
              <TextComponent
                label={profile.address ? profile.address : '...'}
                color={appColors.grey}
              />

              <ArrowSquareDown
                color={errors.majoring ? appColors.red : colors.icon}
                size={appInfo.sizeIconBold}
              />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={18} />
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label={t('link_fb')} styles={globalStyles.label} />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('link')}>
              <TextComponent
                label={profile.link ? profile.link.slice(0, 24) : 'facebook...'}
                color={appColors.grey}
              />
              <Edit2
                color={errors.majoring ? appColors.red : colors.icon}
                size={appInfo.sizeIcon}
              />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={18} />
          <RowComponent styles={globalStyles.spaceBetween}>
            <TextComponent label="Bio" styles={globalStyles.label} />
            <RowComponent
              styles={globalStyles.inputRow}
              onPress={() => handleModal('bio')}>
              <TextComponent
                label={profile.bio ? profile.bio : 'description'}
                color={appColors.grey}
              />
              <Edit2
                color={errors.majoring ? appColors.red : colors.icon}
                size={appInfo.sizeIcon}
              />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={50} />
          <ButtonComponent
            label={t('save')}
            styles={{paddingVertical: 8}}
            onPress={debounce(() => {
              setLoading(true);
              setUpProfileUser();
            }, 1000)}
          />
        </View>
        <SpaceComponent height={20} />
      </ScrollView>

      {nameField === 'majoring' ? (
        <EditUserModal
          data={majors}
          nameField={nameField}
          onChangeProfile={onchangeProfile}
          isVisible={visible}
          onClose={onCloseModal}
        />
      ) : nameField === 'address' ? (
        <EditUserModal
          data={address}
          nameField={nameField}
          onChangeProfile={onchangeProfile}
          isVisible={visible}
          onClose={onCloseModal}
        />
      ) : (
        visible && (
          <UpdateInfoModal
            onChangeProfile={onchangeProfile}
            onCloseModal={onCloseModal}
            isVisible={visible}
            nameField={nameField}
          />
        )
      )}
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default SetUpProfile;
