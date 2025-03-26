import {useFocusEffect, useRoute} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent, TextComponent} from '../Components';
import {messageServices} from '../Services/messageServices';
import CardLinkComponent from './Component/CardLinkComponent';
import LoadingModal from '../Modal/LoadingModal';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';

const YourLinkScreen = () => {
  const {id, type, theme} = useRoute().params as {
    id: string;
    type: string;
    theme: string;
  };

  const [links, setLinks] = useState<any[]>([]);
  const colors = appColors[theme];
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const getLinkYourConversation = async () => {
        if (!id || !type) {
          console.log('id or type not existing');

          return;
        }
        setIsLoading(true);
        const res = await messageServices.getLinkYourConversation(id, type);
        if (res && res.data) {
          // console.log('res.data: ', res.data);
          setLinks(res.data);
        }
        setIsLoading(false);
      };
      getLinkYourConversation();
    }, [id]),
  );
  const renderItems = useCallback(
    ({item, index}: any) => {
      return (
        <CardLinkComponent url={item.url} key={item._id} title={item.title} />
      );
    },
    [links],
  );

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title={t('yourlink')}
        titleColor={colors.text}
      />
      {links?.length > 0 ? (
        <FlatList
          style={{flex: 1, paddingHorizontal: 12}}
          data={links}
          keyExtractor={item => item._id}
          renderItem={renderItems}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <TextComponent label={t('empty')} color={colors.text} />
        </View>
      )}
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default YourLinkScreen;

const styles = StyleSheet.create({});
