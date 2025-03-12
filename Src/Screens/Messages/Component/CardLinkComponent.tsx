import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {profileSelector} from '../../../redux/reducers/profileSlice';
import {ButtonComponent, RowComponent, TextComponent} from '../../Components';
import FastImage from 'react-native-fast-image';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {appColors} from '../../../Theme/Colors/appColors';
import {LinkPreview, getPreviewData} from '@flyerhq/react-native-link-preview';
import { useTranslation } from 'react-i18next';
interface Props {
  url: string;
  key: string;
}
const CardLinkComponent = (props: Props) => {
  const {url, key} = props;
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const profile = useSelector(profileSelector);
  const {t} = useTranslation();

  useEffect(() => {
    getPreviewData(url)
      .then(data => setPreviewData(data))
      .catch(console.error);
  }, [url]);

  return (
    previewData &&
    previewData.image &&
    previewData.image.url && (
      <View key={key}>
        <RowComponent
          styles={[
            styles.container,
            {borderColor: colors.border, backgroundColor: colors.card},
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
          <ButtonComponent
            type="action"
            styles={{flex: 1}}
            onPress={() => Linking.openURL(url)}>
            <TextComponent label={url} size={14} color={appColors.blue} />
          </ButtonComponent>
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
