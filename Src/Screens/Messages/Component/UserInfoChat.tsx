import {useFocusEffect, useRoute} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Categorys, ChoiceItems} from '../../../data/MenuItems';
import {globalStyles} from '../../../Styles/globalStyle';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {
  CarfeatureComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UpdateInfoModal from '../../Modal/UpdateInfoModal';
import {UserInfo} from '../../Untils/UserInfo';
import ZoomImageComponent from './ZoomImageComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {notificationServices} from '../../Services/notificationServices';
import {useSelector} from 'react-redux';
import {authReducer, authSelector} from '../../../redux/reducers/authReducer';
const UserInfoChat = ({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [showItems, setShowItems] = useState<any[]>([]);
  const [converInfo, setConverInfo] = useState<any>('');
  const {getItem} = useAsyncStorage('ConversationInfo');
  const auth = useSelector(authSelector);
  const [statusNotification, setStatusNotification] = useState(false);
  console.log(statusNotification);

  const onChangeShowItems = (key: any) => {
    setShowItems(prev => ({...prev, [key]: !showItems[key]}));
  };
  const getConversationInfo = useCallback(async () => {
    setConverInfo(await UserInfo.getConversationInfo(getItem));
    setStatusNotification(
      converInfo && converInfo.notification.includes(auth.userId),
    );
    // console.log("converInfo",converInfo);
  }, []);
  const handleActionNotification = async () => {
    try {
      const res = await notificationServices.actionNotificationUser(
        auth.userId,
        converInfo.type === 'personal'
          ? converInfo.conversationId
          : converInfo.groupId,
        converInfo.type,
      );
    } catch (error) {
      console.log('Action notification fail error: ', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getConversationInfo();
    }, []),
  );

  const onPressItems = (key: number) => {
    console.log(key);

    switch (key) {
      case 1:
        console.log('Thay đổi chủ đề !!');
        break;
      case 2:
        setVisible(true);
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      default:
        break;
    }
  };
  const renderObjectCategory = (item: any[]) => {
    return (
      <View style={styles.showItemStyle}>
        {item.map((element, index) => (
          <CarfeatureComponent
            key={index}
            label={element.label}
            icon={element.icon}
            onPress={() => onPressItems(element.id)}
          />
        ))}
      </View>
    );
  };

  const renderCategory = () => {
    return Categorys.map((item, index) => (
      <View key={index}>
        <CarfeatureComponent
          label={item.title}
          icon={item.icon}
          styles={{
            backgroundColor: showItems[item.key]
              ? appColors.lightGrey
              : 'transparent',
            borderRadius: 12,
          }}
          onPress={() => onChangeShowItems(item.key)}
          isArrow
        />
        {showItems[item.key] && renderObjectCategory(item.Object)}
      </View>
    ));
  };
  const handleChoiceItems = (key: string) => {
    switch (key) {
      case 'call':
        console.log('Thay đổi chủ đề !!');
        break;
      case 'video':
        setVisible(true);
        break;
      case 'personal':
        navigation.navigate('PersonalScreen', {
          userId: converInfo.type === 'personal' ? converInfo.userId : '',
        });
        break;
      case 'notification':
        setStatusNotification(!statusNotification);
        handleActionNotification();
        break;
      case 'member':
        navigation.navigate('MemberGroup', {
          invitedUsers: converInfo.invitedUsers,
          leader: converInfo.leader,
          deputyLeader: converInfo.deputyLeader,
        });
        break;
    }
  };
  console.log(converInfo);

  return (
    <SafeAreaView style={globalStyles.main}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft size={appInfo.sizeIconBold} color={appColors.black} />
        }
        onPress1={() => navigation.goBack()}
        iconRight={
          <MaterialIcons
            name="unfold-more-double"
            color={appColors.black}
            size={appInfo.sizeIconBold}
          />
        }
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {converInfo ? (
            <Image
              source={{
                uri:
                  converInfo.type === 'personal'
                    ? converInfo.avatar
                    : converInfo.avatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/1999/1999625.png',
              }}
              style={globalStyles.avatar}
            />
          )}
          <TextComponent
            label={
              converInfo.type === 'personal'
                ? UserInfo.getName(converInfo.userName)
                : converInfo.groupName
            }
            title
            size={28}
          />
          <SpaceComponent height={20} />
          <RowComponent styles={{gap: 20}}>
            {ChoiceItems.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  handleChoiceItems(
                    converInfo.type === 'group' && item.key === 'personal'
                      ? 'member'
                      : item.key,
                  )
                }
                style={styles.menu}
                key={index}
                activeOpacity={0.4}>
                {item.key === 'notification' ? (
                  statusNotification ? (
                    <Ionicons
                      name="notifications-outline"
                      size={appInfo.sizeIconBold}
                      color={appColors.cobalt}
                    />
                  ) : (
                    <Ionicons
                      name="notifications-off-outline"
                      size={appInfo.sizeIconBold}
                      color={appColors.cobalt}
                    />
                  )
                ) : converInfo.type === 'group' && item.key === 'personal' ? (
                  <MaterialCommunityIcons
                    name="account-group"
                    size={appInfo.sizeIconBold}
                    color={appColors.cobalt}
                  />
                ) : (
                  item.icon
                )}

                <TextComponent
                  label={
                    converInfo.type === 'group' && item.key === 'personal'
                      ? 'Thành viên'
                      : item?.name
                  }
                  size={12}
                  styles={{fontStyle: 'italic'}}
                />
              </TouchableOpacity>
            ))}
          </RowComponent>
        </View>
        <SpaceComponent height={100} />
        <View style={{flex: 1}}>
          <TextComponent label="Chức năng" title />
          <SpaceComponent height={12} />
          {renderCategory()}
        </View>
      </ScrollView>

      <UpdateInfoModal
        isVisible={visible}
        nameField="UserName"
        onCloseModal={() => setVisible(false)}
        onChangeProfile={(key, value) => {}}
      />
    </SafeAreaView>
  );
};

export default UserInfoChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomRightRadius: 12,
    borderColor: appColors.blue2,
  },
  showItemStyle: {
    paddingHorizontal: 18,
  },
  avatar: {
    height: 85,
    width: 85,
    borderRadius: 8,
  },
});
