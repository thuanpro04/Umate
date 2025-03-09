import {Keyboard, Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {Validate} from '../Untils/Validate';
import {CloseCircle} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
interface Props {
  isVisible: boolean;
  nameField: string;
  onChangeProfile: (key: string, value: string) => void;
  onCloseModal: () => void;
  nickName?: string;
}
const UpdateInfoModal = (props: Props) => {
  const {isVisible, nameField, onCloseModal, onChangeProfile, nickName} = props;
  const [messageError, setMessageError] = useState('');
  const [value, setValue] = useState('');

  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const optionMenu = [
    {
      key: 'groupName',
      field: 'Group Name',
    },
    {
      key: 'description',
      field: 'Description',
    },
    {
      key: 'userName',
      field: 'UserName',
    },
    {
      key: 'majoring',
      field: 'Majoring',
    },
    {
      key: 'className',
      field: 'ClassName',
    },
    {
      key: 'majorCategory',
      field: 'MajorCategory',
    },
    {
      key: 'address',
      field: 'Address',
    },
    {
      key: 'link',
      field: 'Link',
    },
    {
      key: 'bio',
      field: 'Bio',
    },
  ];
  const isFacebookURL = (url: string) => {
    const facebookRegex =
      /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]/;
    return facebookRegex.test(url);
  };

  const getField = () => {
    return optionMenu.find(item => item.key === nameField);
  };
  const handleModal = () => {
    Keyboard.dismiss();
    const item = getField();
    const messagesErr =
      value.length < 6 && item?.key !== 'description'
        ? 'Please enter at least 6 characters.'
        : value.length > 25 && item?.key === 'userName'
        ? 'Please no longer than 25 characters.'
        : !isFacebookURL(value) && item?.key === 'link'
        ? 'Invalid URL. Please enter a valid Facebook link.'
        : '';

    setMessageError(messagesErr);

    if (messagesErr.length === 0) {
      const text = nameField === 'userName' ? Validate.UserName(value) : value;
      onChangeProfile(nameField, text);
      onCloseModal();
      setValue(''); // Clear input after successful save
    }
  };
  const fieldName = getField()?.field
    ? getField()?.field
    : nickName
    ? nickName
    : null;
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onCloseModal}>
      <View style={localStyles.modalContainer}>
        <View
          style={[
            localStyles.modalContent,
            {backgroundColor: colors.background},
          ]}>
          <RowComponent>
            <TextComponent label={fieldName ?? ' '} />
            <ButtonComponent
              type="action"
              styles={{position: 'absolute', right: -10, top: -10}}
              iconRight={
                <CloseCircle color={colors.icon} size={appInfo.sizeIconBold} />
              }
              onPress={onCloseModal}
            />
          </RowComponent>
          <SpaceComponent height={10} />
          <InputComponent
            value={value}
            onChange={e => setValue(e)}
            styles={{
              paddingVertical: 6,
              width: '100%',
              backgroundColor: colors.background,
            }}
            placehold={nameField}
          />
          {messageError && (
            <View>
              <SpaceComponent height={14} />
              <TextComponent label={messageError} color={appColors.red} />
            </View>
          )}
          <SpaceComponent height={20} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <ButtonComponent
              label="Enter"
              onPress={handleModal}
              styles={{
                width: '85%',
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateInfoModal;

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,

    borderRadius: 10,
  },
  closeButton: {
    marginBottom: 10,
  },
});
