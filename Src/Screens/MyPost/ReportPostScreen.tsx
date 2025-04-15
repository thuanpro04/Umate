import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportPostScreen = ({ navigation, route }:any) => {
  const { postId, postAuthor } = route.params;
  const [selectedReason, setSelectedReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const reportReasons = [
    { id: 'spam', label: 'Spam hoặc lừa đảo' },
    { id: 'nudity', label: 'Ảnh khỏa thân hoặc hoạt động tình dục' },
    { id: 'violence', label: 'Bạo lực hoặc tổ chức nguy hiểm' },
    { id: 'hate', label: 'Phát ngôn thù địch hoặc kích động bạo lực' },
    { id: 'suicide', label: 'Tự tử hoặc tự gây thương tích' },
    { id: 'false', label: 'Thông tin sai sự thật' },
    { id: 'intellectual', label: 'Vi phạm quyền sở hữu trí tuệ' },
    { id: 'harassment', label: 'Quấy rối hoặc bắt nạt' },
    { id: 'other', label: 'Vấn đề khác' },
  ];

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      Alert.alert('Vui lòng chọn lý do báo cáo');
      return;
    }

    setIsSubmitting(true);
    
    // Mô phỏng gửi báo cáo
    try {
      // Đây là nơi bạn sẽ gửi API request
      // await reportPostAPI(postId, selectedReason, additionalInfo);
      
      // Mô phỏng độ trễ mạng
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitting(false);
      setShowConfirmation(true);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.');
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Báo cáo bài viết</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* Info Section */}
          <View style={styles.infoSection}>
            <AlertTriangle size={24} color="#FF6B6B" />
            <Text style={styles.infoText}>
              Báo cáo của bạn là ẩn danh, trừ khi bạn báo cáo vi phạm quyền sở hữu trí tuệ.
            </Text>
          </View>

          {/* Reasons Section */}
          <Text style={styles.sectionTitle}>Tại sao bạn báo cáo bài viết này?</Text>
          <View style={styles.reasonsContainer}>
            {reportReasons.map((reason:any) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonItem,
                  selectedReason === reason.id && styles.selectedReason
                ]}
                onPress={() => setSelectedReason(reason.id)}
              >
                <Text 
                  style={[
                    styles.reasonText,
                    selectedReason === reason.id && styles.selectedReasonText
                  ]}
                >
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Info Section */}
          <Text style={styles.sectionTitle}>Thông tin thêm (tùy chọn)</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={5}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            textAlignVertical="top"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !selectedReason && styles.disabledButton]}
            onPress={handleSubmitReport}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmation}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AlertTriangle size={40} color="#4CAF50" />
              <Text style={styles.modalTitle}>Báo cáo đã được gửi</Text>
              <Text style={styles.modalText}>
                Cảm ơn bạn đã giúp chúng tôi giữ cho cộng đồng an toàn. 
                Chúng tôi sẽ xem xét báo cáo và thực hiện hành động phù hợp.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseConfirmation}
              >
                <Text style={styles.modalButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#FFF3F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  reasonsContainer: {
    marginBottom: 24,
  },
  reasonItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selectedReason: {
    borderColor: '#6200EA',
    backgroundColor: '#F4EEFF',
  },
  reasonText: {
    fontSize: 15,
    color: '#333333',
  },
  selectedReasonText: {
    color: '#6200EA',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 32,
    height: 120,
  },
  submitButton: {
    backgroundColor: '#6200EA',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#B39DDB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#333333',
  },
  modalText: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#6200EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ReportPostScreen;