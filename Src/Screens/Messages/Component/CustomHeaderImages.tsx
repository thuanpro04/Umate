import React from 'react';
import {Alert, StyleSheet, ToastAndroid} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appColors} from '../../../Theme/Colors/appColors';
import {RowComponent, SpaceComponent} from '../../Components';
import {imageService} from '../../Services/imageService';
interface Props {
  onPressClose: () => void;
  img: any;
}
const CustomHeaderImages = (props: Props) => {
  const {onPressClose, img} = props;

  const downloadImage = async () => {
    imageService.downLoadImageForMe(img.uri);
   ToastAndroid.show("Lưu thành công",ToastAndroid.SHORT)
  };
  return (
    <RowComponent styles={{justifyContent: 'flex-end', padding: 16}}>
      <MaterialIcons
        name="file-download"
        color={'#eeeeee'}
        size={32}
        onPress={() => downloadImage()}
      />
      <SpaceComponent width={40} />
      <MaterialIcons
        name="close"
        color={'#eeeeee'}
        size={32}
        onPress={onPressClose}
      />
    </RowComponent>
  );
};

export default CustomHeaderImages;

const styles = StyleSheet.create({});
