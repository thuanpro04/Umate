import {useFocusEffect} from '@react-navigation/native';
import {HambergerMenu} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {Address} from '../../assets/svgs/indexSvg';
import {authSelector} from '../../redux/reducers/authReducer';
import {CarEventComponent, HeaderComponent} from '../Components';
import {eventSevices} from '../Services/eventService';

const HomeScreen = ({navigation}: any) => {
  const [event, setEvent] = useState<any[]>([]);
  const [limitPage, setLimitPage] = useState(1);
  const auth = useSelector(authSelector);
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
              index === self.findIndex(e => e.eventId === event.eventId),
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
  useFocusEffect(
    useCallback(() => {
      getNewEvent();
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
          <Address color={appColors.blueBack} fontSize={appInfo.sizeIconBold} />
        }
        onPress1={() => navigation.openDrawer()}
      />
      {event.length > 0 ? (
        <FlatList
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index): any => item.eventId.toString()}
          data={event}
          onEndReached={page < limitPage && !isLoading ? getNewEvent : () => {}}
          renderItem={renderItemEvents}
          onScroll={({nativeEvent}) => {
            const yOffSet = nativeEvent.contentOffset.y;
          }}
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
// Zoom ảnh
// Xem lượt like
//Share
