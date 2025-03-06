import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {RowComponent, SpaceComponent, TextComponent} from '../Components';
import {LikeDislike, MessageRemove, Velas} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
interface Props {
  visible: boolean;
  onClose: () => void;
  onPressAddGroud: () => void;
  listUser?: [];
  onPressRemove: () => void;
}
const InfomationModal = (props: Props) => {
  const {visible, onClose, onPressAddGroud, listUser,onPressRemove} = props;
  const modalizeRef = useRef<Modalize>(null);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);
  const chooseItems = [
    {
      key: 'addgroup',
      icon: <LikeDislike size={appInfo.sizeIconBold} color={colors.icon} />,
      name: 'Add group',
      onPress: () => onPressAddGroud(),
    },
    {
      key: 'ghim',
      icon: (
        <AntDesign
          name="pushpino"
          size={appInfo.sizeIconBold}
          color={colors.icon}
        />
      ),
      name: 'Ghim conversation',
      onPress: () => console.log('hello'),
    },
    {
      key: 'removeconversation',
      icon: <MessageRemove size={appInfo.sizeIconBold} color={colors.icon} />,
      name: 'Remove conversation',
      onPress: () => onPressRemove(),
    },
  ];
  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        onClose={onClose}
        adjustToContentHeight
        modalStyle={{
          paddingHorizontal: 12,
          paddingTop: 18,
          backgroundColor: colors.background,
        }}>
        {listUser
          ? listUser.map(item => {
              return <TextComponent label={item} />;
            })
          : chooseItems.map(item => (
              <React.Fragment key={item.key}>
                <RowComponent
                  styles={{justifyContent: 'flex-start', paddingVertical: 8}}
                  onPress={item.onPress}>
                  {item.icon}
                  <TextComponent label={item.name} title />
                </RowComponent>
                <SpaceComponent height={10} />
              </React.Fragment>
            ))}
      </Modalize>
    </Portal>
  );
};

export default InfomationModal;

const styles = StyleSheet.create({});
