import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapLibreGL from '@maplibre/maplibre-react-native';
const GoongMapScreen = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const buildings = [
    { id: 'a', name: 'Tòa Nhà A', description: 'Khu học lý thuyết chính.', coord: [106.6528, 10.9801] },
    { id: 'b', name: 'Tòa Nhà B', description: 'Phòng thí nghiệm và xưởng thực hành.', coord: [106.6525, 10.9798] },
    { id: 'c', name: 'Tòa Nhà C', description: 'Trung tâm CNTT và Thư viện điện tử.', coord: [106.6530, 10.9796] },
    { id: 'hall', name: 'Hội Trường Lớn', description: 'Nơi tổ chức sự kiện và lễ hội.', coord: [106.6523, 10.9803] },
    { id: 'library', name: 'Thư Viện', description: 'Thư viện với hàng ngàn đầu sách và không gian học tập.', coord: [106.6526, 10.9804] },
  ];


  return (
    <View style={styles.page}>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
        <MapLibreGL.Camera
          zoomLevel={18}
          centerCoordinate={[106.652655, 10.980055]}
        />

        {buildings.map((building) => (
          <MapLibreGL.PointAnnotation
            key={building.id}
            id={building.id}
            coordinate={building.coord}
            onSelected={() => setSelectedBuilding(building)}
          >
            <View style={styles.marker} />
            <MapLibreGL.Callout title={building.name} />
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      {selectedBuilding && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => setSelectedBuilding(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedBuilding.name}</Text>
              <Text style={styles.modalDescription}>{selectedBuilding.description}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedBuilding(null)}
              >
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};





const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6347',
    borderColor: 'white',
    borderWidth: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default GoongMapScreen
