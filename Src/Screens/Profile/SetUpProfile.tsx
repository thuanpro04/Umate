import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {
  ArrowLeft2,
  ArrowSquareDown,
  Camera,
  Edit2,
  Man,
  More,
  Woman
} from 'iconsax-react-native';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addAuth, authSelector } from '../../redux/reducers/authReducer';
import { globalStyles } from '../../Styles/globalStyle';
import { appInfo } from '../../Theme/appInfo';
import { appColors } from '../../Theme/Colors/appColors';
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
import { userServices } from '../Services/userService';
import { Notification } from '../Untils/Notification';
import { UserInfo } from '../Untils/UserInfo';
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
  
  const validateFields = () => {
    const newErrors = {className: '', majoring: '', sex: ''};
    let valid = true;

    if (!profile.className) {
      newErrors.className = 'className is required';
      valid = false;
    }
    if (!profile.majoring) {
      newErrors.majoring = 'Majoring is required';
      valid = false;
    }
    if (!profile.sex) {
      newErrors.sex = 'Sex is required';
      valid = false;
    }

    setErrors(newErrors);
    console.log(errors);
    return valid;
  };

  const handleModal = (key: string) => {
    setNameField(key);
    setVisible(true);
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
  const onCloseModal = () => {
    setVisible(false);
  };
  const handleSelected = async (val: ImageOrVideo) => {
    const filePath = val.path;
    const fileName = filePath.split('/').pop();
    const path = `avatars/${fileName}`;
    const urlImage = await getDownloadURLFirebase(filePath, path);
    onchangeProfile('avatar', urlImage ?? auth.avatar);
    setRefreshKey(prevKey => prevKey + 1);
  };
  const getDownloadURLFirebase = async (filePath: string, path: string) => {
    try {
      const res = await storage().ref(path).putFile(filePath);
      console.log(
        'Upload completed with bytes transferred:',
        res.bytesTransferred,
      );
      const url = await storage().ref(path).getDownloadURL();
      return url;
    } catch (error) {
      console.log('handleSelected profile', error);
    }
  };
  console.log(auth, 'Profile');

  const setUpProfileUser = async () => {
    setLoading(true);
    if (!validateFields()) {
      Notification.showToast(
        'error',
        'Save failed',
        'Please fill in all information😔',
      );
      return;
    }
    const userInfo = {
      userID: auth.userID,
      name: profile.userName,
      className: profile.className,
      majoring: profile.majoring,
      majorCategory: profile.majorCategory,
      avatar: profile.avatar,
      sex: profile.sex,
    };

    try {
      const res = await userServices.updateUsersById(userInfo);
      console.log('profile', res.data);

      if (res.data) {
        let accesstoken = auth.accesstoken;
        const userData = {...res.data, accesstoken};
        dispatch(addAuth(userData));
        await AsyncStorage.setItem('auth', JSON.stringify(userData));
        Notification.showToast(
          'success',
          'Setup Success',
          'Welcome to UMate 👋',
        );
      }
      setLoading(false);
    } catch (error) {
      console.log('Set up profile failed', error);
      setLoading(false);
    }
  };
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
        <View style={styles.overlay}>
          <ButtonImagePicker
            multiple={false}
            icon={
              <Camera size={appInfo.sizeIconBold} color={appColors.blueBack} />
            }
            onSelect={val =>
              val.type === 'url'
                ? onchangeProfile('avatar', val.value.toString().trim())
                : handleSelected(val.value as ImageOrVideo)
            }
          />
        </View>
      </View>
      <SpaceComponent height={80} />
      <View style={styles.content}>
        <RowComponent styles={styles.spaceBetween}>
          <TextComponent label="UserName" styles={styles.label} />
          <RowComponent
            styles={styles.inputRow}
            onPress={() => handleModal('userName')}>
            <TextComponent label={profile.userName} color={appColors.grey} />
            <Edit2 color={appColors.blue2} size={appInfo.sizeIcon} />
          </RowComponent>
        </RowComponent>

        <RowComponent styles={styles.spaceBetween}>
          <TextComponent label="Sex" styles={styles.label} />
          <RowComponent styles={styles.genderRow}>
            {renderGenderButton('men', 'Men', Man)}
            {renderGenderButton('woman', 'Women', Woman)}
          </RowComponent>
        </RowComponent>

        <RowComponent styles={styles.spaceBetween}>
          <TextComponent label="Majoring" styles={styles.label} />
          <RowComponent
            styles={styles.inputRow}
            onPress={() => handleModal('majoring')}>
            <TextComponent label={profile.majoring} color={appColors.grey} />
            <ArrowSquareDown
              color={errors.majoring ? appColors.red : appColors.blue2}
              size={appInfo.sizeIconBold}
            />
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.spaceBetween}>
          <TextComponent label="className" styles={styles.label} />
          <RowComponent
            styles={styles.inputRow}
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
          lable="Save"
          styles={{paddingVertical: 6}}
          onPress={() => {
            setUpProfileUser();
            onNavigation();
          }}
          disabled={nameField ? false : true}
        />
      </View>

      <EditUserModal
        nameField={nameField}
        onChangeProfile={onchangeProfile}
        isVisible={visible}
        onClose={onCloseModal}
      />
    </ContainerComponent>
  );
};

export default SetUpProfile;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...globalStyles.userImg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    paddingHorizontal: 35,
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '400',
    color: appColors.blueBack,
  },
  inputRow: {
    borderBottomWidth: 0.2,
    borderColor: appColors.blue3,
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
