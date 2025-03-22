import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import {ArrowLeft2} from 'iconsax-react-native';
import {useTranslation} from 'react-i18next';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent, TextComponent} from '../Components';
import {messageServices} from '../Services/messageServices';
import CustormImageViewing from './Component/CustormImageViewing';
import { useSelector } from 'react-redux';
import { themeSelector } from '../../redux/reducers/themeSlice';
import LoadingModal from '../Modal/LoadingModal';

const YourImagesScreen = () => {
  const {id, type, theme} = useRoute().params as {
    id: string;
    type: string;
    theme: string;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [displayImgs, setDisplayImgs] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const colors = appColors[theme ];
  const {t} = useTranslation();

  const columnCount = 4;

  useFocusEffect(
    useCallback(() => {
      const getImageForConversation = async () => {
        if (!id) {
          return;
        }
        setIsLoading(true);
        const res = await messageServices.getImages(id, type);
        if (res && res.data) {
          setImages(res.data);
          console.log('get image successfully ', res.data);
        }
        setIsLoading(false);
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
            width: (appInfo.size.WIDTH - 38) / columnCount, // Chia đều chiều rộng
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
        titleColor={colors.text}
      />
      {images && images.length > 0 ? (
        <FlatList
          data={images}
          style={{flex: 1, paddingHorizontal: 12}}
          numColumns={columnCount}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextComponent label={t('empty')} color={colors.text}/>
        </View>
      )}
      {images && (
        <CustormImageViewing
          imageIndex={selectedIndex}
          images={displayImgs}
          isVisible={visible}
          onChangeImageIndex={onChangeImageIndex}
          onClose={() => setVisible(false)}
        />
      )}
      <LoadingModal visible={isLoading}/>
    </SafeAreaView>
  );
};

export default YourImagesScreen;

const styles = StyleSheet.create({});
