import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE, UrlTile} from 'react-native-maps';
import { TextComponent } from '../Components';
const GoongMapScreen = () => {
  const GOONG_API_KEY = 'HngCPGYXHR5AK1Oo4nau7Y9qbmF4hgRXanqb0cau';
  
  return (
   <View style={styles.container}>
     <MapView
      style={styles.mapStyle}
      provider={PROVIDER_GOOGLE}
      region={{
        latitude: 37.78825, // Kinh độ của Đại học Thủ Dầu Một
        longitude: -122.4324, // Vĩ độ
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}>
        <TextComponent label='thuan' color='red' size={22}/>
      </MapView>
   </View>
  );
};

export default GoongMapScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});
