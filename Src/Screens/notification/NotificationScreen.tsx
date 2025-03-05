import {useFocusEffect} from '@react-navigation/native';
import {ArrowLeft2, CallCalling, CallIncoming} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import LoadingModal from '../Modal/LoadingModal';
import {groupServices} from '../Services/groupServices';
import {notificationServices} from '../Services/notificationServices';
import {UserInfo} from '../Untils/UserInfo';

const NotificationScreen = ({navigation}: any) => {
  const [dataNotifi, setDataNotifi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const handleActionFriend = async (
    action: 'agree' | 'cancel',
    id: string,
    groupId?: string,
  ) => {
    try {
      const res =
        action === 'agree'
          ? await groupServices.handleAgreeOnGroup(auth.userId, id, groupId)
          : await notificationServices.handleDeleteNotification(id);
      if (res) {
        fetchNotification();
      }
    } catch (error) {
      console.log('action friend error: ', error);
    }
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
      item.type === 'calling'
        ? navigation.navigate('MessageNavigator')
        : navigation.navigate('Friends');
    };
    return (
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <TouchableOpacity
          style={[styles.notificationCard, {backgroundColor: colors.card}]}
          onPress={handlePress}>
          <View style={styles.iconContainer}>
            {item.type === 'groupInvite' ? (
              <MaterialCommunityIcons
                name="lightbulb-group-outline"
                size={appInfo.sizeIconBold}
                color="#FFFFFF"
              />
            ) : item.type === 'calling' ? (
              <CallCalling size={appInfo.sizeIconBold} color="#FFFFFF" />
            ) : (
              <FontAwesome5
                name="user-friends"
                size={appInfo.sizeIconBold}
                color="#FFFFFF"
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <RowComponent>
              <TextComponent label={item.title} styles={styles.title} />

              <TextComponent
                label={UserInfo.getDay(item.timestamp)}
                styles={[
                  globalStyles.actionText,
                  {alignItems: 'flex-end', justifyContent: 'flex-end'},
                ]}
              />
            </RowComponent>
            <TextComponent label={item.content} styles={styles.content} />
            {item.type === 'groupInvite' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() =>
                    handleActionFriend('agree', item._id, item.groupId)
                  }>
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
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
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
          <TextComponent label="Rỗng" title />
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
