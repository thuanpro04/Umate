import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import {
  Mail,
  Phone,
  AlertTriangle,
  LucideIcon,
  Search,
  HelpCircle,
} from 'lucide-react-native';
import {globalStyles} from '../Styles/globalStyle';
import {useSelector} from 'react-redux';
import {themeSelector} from '../redux/reducers/themeSlice';
import {appColors} from '../Theme/Colors/appColors';
import {TextComponent} from '../Screens/Components';
interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
}
const isDark = true;
const SupportScreen = ({navigation}: any) => {
  const [searchText, setSearchText] = useState('');
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme];
  const SupportOption: React.FC<Props> = ({
    icon: Icon,
    title,
    description,
    onPress,
  }) => (
    <TouchableOpacity
      style={[styles.optionCard, {backgroundColor: colors.card}]}
      onPress={onPress}>
      <Icon color="#1E90FF" size={28} />
      <View style={{marginLeft: 12}}>
        <TextComponent label={title} styles={styles.optionTitle} />
        <TextComponent label={description} styles={styles.optionDesc} />
      </View>
    </TouchableOpacity>
  );
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <TextComponent styles={styles.header} label="📚 Trợ giúp & Hỗ trợ" />

      {/* 🔍 Thanh tìm kiếm */}
      <View style={[styles.searchBox, {backgroundColor: colors.background}]}>
        <Search color={colors.icon} size={22} />
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.text,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 12,
            },
          ]}
          placeholder="Tìm kiếm câu hỏi hoặc hỗ trợ..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* 📝 Các lựa chọn hỗ trợ */}
      <SupportOption
        icon={HelpCircle}
        title="Câu hỏi thường gặp (FAQ)"
        description="Giải đáp những thắc mắc phổ biến nhất"
        onPress={() => navigation.navigate('FAQ')}
      />
      <SupportOption
        icon={Mail}
        title="Liên hệ hỗ trợ qua email"
        description="Chúng tôi sẽ phản hồi trong vòng 24h"
        onPress={() => navigation.navigate('ContactEmail')}
      />
      <SupportOption
        icon={Phone}
        title="Gọi cho chúng tôi"
        description="Tổng đài 24/7: 1800-123-456"
        onPress={() => navigation.navigate('ContactPhone')}
      />
      <SupportOption
        icon={AlertTriangle}
        title="Báo cáo sự cố"
        description="Gửi thông tin sự cố bạn gặp phải"
        onPress={() => navigation.navigate('ReportIssue')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 16,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionDesc: {
    fontSize: 14,
    color: isDark ? '#AAAAAA' : '#666666',
    marginTop: 4,
  },
});
export default SupportScreen;
