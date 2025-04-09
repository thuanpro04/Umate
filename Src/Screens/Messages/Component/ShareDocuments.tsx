import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {appColors} from '../../../Theme/Colors/appColors';
import {appInfo} from '../../../Theme/appInfo';

interface Props {
  isStacked: boolean;
  isRight: boolean;
  arrImages: string[];
  navigation: any; // Thay thế bằng kiểu dữ liệu chính xác nếu có
}
const ShareDocuments = (props: Props) => {
  const {isStacked, isRight, arrImages, navigation} = props;
  return (
    <EvilIcons
      name="share-google"
      color={appColors.blueBack}
      size={appInfo.sizeIconBold}
      style={{
        position: isStacked ? 'absolute' : 'relative',
        left: isRight ? undefined : appInfo.size.WIDTH * 0.57, // Điều chỉnh khoảng cách từ trái
        right: isRight && isStacked ? appInfo.size.WIDTH * 0.57 : 0,
        top: isStacked ? appInfo.size.HEIGHT * 0.12 : 0,
      }}
      onPress={() =>
        navigation.navigate('ShareScreen', {
          arrUrlImages: arrImages,
          isShare: true,
        })
      }
    />
  );
};

export default ShareDocuments;

const styles = StyleSheet.create({});
