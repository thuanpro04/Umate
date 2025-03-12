import { ArrowLeft2 } from 'iconsax-react-native';
import {
  AlertTriangle,
  HelpCircle,
  LucideIcon,
  Mail,
  Phone,
  Search,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { themeSelector } from '../redux/reducers/themeSlice';
import { HeaderComponent, TextComponent } from '../Screens/Components';
import { globalStyles } from '../Styles/globalStyle';
import { appInfo } from '../Theme/appInfo';
import { appColors } from '../Theme/Colors/appColors';
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
  const {t} = useTranslation();

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
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        onPress1={() => navigation.goBack()}
      />
      <View style={{paddingHorizontal: 16}}>
        <TextComponent
          styles={styles.header}
          label={`📚 ${t('help_support')}`}
        />
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
            placeholder={t('search_help')}
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>
        <SupportOption
          icon={HelpCircle}
          title={t('faq')}
          description={t('popular_questions')}
          onPress={() => navigation.navigate('FAQ')}
        />
        <SupportOption
          icon={Mail}
          title={t('contact_support_email')}
          description={t('response_time')}
          onPress={() => navigation.navigate('ContactEmail')}
        />
        <SupportOption
          icon={Phone}
          title={t('call_us')}
          description={t('hotline_24_7')}
          onPress={() => navigation.navigate('ContactPhone')}
        />
        <SupportOption
          icon={AlertTriangle}
          title={t('report_issue')}
          description={t('send_issue_info')}
          onPress={() => navigation.navigate('ReportIssue')}
        />
      </View>
    </SafeAreaView>
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
