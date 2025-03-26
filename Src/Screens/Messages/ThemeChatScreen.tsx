import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme, themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {useRoute} from '@react-navigation/native';
import {globalStyles} from '../../Styles/globalStyle';
import {HeaderComponent} from '../Components';
import {ArrowLeft, ArrowLeft2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {useTranslation} from 'react-i18next';
import {messageServices} from '../Services/messageServices';
import LoadingModal from '../Modal/LoadingModal';

const themes = [
  {id: 'light', name: 'Light'}, // Giao diện tối mặc định
  {id: 'dark', name: 'Dark Theme'}, // Giao diện tối mặc định
  {id: 'mintFresh', name: 'Mint Fresh'}, // Xanh dương dịu nhẹ
  {id: 'oceanBreeze', name: 'Ocean Breeze'}, // Siêu tối
  {id: 'lavenderDreams', name: 'Lavender Dreams'}, // Xanh đậm kiểu đêm
  {id: 'warmAmber', name: 'Warm Amber'}, // Neon rực rỡ
  {id: 'softCoral', name: 'Soft Coral'}, // Đen tuyệt đối
  {id: 'modernSlate', name: 'Modern Slate'}, // Tông xanh lá - nâu
  {id: 'tealWave', name: 'Teal Wave'}, // Đỏ cam hoàng hôn
  {id: 'peachSorbet', name: 'Peach Sorbet'}, // Màu xanh rừng
  {id: 'softSky', name: 'Soft Sky'}, // Màu xanh rừng
  {id: 'moonlight', name: 'Moon Light'}, // Màu xanh rừng
];
const ThemeChatScreen = ({navigation}: any) => {
  const {converInfo} = useRoute().params as {converInfo: any};
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();
  const numColumn = 2;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors: any = appColors[theme ?? 'light'];
  const handleApplyTheme = async (item: string) => {
    setIsLoading(true);
    const res = await messageServices.updateThemeConversation(
      converInfo.conversationId,
      item,
      converInfo.type,
    );
    if (res && res.data) {
      console.log('Update theme conversation successfully !!', res.data);
      navigation.navigate(t('message'));
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        {backgroundColor: colors.background, paddingHorizontal: 12},
      ]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        title={t('choose_theme')}
        onPress1={() => navigation.goBack()}
      />
      <FlatList
        data={themes}
        numColumns={numColumn}
        style={{flex: 1, paddingHorizontal: 12}}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: appColors[item.id].background,
              borderRadius: 2,
              width: (appInfo.size.WIDTH - 68) / numColumn,
              height: (appInfo.size.WIDTH - 68) / numColumn,
              margin: 8,
              borderWidth: 0.21,
              borderColor: converInfo.theme === item.id ? 'yellow' : 'black',
            }}
            onPress={() => handleApplyTheme(item.id)}>
            <Text
              style={{
                color: item.id === 'light' ? 'black' : '#fff',
                fontSize: 16,
              }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default ThemeChatScreen;
