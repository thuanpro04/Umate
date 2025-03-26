import {getPreviewData} from '@flyerhq/react-native-link-preview';
import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appColors} from '../../../Theme/Colors/appColors';
import {ButtonComponent, RowComponent, TextComponent} from '../../Components';
interface Props {
  url: string;
  title: string;
}
const CardLinkComponent = (props: Props) => {
  const {url, title} = props;
  const [previewData, setPreviewData] = useState<any>(null);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];

  useEffect(() => {
    getPreviewData(url)
      .then(data => setPreviewData(data))
      .catch(console.error);
  }, [url]);

  return (
    previewData?.image?.url && (
      <View style={{marginBottom: 16}}>
        <RowComponent
          styles={[
            styles.container,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              minHeight: 160,
            },
          ]}>
          <FastImage
            source={{
              uri: previewData.image.url,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height: 120,
              width: 120,
              backgroundColor: 'grey',
              borderRadius: 8,
            }}
          />
          <View
            style={{flex: 1,marginTop:12}}>
            {title && <TextComponent label={`${title}`} />}
            <ButtonComponent
              type="action"
              styles={{flex: 1}}
              onPress={() => Linking.openURL(url)}>
              <TextComponent label={url} size={14} color={appColors.blue} />
            </ButtonComponent>
          </View>
        </RowComponent>
      </View>
    )
  );
};

export default CardLinkComponent;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    height: 140,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
});
