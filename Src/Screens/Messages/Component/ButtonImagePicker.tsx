import {Keyboard, Modal, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {appColors} from '../../../Theme/Colors/appColors';
import {Camera, Image, Link} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
import {Modalize} from 'react-native-modalize';
import Feather from 'react-native-vector-icons/Feather';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import {Portal} from 'react-native-portalize';
import {globalStyles} from '../../../Styles/globalStyle';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
interface Props {
  onSelect: (val: {
    type: 'url' | 'file';
    value: string | ImageOrVideo[] | ImageOrVideo;
  }) => void;
  icon?: ReactNode;
  multiple?: boolean;
  title?: string;
  isBlock?: boolean;
  handleToastNotificationBlock?: () => void;
}
const ButtonImagePicker = (props: Props) => {
  const {
    onSelect,
    icon,
    multiple,
    title,
    isBlock,
    handleToastNotificationBlock,
  } = props;
  const modalizeRef = useRef<Modalize>();
  const [imageUrl, setImageUrl] = useState('');
  const [isVisibleModalAddUrl, setIsVisibleModalAddUrl] = useState(false);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  const choiceImages = [
    {
      key: 'camera',
      title: 'picture',
      icon: <Camera size={appInfo.sizeIcon} color={colors.icon} />,
    },
    {
      key: 'library',
      title: 'from_library',
      icon: (
        <Feather name="image" size={appInfo.sizeIcon} color={colors.icon} />
      ),
    },
    {
      key: 'url',
      title: 'from_url',
      icon: <Link size={appInfo.sizeIcon} color={colors.icon} />,
    },
  ];

  const renderItems = (item: {icon: ReactNode; key: string; title: string}) => {
    return (
      <RowComponent
        key={item.key}
        styles={{justifyContent: 'flex-start', paddingVertical: 8}}
        onPress={() => handleChoiceImages(item.key)}>
        {item.icon}
        <SpaceComponent height={30} />
        <TextComponent label={t(`${item.title}`)} title />
      </RowComponent>
    );
  };
  const handleChoiceImages = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker({
          cropping: true,
          mediaType: 'photo',
          multiple: multiple ?? false,
        })
          .then(res => {
            onSelect({type: 'file', value: res});
          })
          .catch(error => {
            if (error.code === 'E_PICKER_CANCELLED') {
              console.log('User cancelled image selection');
            } else {
              console.error('Error selecting image:', error);
            }
          });
        break;
      case 'camera':
        ImageCropPicker.openCamera({mediaType: 'photo'})
          .then(res => {
            onSelect({type: 'file', value: res});
          })
          .catch(error => {
            if (error.code === 'E_PICKER_CANCELLED') {
              console.log('User cancelled image selection');
            } else {
              console.error('Error capturing image:', error);
            }
          });
        break;
      default:
        setIsVisibleModalAddUrl(true);

        break;
    }
    modalizeRef.current?.close();
  };
  return (
    <View>
      <ButtonComponent
        styles={{marginTop: 10}}
        type="action"
        iconLeft={icon}
        onPress={() =>
          isBlock
            ? handleToastNotificationBlock && handleToastNotificationBlock()
            : modalizeRef.current?.open()
        }>
        {<TextComponent label={title ?? ''} />}
      </ButtonComponent>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          modalStyle={{backgroundColor: colors.background}}
          handlePosition="inside">
          <View style={{marginVertical: 30, paddingHorizontal: 20}}>
            {choiceImages.map(element => renderItems(element))}
          </View>
        </Modalize>
      </Portal>

      <Modal
        visible={isVisibleModalAddUrl}
        style={{flex: 1, backgroundColor: colors.background}}
        statusBarTranslucent
        transparent
        animationType="slide">
        <View
          style={[
            globalStyles.container,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={[
              {
                borderRadius: 12,
                backgroundColor: colors.background,
                width: '90%',
                padding: 20,
              },
            ]}>
            <RowComponent styles={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  setIsVisibleModalAddUrl(false);
                  setImageUrl('');
                }}>
                <AntDesign name="close" size={24} color={colors.icon} />
              </TouchableOpacity>
            </RowComponent>
            <TextComponent label="Image Url" title size={18} />
            <InputComponent
              placehold="URL"
              value={imageUrl}
              onChange={val => setImageUrl(val)}
              allowClear
              styles={{width: '100%', marginTop: 8, paddingVertical: 6}}
            />
            <SpaceComponent height={16} />
            <RowComponent styles={{justifyContent: 'flex-end'}}>
              <ButtonComponent
                label="Agree"
                onPress={() => {
                  setIsVisibleModalAddUrl(false);
                  onSelect({type: 'url', value: imageUrl});
                  setImageUrl('');
                }}
                styles={{
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                }}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ButtonImagePicker;

const styles = StyleSheet.create({});
