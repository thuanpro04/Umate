import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {
  ButtonComponent,
  InputComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';
import {Save2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {Validate} from '../Untils/Validate';
import {majors} from '../../data/majoring';
import {List} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

interface Props {
  onChangeGroup: (key: string, value:{name:string, userID?:string} | string) => void;
  nameField: string;
  isVisible: boolean;
  onClose: () => void;
}

const AddGroupModal = (props: Props) => {
  const {onChangeGroup, nameField, isVisible, onClose} = props;
  const [value, setValue] = useState('');
  const modalizeRef = useRef<Modalize>(null);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    if (isVisible) {
      onOpenModal();
    } else {
      onCloseModal();
    }
  }, [isVisible]);
  const onOpenModal = useCallback(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  }, []);
  // Use useCallback to ensure the function reference remains stable
  const onCloseModal = useCallback(() => {
    if (modalizeRef.current) {
      modalizeRef.current.close();
    }
  }, []);

  const handleModal = () => {
    Keyboard.dismiss();
    const messagesErr =
      value.length < 6
        ? `${nameField} must be at least 6 characters long.`
        : value.length > 15
        ? `${nameField} must be no longer than 15 characters.`
        : '';

    setMessageError(messagesErr);

    if (messagesErr.length === 0) {
      const text = nameField === 'userName' ? Validate.UserName(value) : value;
      onChangeGroup(nameField, text);
      onCloseModal();
      setValue(''); // Clear input after successful save
    }
  };

  const modalHeight = nameField === 'majoring' ? 650 : 230;

  return (
    <Modalize
      ref={modalizeRef}
      handlePosition="outside"
      modalHeight={modalHeight}
      onClose={onClose}
      HeaderComponent={
        nameField === 'majoring' && <TextComponent title label="Chuyên Ngành" />
      }
      modalStyle={styles.modalStyle}>
      {nameField === 'majoring' ? (
        <View>
          {majors.map((item, index) => (
            <List.Section key={index}>
              <List.Accordion title={item.title}>
                {item.data.map((element: any) => (
                  <List.Item
                    key={element}
                    title={element}
                    onPress={() => {
                      onChangeGroup(nameField, element);
                      onChangeGroup('majorCategory',item.title);
                    }}
                  />
                ))}
              </List.Accordion>
            </List.Section>
          ))}
        </View>
      ) : (
        <View style={{paddingHorizontal: 12}}>
          <TextComponent
            label={Validate.UserName(nameField)}
            color={appColors.blueBack}
            title
          />
          <SpaceComponent height={10} />
          <InputComponent
            value={value}
            placehold={nameField + '...'}
            onChange={(e: any) => setValue(e)}
            styles={{paddingVertical: 5}}
            allowClear
          />
          {messageError && (
            <View>
              <SpaceComponent height={14} />
              <TextComponent label={messageError} color={appColors.red} />
            </View>
          )}
          <SpaceComponent height={18} />
          <View style={{alignItems: 'flex-end'}}>
            <ButtonComponent
              label="Save"
              textStyle={{color: appColors.white}}
              iconLeft={
                <Save2 color={appColors.white} size={appInfo.sizeIconBold} />
              }
              styles={{
                borderWidth: 0.4,
                paddingVertical: 3,
                paddingHorizontal: 12,
              }}
              onPress={handleModal}
            />
          </View>
        </View>
      )}
    </Modalize>
  );
};

export default AddGroupModal;

const styles = StyleSheet.create({
  modalStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
 
  },
});
