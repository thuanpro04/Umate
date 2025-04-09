import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
interface Props {
  images: string[];
}
const RenderPostImages = (props: Props) => {
  const {images} = props;
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <FastImage
        source={{uri: images[0]}}
        style={styles.singleImage}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  }

  return (
    <View style={styles.multipleImagesContainer}>
      {images.length <= 3 ? (
        // For 2-3 images
        images.map((image: string, index: number) => (
          <FastImage
            key={index}
            source={{uri: image}}
            style={[
              styles.multipleImage,
              {width: `${100 / images.length - 1}%`},
            ]}
            resizeMode={FastImage.resizeMode.cover}
          />
        ))
      ) : (
        // For 4+ images, show first 3 and +X more
        <>
          <FastImage
            source={{uri: images[0]}}
            style={[styles.multipleImage, {width: '66%'}]}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{width: '32%'}}>
            <FastImage
              source={{uri: images[1]}}
              style={[styles.smallImage]}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.moreImagesContainer}>
              <FastImage
                source={{uri: images[2]}}
                style={[styles.smallImage, {opacity: 0.7}]}
                resizeMode={FastImage.resizeMode.cover}
              />
              {images.length > 3 && (
                <View style={styles.moreImagesOverlay}>
                  <Text style={styles.moreImagesText}>
                    +{images.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default RenderPostImages;

const styles = StyleSheet.create({
  singleImage: {
    width: '90%',
    height: 300,
    borderRadius: 6,
  },
  multipleImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  multipleImage: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5,
  },
  smallImage: {
    height: 98,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ffffff',
  },
  moreImagesContainer: {
    position: 'relative',
    marginTop: 4,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
