import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {
  ArrowLeft2,
  ArrowSquareDown,
  Camera,
  Edit2,
  Man,
  More,
  Woman,
} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Vibration, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import ButtonImagePicker from '../Messages/Component/ButtonImagePicker';
import EditUserModal from '../Modal/EditUserModal';
import {userServices} from '../Services/userService';
import {Notification} from '../Untils/Notification';
import {UserInfo} from '../Untils/UserInfo';
import LoadingModal from '../Modal/LoadingModal';
import {imageService} from '../Services/imageService';
import UpdateInfoModal from '../Modal/UpdateInfoModal';
interface ProfileType {
  userName: string;
  majoring: string;
  className: string;
  avatar: string;
  sex: string;
  majorCategory: string;
}

const SetUpProfile = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const [isLoading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [errors, setErrors] = useState({className: '', majoring: '', sex: ''});
  const [isDisable, setIsDisable] = useState(true);
  const initialProfile: ProfileType = {
    userName: UserInfo.getName(auth.name),
    majoring: auth.majoring ?? '',
    className: auth.className ?? '',
    avatar: auth.avatar ?? '',
    sex: auth.sex ?? '',
    majorCategory: auth.majorCategory ?? '',
  };
  const [profile, setProfile] = useState(initialProfile);
  const [visible, setVisible] = useState(false);
  const [nameField, setNameField] = useState('');

  const dispatch = useDispatch();
  const onNavigation = () => {
    navigation.navigate('Profile');
  };
  const onchangeProfile = useCallback((key: string, value: string) => {
    setProfile(prev => ({...prev, [key]: value}));
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
    try {
      const filePath = val.path;
      const fileName = filePath.split('/').pop();
      const path = `avatars/${fileName}`;
      const urlImage = await imageService.uploadImageToFirebase(filePath, path);
      console.log(urlImage);
      onchangeProfile('avatar', urlImage ?? auth.avatar);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      console.log('upload failed', error);
    }
  };

  const handleNotification = (key: 'error' | 'sucess') => {
    key === 'error'
      ? Notification.showToast(
          'error',
          'Save failed',
          'Please fill in all information😔',
        )
      : Notification.showToast(
          'success',
          'Setup Success',
          'Welcome to UMate 👋',
        );
  };
  const setUpProfileUser = async () => {
    if (!validateFields()) {
      handleNotification('error');
      return;
    }
    const userInfo = {
      ...profile,
      userID: auth.userID,
      name: profile.userName,
    };
    try {
      const res = await userServices.updateUsersById(userInfo);
      if (res.data) {
        const updatedData = {...res.data, accesstoken: auth.accesstoken};
        dispatch(addAuth(updatedData));
        await AsyncStorage.setItem('auth', JSON.stringify(updatedData));
      }
      handleNotification('sucess');
      setLoading(false);
    } catch (error) {
      console.log('Set up profile failed', error);
      setLoading(false);
    }
  };
  const renderGenderButton = (
    gender: string,
    label: string,
    IconComponent: any,
  ) => (
    <View style={styles.centered}>
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
          styles.buttonStyles,
          {
            backgroundColor:
              profile.sex === gender ? appColors.blue : appColors.white,
            borderColor: errors.sex ? appColors.red : appColors.blueBack,
          },
        ]}
        onPress={() => onchangeProfile('sex', gender)}
      />
      <TextComponent
        label={profile.sex === gender ? label : ''}
        size={12}
        styles={styles.italicText}
      />
    </View>
  );
  return (
    <ContainerComponent styles={{}} key={refreshKey}>
      <HeaderComponent
        title="Profile"
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
        iconRight={
          <More size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
      />
      <SpaceComponent height={20} />
      <View style={styles.centered}>
        <Image
          source={{uri: profile.avatar}}
          resizeMode="cover"
          style={[globalStyles.userImg, {zIndex: -1, width: 160, height: 160}]}
        />
        <View style={[globalStyles.overlay, {...globalStyles.imgStyles}]}>
          <ButtonImagePicker
            multiple={false}
            icon={
              <Camera size={appInfo.sizeIconBold} color={appColors.blueBack} />
            }
            onSelect={val => {
              val.type === 'url'
                ? onchangeProfile('avatar', val.value.toString().trim())
                : handleSelected(val.value as ImageOrVideo);
              handleModal('avatar');
            }}
          />
        </View>
      </View>
      <SpaceComponent height={80} />
      <View style={styles.content}>
        <RowComponent styles={globalStyles.spaceBetween}>
          <TextComponent label="UserName" styles={globalStyles.label} />
          <RowComponent
            styles={globalStyles.inputRow}
            onPress={() => handleModal('userName')}>
            <TextComponent label={profile.userName} color={appColors.grey} />
            <Edit2 color={appColors.blue2} size={appInfo.sizeIcon} />
          </RowComponent>
        </RowComponent>

        <RowComponent styles={globalStyles.spaceBetween}>
          <TextComponent label="Sex" styles={globalStyles.label} />
          <RowComponent styles={styles.genderRow}>
            {renderGenderButton('men', 'Men', Man)}
            {renderGenderButton('woman', 'Women', Woman)}
          </RowComponent>
        </RowComponent>

        <RowComponent styles={globalStyles.spaceBetween}>
          <TextComponent label="Majoring" styles={globalStyles.label} />
          <RowComponent
            styles={globalStyles.inputRow}
            onPress={() => handleModal('majoring')}>
            <TextComponent label={profile.majoring} color={appColors.grey} />
            <ArrowSquareDown
              color={errors.majoring ? appColors.red : appColors.blue2}
              size={appInfo.sizeIconBold}
            />
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={globalStyles.spaceBetween}>
          <TextComponent label="className" styles={globalStyles.label} />
          <RowComponent
            styles={globalStyles.inputRow}
            onPress={() => handleModal('className')}>
            <TextComponent label={profile.className} color={appColors.grey} />
            <Edit2
              color={errors.majoring ? appColors.red : appColors.blue2}
              size={appInfo.sizeIcon}
            />
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={50} />
        <ButtonComponent
          label="Save"
          styles={{paddingVertical: 6}}
          onPress={() => {
            setLoading(true);
            setTimeout(() => {
              setUpProfileUser();
              onNavigation();
            }, 1000);
          }}
          disabled={nameField ? false : true}
        />
      </View>

      {nameField === 'majoring' ? (
        <EditUserModal
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
    </ContainerComponent>
  );
};

export default SetUpProfile;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    paddingHorizontal: 35,
    justifyContent: 'center',
  },

  genderRow: {
    justifyContent: 'space-evenly',
    flex: 1,
  },
  buttonStyles: {
    borderWidth: 0.3,
    padding: 8,
    borderRadius: 12,
  },
  italicText: {
    fontStyle: 'italic',
  },
});
