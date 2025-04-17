import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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

  const getUserForHeartEvent = useCallback(
    async (users: string[]) => {
      if (users?.length === 0) {
        setListUserInfo([]);
        return;
      }
      const res = await userServices.getListUserInfo(users);
      if (res && res.data) {
        setListUserInfo(res.data);
      }
    },
    [listUsers],
  );

  useEffect(() => {
    getUserForHeartEvent(listUsers);
  }, [listUsers]);
  const onOpenModal = () => {
    modalizeRef.current?.open();
  };
  const onCloseModal = () => {
    modalizeRef.current?.close();
  };

  const renderItems = useCallback(
    ({item, index}: any) => {
      return (
        <CarUserLikeComponent
          item={item}
          key={index}
          navigation={navigation}
          onCloseModal={onCloseModal}
        />
      );
    },
    [navigation, onCloseModal],
  );

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
