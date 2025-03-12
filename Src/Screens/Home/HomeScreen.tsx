import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { HambergerMenu, Notification } from 'iconsax-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import { globalStyles } from '../../Styles/globalStyle';
import { appColors } from '../../Theme/Colors/appColors';
import { appInfo } from '../../Theme/appInfo';
import { addAuth, authSelector } from '../../redux/reducers/authReducer';
import { profileSelector } from '../../redux/reducers/profileSlice';
import { themeSelector } from '../../redux/reducers/themeSlice';
import { CarEventComponent, HeaderComponent } from '../Components';
import { eventSevices } from '../Services/eventService';
import { userServices } from '../Services/userService';
import { UserInfo } from '../Untils/UserInfo';
const HomeScreen = () => {
  const [event, setEvent] = useState<any[]>([]);
  const [limitPage, setLimitPage] = useState(1);
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const socket = io(appInfo.BASE_URL);
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
        id={item._id}
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
        {backgroundColor: colors.background, paddingHorizontal: 0},
      ]}>
      <HeaderComponent
        iconLeft={
          <HambergerMenu size={appInfo.sizeIconBold} color={colors.icon} />
        }
        iconRight={
          // NotificationScreen
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationScreen')}>
            <Notification color={colors.icon} fontSize={appInfo.sizeIconBold} />
            <View style={localStyles.notification} />
          </TouchableOpacity>
        }
        onPress1={() => navigation.openDrawer()}
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
