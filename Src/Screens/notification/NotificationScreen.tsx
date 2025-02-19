import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {globalStyles} from '../../Styles/globalStyle';
import {HeaderComponent, TextComponent} from '../Components';
import {ArrowLeft2} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {Message} from 'iconsax-react-native';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {notificationServices} from '../Services/notificationServices';
import {useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoadingModal from '../Modal/LoadingModal';
import {appColors} from '../../Theme/Colors/appColors';
import friendsAPI from '../../apis/friendsApi';
import {friendServices} from '../Services/friendService.';
const notifications = [
  {
    _id: '67b4a80287f716b3dc31319a',
    senderId: '106468530278878536164',
    receiverId: '106064896936382491093',
    title: 'Thuận Phan',
    content:
      'Mọi cuộc vui đều thiếu sót nếu không có bạn! Vào nhóm ngay và cùng trải nghiệm nhé! 🔥',
    type: 'groupInvite',
  },
  {
    _id: '67b4a80287f716b3dc31319b',
    senderId: '106468530278878536165',
    receiverId: '106064896936382491093',
    title: 'Ngọc Trần',
    content: '📩 Bạn có một lời mời kết bạn mới. Kết nối ngay nào!',
    type: 'friendRequest',
  },
];

const NotificationScreen = () => {
  const [dataNotifi, setDataNotifi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const handleActionFriend = async (action: 'add' | 'cancel', id: string) => {
    try {
      const res =
        action === 'add'
          ? await friendServices.handleAgreeFriendShip(auth.userId, id)
          : await notificationServices.handleDeleteNotification(id);
      if (res) {
        fetchNotification();
      }
    } catch (error) {}
  };
  const RenderNotificationItem = ({item}: any) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };
    console.log(item);

    return (
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <TouchableOpacity style={styles.notificationCard} onPress={handlePress}>
          <View style={styles.iconContainer}>
            {item.type === 'groupInvite' ? (
              <MaterialCommunityIcons
                name="lightbulb-group-outline"
                size={appInfo.sizeIconBold}
                color="#FFFFFF"
              />
            ) : (
              <FontAwesome5
                name="user-friends"
                size={appInfo.sizeIconBold}
                color="#FFFFFF"
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <TextComponent label={item.title} styles={styles.title} />
            <TextComponent label={item.content} styles={styles.content} />
            {item.type !== 'groupInvite' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleActionFriend('add', item.senderId)}>
                  <TextComponent
                    label={'Chấp nhận'}
                    styles={styles.buttonText}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => handleActionFriend('cancel', item._id)}>
                  <TextComponent label={'Từ chối'} styles={styles.buttonText} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  const fetchNotification = async () => {
    setIsLoading(true);
    try {
      const res = await notificationServices.getNotifications(auth.userId);
      if (res && res.data) {
        setDataNotifi(res.data);
        console.log('DataNotifi ', res.data.length);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('fetch notification error: ', error);
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchNotification();
    }, []),
  );
  return (
    <SafeAreaView style={globalStyles.container}>
      <HeaderComponent
        iconLeft={<ArrowLeft2 size={appInfo.sizeIconBold} color="#007BFF" />}
        title="Thông báo"
      />
      {dataNotifi && dataNotifi.length > 0 ? (
        <FlatList
          data={dataNotifi}
          keyExtractor={item => item._id}
          renderItem={({item}) => <RenderNotificationItem item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <TextComponent label="Rỗng" title color={appColors.grey} />
        </View>
      )}
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD', // light blue
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF', // blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121', // textPrimary
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#757575', // textSecondary
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-start',
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // green
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  declineButton: {
    backgroundColor: '#F44336', // red
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
