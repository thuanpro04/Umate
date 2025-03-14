import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {appColors} from '../../Theme/Colors/appColors';
import {RowComponent, TextComponent} from '../Components';
import {X} from 'lucide-react-native'; // Biểu tượng đóng
import {useTranslation} from 'react-i18next';
import {encode as btoa} from 'base-64';
interface Props {
  visible: boolean;
  onClose: () => void; // Hàm đóng modal
  onPress: (time: string, data: any) => void;
  groupId: string;
  type: string;
}

const QrCodeModal = ({visible, onClose, onPress, groupId, type}: Props) => {
  const data = [15, 30, 45, 60, 120, 180];
  const qrData = JSON.stringify({
    id: groupId,
    type,
  });
  const encodedData = btoa(qrData);
  const {t} = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Nút đóng modal */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={appColors.black} />
          </TouchableOpacity>

          <TextComponent label={t('qr_checkin_title')} styles={styles.title} />
          <Text style={styles.subtitle}>{t('qr_scan_to_join')}</Text>

          {/* QR Code */}
          <View style={styles.qrWrapper}>
            <QRCode value={encodedData} size={200} />
          </View>

          <Text style={styles.expiryText}>{t('qr_expiration')}</Text>
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.timeBox}
                onPress={() => onPress(item.toString(), encodedData)}>
                <TextComponent label={`${item} ${t('minutes')}`} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default QrCodeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 8, // Hiệu ứng bóng đổ
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: appColors.grey,
    marginBottom: 15,
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
  },
  expiryText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: appColors.black,
  },
  timeBox: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    marginTop: 10,
  },
});
