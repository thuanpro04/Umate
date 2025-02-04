import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {TextComponent} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';
import {userServices} from '../Services/userService';
import CarUserLikeComponent from '../Home/Components/CarUserLikeComponent';
import { globalStyles } from '../../Styles/globalStyle';
interface Props {
  title: string;
  listUsers: string[];
  navigation: any;
}
const LikeListModal = (props: Props) => {
  const {title, listUsers, navigation} = props;
  const modalizeRef = useRef<Modalize>();
  const [listUserInfo, setListUserInfo] = useState<any[]>([]);

  const getUserForHeartEvent = async () => {
    try {
      const res = await userServices.getListUserInfo(listUsers);
      if (res.data) {
        console.log(res.data);
        setListUserInfo(res.data);
      }
    } catch (error) {
      console.error('get user for heart event error: ', error);
    }
  };
  const onOpenModal = async () => {
    modalizeRef.current?.open();
    getUserForHeartEvent();
  };
  const onCloseModal = () => {
    modalizeRef.current?.close();
  };
  
  const renderItems = ({item, index}: any) => {
    return (
      <CarUserLikeComponent
        item={item}
        key={index}
        navigation={navigation}
        onCloseModal={onCloseModal}
      />
    );
  };
  return (
    <View>
      <TouchableOpacity onPress={() => onOpenModal()}>
        <TextComponent label={title} styles={globalStyles.actionText} />
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: StatusBar.currentHeight,
            }}>
            {listUserInfo &&
              listUserInfo.map((item: any, index) =>
                renderItems({item, index}),
              )}
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default LikeListModal;

const styles = StyleSheet.create({
  
});
