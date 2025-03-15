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
import {globalStyles} from '../../Styles/globalStyle';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
interface Props {
  title: string;
  listUsers: string[];
  navigation: any;
}
const LikeListModal = (props: Props) => {
  const {title, listUsers, navigation} = props;
  const modalizeRef = useRef<Modalize>();
  const [listUserInfo, setListUserInfo] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const getUserForHeartEvent = async () => {
    const res = await userServices.getListUserInfo(listUsers);
    if (res && res.data) {
      console.log(res.data);
      setListUserInfo(res.data);
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
          modalStyle={{backgroundColor: colors.background}}
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

const styles = StyleSheet.create({});
