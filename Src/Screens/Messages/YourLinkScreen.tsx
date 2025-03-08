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

const YourLinkScreen = () => {
  const {conversationId} = useRoute().params as {conversationId: string};
  const [links, setLinks] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  useFocusEffect(
    useCallback(() => {
      const getLinkYourConversation = async () => {
        if (!conversationId) {
          return;
        }
        try {
          const res = await messageServices.getLinkYourConversation(
            conversationId,
          );
          if (res && res.data) {
            console.log('res.data: ', res.data);
            setLinks(res.data);
          }
        } catch (error) {
          console.log('get link error: ', error);
        }
      };
      getLinkYourConversation();
    }, [conversationId]),
  );
  const renderItems = ({item, index}: any) => {
    return <CardLinkComponent url={item.content} />;
  };
  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title="Your link"
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
