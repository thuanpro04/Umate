import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {messageServices} from '../Services/messageServices';
import {globalStyles} from '../../Styles/globalStyle';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent} from '../Components';
import {ArrowLeft2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import CustormLinkPreview from '../Components/CustormLinkPreview';
import CardLinkComponent from './Component/CardLinkComponent';
import {useTranslation} from 'react-i18next';

const YourLinkScreen = () => {
  const {id, type, theme} = useRoute().params as {
    id: string;
    type: string;
    theme: string;
  };
  const [links, setLinks] = useState<any[]>([]);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const getLinkYourConversation = async () => {
        if (!id || !type) {
          console.log('id or type not existing');

          return;
        }

        try {
          const res = await messageServices.getLinkYourConversation(id, type);
          if (res && res.data) {
            console.log('res.data: ', res.data);
            setLinks(res.data);
          }
        } catch (error) {
          console.log('get link error: ', error);
        }
      };
      getLinkYourConversation();
    }, [id]),
  );
  const renderItems = ({item, index}: any) => {
    return <CardLinkComponent url={item.content} key={index} />;
  };
  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title={t('yourlink')}
      />
      <FlatList
        style={{flex: 1, paddingHorizontal: 12}}
        data={links}
        keyExtractor={item => item.messageId}
        renderItem={renderItems}
      />
    </SafeAreaView>
  );
};

export default YourLinkScreen;

const styles = StyleSheet.create({});
