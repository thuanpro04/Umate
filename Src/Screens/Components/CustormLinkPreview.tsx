import {Image, StyleSheet, Text, View} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import TextComponent from './TextComponent';
interface Props {
  txtLink?: string;
}
const CustormLinkPreview = memo((props: Props) => {
  const {txtLink} = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  const renderImage = useCallback(
    (image: any) => {
      if (!image?.url) return <View style={styles.imagePlaceholder} />; // Hiển thị placeholder nếu không có ảnh

      return (
        <Image
          source={{uri: image.url}}
          style={styles.image}
          onLoad={() => setImageLoaded(true)} // Khi ảnh tải xong, đánh dấu là đã load
          onError={() => setImageLoaded(false)} // Nếu lỗi, ẩn ảnh
        />
      );
    },
    [txtLink],
  );

  return (
    txtLink && (
      <LinkPreview
        text={txtLink}
        containerStyle={{flex: 1, minHeight: appInfo.size.HEIGHT * 0.02}}
        renderText={text => (
          <TextComponent
            label={text}
            color={appColors.blue3}
            numberOfLine={2}
          />
        )}
        renderImage={renderImage}
        metadataContainerStyle={styles.metadataContainer}
        renderTitle={txt => <TextComponent label={''} color="black" />}
        renderDescription={txt => (
          <TextComponent label={txt} color="black" numberOfLine={2} />
        )}
      />
    )
  );
});

const styles = StyleSheet.create({
  image: {
    width: appInfo.size.WIDTH * 0.51, // Chiều rộng hình ảnh
    height: appInfo.size.HEIGHT * 0.2, // Chiều cao hình ảnh
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: appInfo.size.WIDTH * 0.51, // Chiều rộng hình ảnh
    height: appInfo.size.HEIGHT * 0.23, // Chiều cao hình ảnh
    alignSelf: 'center',
    backgroundColor: '#ddd',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
  metadataContainer: {
    // Màu metadata nhạt hơn
    borderRadius: 8,
    flex: 1,
  },
});

export default CustormLinkPreview;
