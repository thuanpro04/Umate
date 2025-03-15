import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';

const GoongMapView = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const onLongPress = ({nativeEvent}: any) => {
    if (nativeEvent.state === State.ACTIVE) {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <LongPressGestureHandler
        onHandlerStateChange={onLongPress}
        minDurationMs={1000} // Thời gian nhấn giữ (1 giây)
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Nhấn giữ thẻ này để hiển thị modal
          </Text>
        </View>
      </LongPressGestureHandler>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Đây là modal!</Text>
            <Text
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              Đóng
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default GoongMapView;
