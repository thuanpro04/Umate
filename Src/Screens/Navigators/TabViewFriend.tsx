import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {appInfo} from '../../Theme/appInfo';
import {first} from 'lodash';
import SuggestFriend from '../Friends/SuggestFriend';
import FriendsRequestScreen from '../Friends/FriendsRequestScreen';
import {appColors} from '../../Theme/Colors/appColors';
import FriendsRespondScreen from '../Friends/FriendsRespondScreen';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {useTranslation} from 'react-i18next';

const TabViewFriend = () => {
  const [index, setIndex] = useState(0);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();
  const SuggestRouter = () => {
    return <SuggestFriend key={'SuggestFriend'} />;
  };
  const RequestRouter = () => {
    return <FriendsRequestScreen key={'FriendsRequestScreen'} />;
  };
  const RespondRouter = () => {
    return <FriendsRespondScreen key={'FriendsRespondScreen'} />;
  };
  const renderScene = SceneMap({
    first: RequestRouter,
    second: RespondRouter,
    third: SuggestRouter,
  });
  const routes = [
    {key: 'first', title: t('request')},
    {key: 'second', title: t('friend')},
    {key: 'third', title: t('suggest')},
  ];

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: appInfo.size.WIDTH}}
      renderTabBar={(props: any) => {
        const {key, ...restProps} = props;

        return (
          <TabBar
            {...restProps}
            key={key}
            style={{backgroundColor: colors.background}}
            labelStyle={{
              color: appColors.grey3, // Màu cam đậm
              fontWeight: '500',
              fontStyle: 'italic',
            }}
            indicatorStyle={{backgroundColor: appColors.blue2}}
          />
        );
      }}
    />
  );
};

export default TabViewFriend;

const styles = StyleSheet.create({});
