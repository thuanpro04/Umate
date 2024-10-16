import {Modal, StyleSheet, Text, View} from 'react-native';
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
interface Props {
  onSelect: (val: {
    type: 'url' | 'file';
    value: string | ImageOrVideo[] | ImageOrVideo;
  }) => void;
}
const ButtonImagePicker = (props: Props) => {
  const {onSelect} = props;
  const modalizeRef = useRef<Modalize>();
  const [imageUrl, setImageUrl] = useState('');
  const [isVisibleModalAddUrl, setIsVisibleModalAddUrl] = useState(false);
  const choiceImages = [
    {
      key: 'camera',
      title: 'Take a picture.',
      icon: <Camera size={appInfo.sizeIcon} color={appColors.grey} />,
    },
    {
      key: 'library',
      title: 'From library.',
      icon: (
        <Feather name="image" size={appInfo.sizeIcon} color={appColors.grey} />
      ),
    },
    {
      key: 'url',
      title: 'From url.',
      icon: <Link size={appInfo.sizeIcon} color={appColors.grey} />,
    },
  ];
  const renderItems = (item: {icon: ReactNode; key: string; title: string}) => {
    return (
      <RowComponent
        key={item.key}
        styles={{justifyContent: 'flex-start'}}
        onPress={() => handleChoiceImages(item.key)}>
        {item.icon}
        <SpaceComponent height={30} />
        <TextComponent label={item.title} title />
      </RowComponent>
    );
  };
  const handleChoiceImages = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker({
          cropping: true,
          mediaType: 'photo',
          multiple: true,
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
        type="action"
        iconLeft={
          <Image size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
        onPress={() => modalizeRef.current?.open()}
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View style={{marginVertical: 30, paddingHorizontal: 20}}>
            {choiceImages.map(element => renderItems(element))}
          </View>
        </Modalize>
      </Portal>
      <Modal
        visible={isVisibleModalAddUrl}
        style={{flex: 1}}
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
                backgroundColor: appColors.white,
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
                <AntDesign name="close" size={24} color={appColors.grey} />
              </TouchableOpacity>
            </RowComponent>
            <TextComponent label="Image Url" title size={18} />
            <InputComponent
              placehold="URL"
              value={imageUrl}
              onChange={val => setImageUrl(val)}
              allowClear
            />
            <SpaceComponent height={10} />
            <RowComponent styles={{justifyContent: 'flex-end'}}>
              <ButtonComponent
                lable="Agree"
                onPress={() => {
                  setIsVisibleModalAddUrl(false);
                  onSelect({type: 'url', value: imageUrl});
                  setImageUrl('');
                }}
                lableColor={appColors.white}
                styles={{
                  backgroundColor: appColors.blue,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
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
