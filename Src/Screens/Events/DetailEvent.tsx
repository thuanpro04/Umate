import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';

const DetailEvent = () => {
  return (
    <View style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
      <WebView
        source={{
          uri: 'https://tdmu.edu.vn/tin-tuc/tin-tong-hop/lich-nghi-tet-nguyen-dan-at-ty-nam-2025',
        }}
        style={{flex: 1}}
      />
    </View>
  );
};

export default DetailEvent;

const styles = StyleSheet.create({});
