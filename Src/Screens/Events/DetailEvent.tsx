import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import LoadingModal from '../Modal/LoadingModal';

const DetailEvent = () => {
  const {href} = useRoute().params as {href: string};
console.log(href);

  return href ? (
    <View style={styles.container}>
      <WebView
        source={{
          uri: href,
        }}
        style={{flex: 1}}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <LoadingModal visible={true} />
    </View>
  );
};

export default DetailEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
