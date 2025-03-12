import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import {ArrowLeft2} from 'iconsax-react-native';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent} from '../Components';
import {messageServices} from '../Services/messageServices';
import CustormImageViewing from './Component/CustormImageViewing';
import { useTranslation } from 'react-i18next';

const YourImagesScreen = () => {
  const {id, type} = useRoute().params as {id: string; type: string};
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [converInfo, setConverInfo] = useState<any>('');
  const [visible, setVisible] = useState(false);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  const columnCount = 4;
  // const images: any = [
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354086332.jpg?alt=media&token=238e3e5f-ebcf-45bc-ba52-c6a965909ee5',
  //   'https://firebasestorage.googleapis.com/v0/b/umate-addb5.appspot.com/o/images%2F1741354204623.jpg?alt=media&token=6764400f-662e-476c-91b3-8c0a67d7c561',
  // ];
  useFocusEffect(
    useCallback(() => {
      const getImageForConversation = async () => {
        if (!id) {
          return;
        }
        try {
          const res = await messageServices.getImages(id, type);
          if (res && res.data) {
            setImages(res.data);
            console.log('get image successfully ', res.data);
          }
        } catch (error) {
          console.log('Get images fail: ', error);
        }
      };
      getImageForConversation();
    }, [id]),
  );
  const onPressImg = (urlImg: string) => {
    const tempUrl = {uri: urlImg};
    const Images = images ? images.map((url: any) => ({uri: url})) : [];
    setDisplayImgs(Images);
    const imageIndex = Images.findIndex((img: any) => img.uri === tempUrl.uri);
    setSelectedIndex(imageIndex);
    setVisible(true);
  };
  const onChangeImageIndex = useCallback(
    (index: number) => {
      setTimeout(() => {
        setSelectedIndex(index);
      }, 300);
    },
    [selectedIndex],
  );
  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity onPress={() => onPressImg(item)} key={index}>
        <FastImage
          source={{uri: item, priority: FastImage.priority.high}}
          style={{
            width: (appInfo.size.WIDTH - 20) / columnCount, // Chia đều chiều rộng
            height: (appInfo.size.WIDTH - 20) / columnCount, // Vuông ảnh
            margin: 2, // Khoảng cách giữa ảnh
            borderRadius: 5,
            backgroundColor: 'grey',
          }}
          resizeMode={FastImage.resizeMode.cover} // Cắt ảnh để vừa khung
        />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title={t('yourimage')}
      />
      <FlatList
        data={images}
        style={{flex: 1, paddingHorizontal: 12}}
        numColumns={columnCount}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      {images && (
        <CustormImageViewing
          imageIndex={selectedIndex}
          images={displayImgs}
          isVisible={visible}
          onChangeImageIndex={onChangeImageIndex}
          onClose={() => setVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default YourImagesScreen;

const styles = StyleSheet.create({});
