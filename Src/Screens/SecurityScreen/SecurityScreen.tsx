import { ArrowLeft2 } from 'iconsax-react-native';
import { LogOut, Smartphone, Trash2 } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { themeSelector } from '../../redux/reducers/themeSlice';
import { globalStyles } from '../../Styles/globalStyle';
import { appInfo } from '../../Theme/appInfo';
import { appColors } from '../../Theme/Colors/appColors';
import { HeaderComponent, SpaceComponent, TextComponent } from '../Components';

const SecurityScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const SecurityOption = ({icon: Icon, title, description, onPress}: any) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <View style={{marginRight: 16}}>
          <Icon size={28} color="#4F46E5" />
        </View>
        <View style={{flex: 1}}>
          <TextComponent
            label={title}
            styles={{fontSize: 16, fontWeight: '600', marginBottom: 4}}
          />

          <TextComponent
            label={description}
            styles={{fontSize: 14, color: '#6B7280'}}
          />
        </View>
      </TouchableOpacity>
    );
  };
  
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
        <TextComponent label={t('security_settings')} title />
        <SpaceComponent height={12} />
        <SecurityOption
          icon={Smartphone}
          title={t('devices_sessions')}
          description={t('devices_sessions_description')}
          onPress={() => navigation.navigate('LoginSessions')}
        />

        <SecurityOption
          icon={LogOut}
          title={t('logout_all_devices')}
          description={t('logout_all_devices_description')}
          onPress={() =>
            Alert.alert(t('comfirm'), t('logout_all_devices_question'), [
              {text: t('cancel'), style: 'cancel'},
              {text: t('agree'), onPress: () => {}},
            ])
          }
        />

        <SecurityOption
          icon={Trash2}
          title={t('delete_account')}
          description={t('delete_account_description')}
          onPress={() =>
            Alert.alert(t('comfirm'), t('confirm_delete_account'), [
              {text: t('cancel'), style: 'cancel'},
              {text: t('agree'), style: 'destructive', onPress: () => {}},
            ])
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SecurityScreen;
