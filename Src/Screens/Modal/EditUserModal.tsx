import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {List} from 'react-native-paper';
import {TextComponent} from '../Components';
import SearchComponent from '../Search/components/SearchComponent';
import {Validate} from '../Untils/Validate';
import {add} from 'lodash';

interface Props {
  onChangeProfile: (key: string, value: string) => void;
  nameField: string;
  isVisible: boolean;
  onClose: () => void;
  data: any[];
}

const EditUserModal = (props: Props) => {
  const {onChangeProfile, nameField, isVisible, onClose, data} = props;
  const [value, setValue] = useState('');
  const [address, setAddress] = useState<any[]>(data);
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
        ? 'Username must be at least 6 characters long.'
        : value.length > 15
        ? 'Username must be no longer than 15 characters.'
        : '';

    setMessageError(messagesErr);

    if (messagesErr.length === 0) {
      const text = nameField === 'userName' ? Validate.UserName(value) : value;
      onChangeProfile(nameField, text);
      onCloseModal();
      setValue(''); // Clear input after successful save
    }
  };
  const onChangeText = (e: string) => {
    setValue(e);
    if (e.trim() === '') {
      setAddress(data);
    } else {
      const filterData = data.filter(item =>
        item.name.toLowerCase().includes(e.toLowerCase().trim()),
      );

      console.log(filterData);

      setAddress(filterData);
    }
  };

  const modalHeight = nameField === 'majoring' ? 650 : 230;
  const renderMajoring = ({item, index}: any) => {
    return (
      <List.Section key={index}>
        <List.Accordion title={item.title}>
          {item.data.map((element: any) => (
            <List.Item
              key={element}
              title={element}
              onPress={() => {
                onChangeProfile(nameField, element);
                onChangeProfile('majorCategory', item.title.toString());
              }}
            />
          ))}
        </List.Accordion>
      </List.Section>
    );
  };
  const renderItemAddress = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.main}
        onPress={() => {
          onChangeProfile('address', item.name)
        }}>
        <TextComponent label={index + 1 + '. ' + item.name} />
      </TouchableOpacity>
    );
  };
  return (
    <Modalize
      ref={modalizeRef}
      handlePosition="outside"
      adjustToContentHeight
      onClose={onClose}
      HeaderComponent={
        nameField === 'majoring' && <TextComponent title label="Chuyên Ngành" />
      }
      modalStyle={styles.modalStyle}>
      {nameField === 'majoring' ? (
        <ScrollView style={{maxHeight: 700, flex: 1}}>
          {data.map((item, index) => renderMajoring({item, index}))}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView style={styles.container}>
          <SearchComponent onChangeText={onChangeText} text={value} />
          <ScrollView style={{maxHeight: 660}}>
            {address.map((item, index) => renderItemAddress({item, index}))}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Modalize>
  );
};

export default EditUserModal;

const styles = StyleSheet.create({
  modalStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    flex: 1,
  },
  main: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  container: {
    flex: 1,
  },
});
