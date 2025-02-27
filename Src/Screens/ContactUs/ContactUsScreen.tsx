import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft2} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {notificationServices} from '../Services/notificationServices';
import {Notification} from '../Untils/Notification';
import {profileSelector} from '../../redux/reducers/profileSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
const ContactUsScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const profile = useSelector(profileSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme];
  const handleSend = async () => {
    if (message.length > 10) {
      setIsLoading(true);
      const data = {
        name: profile.name,
        email: profile.email,
        message,
      };
      try {
        const res = await notificationServices.handleSendEmail(data);
        setIsLoading(false);
        Notification.showToast(
          'success',
          '🎉 Cảm ơn bạn rất nhiều!',
          '✨Chúng tôi rất trân trọng ý kiến đóng góp của bạn và sẽ xem xét để cải thiện ứng dụng tốt hơn.',
        );
        navigation.goBack();
      } catch (error) {
        console.log('handle email fail error: ', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      return;
    }
  };
  const placeHolderEmail = profile.email.substring(0, 30) + '...';
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#6A11CB', '#2575FC']} style={styles.header}>
        <ArrowLeft2
          onPress={() => navigation.goBack()}
          color={appColors.orange1}
          size={appInfo.sizeIconBold}
          style={{position: 'absolute', left: '1%', bottom: '65%'}}
        />
        <SpaceComponent height={20} />
        <Text style={styles.headerTitle}>📬 Liên hệ với chúng tôi</Text>
        <Text style={styles.headerSubtitle}>
          💡 Chúng tôi rất mong nhận được phản hồi từ bạn!
        </Text>
      </LinearGradient>

      <View style={[styles.formContainer, {backgroundColor: colors.card}]}>
        <View style={styles.inputContainer}>
          <TextComponent label="👤 Họ tên" styles={styles.label} />
          <TextInput
            style={[
              styles.input,
              {backgroundColor: colors.background, color: colors.text},
            ]}
            placeholder={profile.name ?? 'Nhập tên của bạn'}
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextComponent label='📧 Email' styles={styles.label} />
          <TextInput
            style={[
              styles.input,
              {backgroundColor: colors.background, color: colors.text},
            ]}
            multiline
            placeholder={placeHolderEmail ?? 'Nhập email'}
            placeholderTextColor="#B0B0B0"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextComponent label="💬 Nội dung" styles={styles.label} />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {backgroundColor: colors.background, color: colors.text},
            ]}
            placeholder="Nhập tin nhắn của bạn"
            placeholderTextColor="#B0B0B0"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
          />
          <TouchableOpacity
            onPress={() => setMessage('')}
            style={{position: 'absolute', right: '3%', top: '50%'}}>
            {message && message.length > 0 && (
              <AntDesign
                name="close"
                size={appInfo.sizeIcon - 5}
                color={appColors.black}
              />
            )}
          </TouchableOpacity>
          <SpaceComponent height={10} />
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.buttonWrapper}>
          <LinearGradient colors={['#36D1DC', '#5B86E5']} style={styles.button}>
            <Text style={styles.buttonText}>🚀 Gửi tin nhắn</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    marginTop: -40,

    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,

    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    paddingVertical: 16,
    fontSize: 16,
    paddingLeft: 18,
    paddingRight: 22,
  },
  textArea: {
    height: 180,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactUsScreen;
