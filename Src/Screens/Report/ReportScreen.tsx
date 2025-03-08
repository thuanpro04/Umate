import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {globalStyles} from '../../Styles/globalStyle';
import {HeaderComponent, SpaceComponent} from '../Components';
import {ArrowLeft2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {notificationServices} from '../Services/notificationServices';
import {Notification} from '../Untils/Notification';
import {useRoute} from '@react-navigation/native';
import LoadingModal from '../Modal/LoadingModal';
import {UserInfo} from '../Untils/UserInfo';
import {profileSelector} from '../../redux/reducers/profileSlice';

const ReportScreen = () => {
  const {name, userId} = useRoute().params as {name: string; userId: string};
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [isLoading, setIsLoading] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const profile = useSelector(profileSelector);

  const categories = [
    'Spam',
    'Lừa đảo',
    'Lời lẽ xúc phạm',
    'Nội dung không phù hợp',
    'Khác',
  ];

  const handleSubmitReport = () => {
    if (!selectedCategory || !reportReason.trim()) {
      Alert.alert('Vui lòng chọn lý do và nhập mô tả chi tiết.');
      return;
    }
    Alert.alert(`Báo cáo ${UserInfo.getName(name)}`, 'Bạn chắc chắn chứ ?', [
      {
        text: 'Không',
        style: 'cancel',
      },
      {
        text: 'Có',
        onPress: async () => await handleReportForUser(),
      },
    ]);
  };
  const handleReportForUser = async () => {
    setIsLoading(true);
    try {
      const data = {
        name: profile.name,
        email: profile.email,
        message: `${userId}: ${selectedCategory} -> ${reportReason} `,
      };
      const res = await notificationServices.handleSendEmail(data);
      if (res && res.data) {
        Notification.showToast(
          'success',
          '🎉 Cảm ơn bạn rất nhiều!',
          '✨Chúng tôi rất trân trọng ý kiến đóng góp của bạn và sẽ xem xét để cải thiện ứng dụng tốt hơn.',
        );
      }
      setReportReason('');
      setSelectedCategory('');
      setIsLoading(false);
      Keyboard.dismiss();
    } catch (error) {
      console.log('Report fail: ', error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title="Báo cáo"
      />

      <View style={styles.content}>
        <Text style={[styles.label, {color: colors.text}]}>
          Chọn lý do báo cáo:
        </Text>
        <View style={styles.categoryContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryItem,
                selectedCategory === category && {
                  backgroundColor: appColors.blue,
                },
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryText,
                  {color: colors.text},
                  selectedCategory === category && {color: appColors.white},
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, {color: colors.text}]}>
          Mô tả chi tiết:
        </Text>
        <TextInput
          style={[
            styles.input,
            {borderColor: colors.border, color: colors.text},
          ]}
          placeholder="Nhập mô tả..."
          placeholderTextColor={colors.text2}
          multiline
          value={reportReason}
          onChangeText={setReportReason}
        />
        <SpaceComponent height={50} />
        <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: appColors.blue}]}
          onPress={handleSubmitReport}>
          <Text style={[styles.submitText, {color: appColors.white}]}>
            Gửi báo cáo
          </Text>
        </TouchableOpacity>
      </View>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportScreen;
