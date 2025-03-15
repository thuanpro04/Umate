import Share from 'react-native-share';
import storage from '@react-native-firebase/storage';
import {Alert} from 'react-native';
import RNFS from 'react-native-fs';

import {Notification} from '../Untils/Notification';
const uploadImageToFirebase = async (filePath: string, path: string) => {
  try {
    const res = await storage().ref(path).putFile(filePath);
    return await storage().ref(path).getDownloadURL();
  } catch (error) {
    console.log('upload failed', error);
  }
};

const deleteImageToFirebase = async (path: string) => {
  return storage().ref(path).delete();
};
const downLoadImageForMe = async (imageUrl: string) => {
  try {
    const fileName = `downloaded_image_${Date.now()}.jpg`;
    const downloadDest = `${RNFS.PicturesDirectoryPath}/${fileName}`;
    const res = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadDest,
      background: true,
      discretionary: true,
    }).promise;

    if (res.statusCode === 200) {
      Notification.showSnackbar('Tải thành công');
      console.log('Ảnh đã tải về:', downloadDest);
    } else {
      Alert.alert('Lỗi', 'Tải ảnh thất bại.');
    }
  } catch (error) {
    console.error('Lỗi tải ảnh:', error);
    Alert.alert('Lỗi', 'Không thể tải ảnh!');
  }
};

export const imageService = {
  uploadImageToFirebase,
  deleteImageToFirebase,
  downLoadImageForMe,
};
