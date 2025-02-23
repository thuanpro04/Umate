import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {UrlTile} from 'react-native-maps';

const GoongMapView = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.7769,
          longitude: 106.7009,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <UrlTile
          urlTemplate="https://rsapi.goong.io/Geocode?latlng=21.013715429594125,%20105.79829597455202&api_key=PYn4enDdHKFzvFbIHOiPiusKLPZylaRoj2FQU1CH"
          maximumZ={18}
          flipY={false}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GoongMapView;
