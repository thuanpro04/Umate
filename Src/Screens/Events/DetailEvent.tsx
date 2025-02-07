import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';

const DetailEvent = () => {
  const {href} = useRoute().params as {href: string};
  console.log(href);

  return (
    <View style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
      <WebView
        source={{
          uri: href,
        }}
        style={{flex: 1}}
      />
    </View>
  );
};

export default DetailEvent;

const styles = StyleSheet.create({});
