import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  DateTimePickerComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DropdownPicker from '../Components/DropdownPicker';
import {globalStyles} from '../../Styles/globalStyle';
import {userServices} from '../Services/userService';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import ButtonImagePicker from '../Messages/Component/ButtonImagePicker';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {imageService} from '../Services/imageService';
import {CloseCircle} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {Validate} from '../Untils/Validate';
import eventApi from '../../apis/eventApi';
const initValues = {
  content: '',
  photoUrl: '',
  authorId: '',
  invitedUsers: [],
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
};
const PostEvent = ({setIsTabBarVisible, navigation}: any) => {
  const [users, setUsers] = useState<any>([]);
  const [messageErrors, setMessageErrors] = useState<any[]>([]);
  const auth = useSelector(authSelector);
  const [pathImage, setPathImage] = useState('');
  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorId: auth.userID,
  });
  // const navigation = useNavigation();
  const onChangeValue = (
    key: string,
    value: {name: string | string[]; data?: any} | string,
  ) => {
    setEventData({...eventData, [key]: value});
    console.log(eventData);
  };
  useFocusEffect(
    useCallback(() => {
      getAllUsers();
    }, []),
  );
  useEffect(() => {
    const mess = Validate.eventValidation(eventData);
    setMessageErrors(mess);
  }, [eventData]);

  const getAllUsers = async () => {
    try {
      const res = await userServices.getEquestFriendUsers(auth.userID, '');
      if (res) {
        const data = res.map((user: any) => ({
          name: user.name,
          avatar: user.avatar,
          userID: user.userID,
          majorCategory: user.majorCategory,
        }));
        setUsers(data);
      }
    } catch (error) {
      console.log('Post event get users failed');
    }
  };
  function getPathImage(filePath: string) {
    const fileName = filePath.split('/').pop();
    return `events/${fileName}`;
  }
  const handleSelected = async (val: ImageOrVideo) => {
    try {
      const filePath = val.path;
      const path = getPathImage(filePath);
      setPathImage(path);
      const url = await imageService.uploadImageToFirebase(
        filePath,
        getPathImage(filePath),
      );
      onChangeValue('photoUrl', {name: url});
    } catch (error) {
      console.log('handleSelected', error);
    }
  };
  console.log(pathImage);
  const removeImage = async () => {
    try {
      const res = await imageService.deleteImageToFirebase(pathImage);
      onChangeValue('photoUrl', '');
    } catch (error) {
      console.log('remove image', error);
    }
  };
  const handlePostEventData = async () => {
    if (messageErrors.length === 0) {
      try {
        const res = await eventApi.handleEvent('/add-new', eventData, 'post');
        if (res) {
          console.log(res.data);
        }
        navigation.navigate('Home');
      } catch (error) {
        console.log('handlePostEventData', error);
      }
    }
  };
  return (
    <ContainerComponent styles={styles.container} isScroll>
      <TextComponent
        label="Add New Event"
        styles={styles.textStyle}
        size={28}
      />
      <SpaceComponent height={15} />
      {!eventData.photoUrl ? (
        <ButtonImagePicker
          title="Upload Images"
          onSelect={val => {
            val.type === 'url'
              ? onChangeValue('photoUrl', {name: val.value as string})
              : handleSelected(val.value as ImageOrVideo);
          }}
        />
      ) : (
        <RowComponent styles={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={{uri: eventData.photoUrl.name}}
            style={{width: '90%', height: 250, borderRadius: 12}}
          />
          <CloseCircle
            size={appInfo.sizeIconBold}
            color={appColors.blueBack}
            style={{position: 'absolute', top: -20, right: 20}}
            onPress={() => removeImage()}
          />
        </RowComponent>
      )}
      <SpaceComponent height={20} />
      <InputComponent
        value={eventData.content}
        onChange={text => onChangeValue('content', text)}
        placehold="content..."
        allowClear
        styles={styles.inputStyles}
        onFocus={() => setIsTabBarVisible(false)}
        onBlur={() => setIsTabBarVisible(true)}
        onEnd={() => setIsTabBarVisible(true)}
        type="default"
        multiline
        numberOfLines={7}
      />

      <SpaceComponent height={25} />
      <RowComponent>
        <View style={{flex: 1}}>
          <TextComponent label="StartAt: " styles={styles.textStyle} />
          <DateTimePickerComponent
            type="time"
            onSelect={val => onChangeValue('startAt', val.toString())}
            dateSelected={eventData.startAt}
          />
        </View>
        <View style={{flex: 1}}>
          <TextComponent label="EndAt: " styles={styles.textStyle} />
          <DateTimePickerComponent
            type="time"
            onSelect={val => onChangeValue('endAt', val.toString())}
            dateSelected={eventData.endAt}
          />
        </View>
      </RowComponent>
      <SpaceComponent height={25} />
      <View>
        <TextComponent label="date" styles={styles.textStyle} />
        <DateTimePickerComponent
          type="date"
          onSelect={val => onChangeValue('date', val.toString())}
          dateSelected={eventData.date}
        />
      </View>
      <SpaceComponent height={25} />

      <View>
        <TextComponent label={'Invited users'} styles={styles.textStyle} />
        <DropdownPicker
          placeHold="Selected"
          users={users}
          onChangeValue={onChangeValue}
          userSelected={eventData.invitedUsers}
        />
      </View>
      <SpaceComponent height={10} />
      {messageErrors.length > 0 && (
        <View>
          {messageErrors.map((item, index) => (
            <TextComponent
              key={index}
              label={item}
              color={appColors.red}
              styles={{marginBottom: 12}}
            />
          ))}
        </View>
      )}
      <SpaceComponent height={20} />
      <ButtonComponent
        disabled={messageErrors.length > 0}
        label="Add New "
        onPress={() => handlePostEventData()}
        type="primary"
        styles={{paddingVertical: 10}}
      />
      <SpaceComponent height={65} />
    </ContainerComponent>
  );
};

export default PostEvent;

const styles = StyleSheet.create({
  inputStyles: {
    paddingVertical: 8,
    width: '100%',
  },
  container: {
    paddingHorizontal: 12,
  },
  textStyle: {fontWeight: 'bold', marginBottom: 6},
});
