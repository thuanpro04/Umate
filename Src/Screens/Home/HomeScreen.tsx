import {useFocusEffect} from '@react-navigation/native';
import {HambergerMenu, Notification} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {Address} from '../../assets/svgs/indexSvg';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import {CarEventComponent, HeaderComponent} from '../Components';
import {eventSevices} from '../Services/eventService';
import {userServices} from '../Services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}: any) => {
  const [event, setEvent] = useState<any[]>([]);
  const [limitPage, setLimitPage] = useState(1);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const getNewEvent = async () => {
    if (isLoading || page > limitPage) return; // Ngăn chặn gọi API khi đang tải hoặc hết trang.
    try {
      setIsLoading(true);

      const res = await eventSevices.getNewEvent(page);
      if (res?.data) {
        setEvent(prevEvent => {
          // Gộp các sự kiện mới với sự kiện cũ
          const mergedEvents = [...prevEvent, ...res.data.events];
          // Lọc ra các sự kiện duy nhất dựa trên 'id'
          const uniqueEvents = mergedEvents.filter(
            (event, index, self) =>
              index === self.findIndex(e => e._id === event._id),
          );

          // Cập nhật state chỉ với các sự kiện duy nhất
          return uniqueEvents;
        });
        console.log('Length', event.length);
        setLimitPage(res.data.totalPages);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Home get event fail error: ', error);
    } finally {
      setIsLoading(false); // Đặt trạng thái tải lại thành false.
    }
  };

  const renderItemEvents = ({item, index}: any) => {
    return (
      <CarEventComponent
        title={item.title}
        key={index}
        countLike={item.likes.length}
        like={item.likes.includes(auth.userId)}
        eventId={item.eventId}
        img={item.image}
        content={item.content}
        timeStamp={item.timestamp}
        listUsers={item.likes}
        navigation={navigation}
        href={item.href}
      />
    );
  };

  const renderFooter = () => {
    if (isLoading) {
      return <ActivityIndicator style={{marginBottom: 15}} size={30} />;
    }

    return null;
  };
  const renderHeader = () => {
    if (isLoading) {
      return <ActivityIndicator style={{marginBottom: 15}} size={18} />;
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      getNewEvent();
      const setOnline = async () => {
        await userServices.updateUserStatus(auth.userId, true);
        const fcmToken = await AsyncStorage.getItem('fcmtoken');
        dispatch(addAuth({...auth, fcmTokens: fcmToken}));
      };

      setOnline();
    }, []),
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.main,
        {backgroundColor: appColors.white, paddingHorizontal: 0},
      ]}>
      <HeaderComponent
        iconLeft={
          <HambergerMenu size={appInfo.sizeIconBold} color={appColors.blue} />
        }
        iconRight={
          <TouchableOpacity onPress={() =>{}}>
            <Notification
              color={appColors.blueBack}
              fontSize={appInfo.sizeIconBold}
            />
            <View style={localStyles.notification} />
          </TouchableOpacity>
        }
        onPress1={() => navigation.openDrawer()}
        // onPress2={() => navigation.navigate('GoongMapScreen')}
      />
      {event.length > 0 ? (
        <FlatList
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index): any => item._id.toString()}
          data={event}
          onEndReached={
            page <= limitPage && !isLoading ? getNewEvent : () => {}
          }
          renderItem={renderItemEvents}
          ListFooterComponent={page < limitPage ? renderFooter : <></>}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
const localStyles = StyleSheet.create({
  notification: {
    backgroundColor: appColors.green,
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
