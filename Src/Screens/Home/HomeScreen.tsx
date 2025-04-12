import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {HambergerMenu, Notification} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {CarEventComponent, HeaderComponent} from '../Components';
import SocketService from '../Services/SocketService';
import {eventSevices} from '../Services/eventService';
import {notificationServices} from '../Services/notificationServices';
import {indexOf} from 'lodash';
const HomeScreen = () => {
  const [event, setEvent] = useState<any[]>([]);
  const [statusNoti, setStatusNoti] = useState(false);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const flatListRef = React.useRef<FlatList<any>>(null);
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const getNewEvent = async () => {
    const res = await eventSevices.getNewEvent(page, false);
    if (res && res.data) {
      setEvent(res.data.events);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    eventSevices.getNewEvent(1, true).then(res => {
      if (res && res.data && res.data.events?.length > event.length) {
        setEvent(prev => {
          const newEvent = [...prev, ...res.data.events];
          const uniqueEvenet = newEvent.filter(
            (event, index, self) =>
              self.findIndex(e => e.id === event.id) === index,
          );
          return uniqueEvenet;
        });
      }
      setRefreshing(false);
    });
    setPage(1);
  }, []);

  const renderItemEvents = ({item, index}: any) => {
    return (
      <CarEventComponent
        title={item.title}
        key={index}
        img={item.image}
        content={item.content}
        timeStamp={item.timestamp}
        navigation={navigation}
        href={item.href}
      />
    );
  };
  const checkLastNotificationStatus = async () => {
    const res = await notificationServices.checkLastNotificationStatus(
      auth.userId,
    );
    if (res && res.data) {
      console.log('Check notification successfully', res.data.status);
      setStatusNoti(res.data.status === 'sent');
    }
  };
  useFocusEffect(
    useCallback(() => {
      getNewEvent();
      checkLastNotificationStatus();
      SocketService.setNavigation(navigation);
    }, []),
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({animated: true, offset: 0});
      }
    });
    return unsubscribe;
  }, [navigation]);


  return (
    <SafeAreaView
      style={[
        globalStyles.main,
        {backgroundColor: colors.background, paddingHorizontal: 0},
      ]}>
      <HeaderComponent
        iconLeft={
          <HambergerMenu size={appInfo.sizeIconBold} color={colors.icon} />
        }
        iconRight={
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationScreen')}>
            <Notification color={colors.icon} fontSize={appInfo.sizeIconBold} />
            <View
              style={[
                localStyles.notification,
                {
                  backgroundColor: statusNoti ? appColors.green : 'transparent',
                },
              ]}
            />
          </TouchableOpacity>
        }
        onPress1={() => navigation.openDrawer()}
      />

      {event?.length > 0 ? (
        <FlatList
          ref={flatListRef}
          onEndReachedThreshold={0.5}
          keyExtractor={(item, index): any => item.id}
          data={event}
          renderItem={renderItemEvents}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary || '#000']}
            />
          }
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={22} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
const localStyles = StyleSheet.create({
  notification: {
    height: 8,
    width: 8,
    borderRadius: 50,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
// Zoom ảnh
// Xem lượt like
//Share
