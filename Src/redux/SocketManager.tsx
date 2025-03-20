import {useNavigation} from '@react-navigation/native';
import {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SocketService from '../Screens/Services/SocketService';
import {authSelector} from './reducers/authReducer';
import {useTranslation} from 'react-i18next';

const SocketManager = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const socketInitialized = useRef(false);
  // const socketRef = useRef<Socket | null>(null);
  // const requestNotificationPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //     );
  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('⚠️ Quyền thông báo bị từ chối');
  //     }
  //   }
  // };
  // PushNotification.configure({
  //   onNotification: function (notification) {
  //     console.log('NOTIFICATION:', notification);
  //   },
  //   popInitialNotification: true,
  //   requestPermissions: true, // Yêu cầu quyền trên iOS
  // });
  // const sendNotification = async (data: any) => {
  //   PushNotification.localNotification({
  //     channelId: 'zego_video_call', // Trùng với channelId đã tạo
  //     title: data.name,
  //     message: data.content.length === 0 ? 'hình ảnh mới' : data.content,
  //     userInfo: {senderId: data.senderId, receiverId: data.receiverId},
  //     largeIconUrl: data.avatar,
  //   });
  // };
  // useEffect(() => {
  //   if (!auth.userId) return;

  //   if (!socketRef.current) {
  //     socketRef.current = io(appInfo.BASE_URL, {
  //       reconnection: true,//Cho phép tự động kết nối lại nếu kết nối bị mất.
  //       reconnectionAttempts: Infinity, //	Thử kết nối lại vô hạn lần khi mất kết nối.
  //       reconnectionDelay: 1000,//	Đợi 1 giây trước mỗi lần thử kết nối lại.
  //       timeout: 20000,
  //     });
  //     dispatch(setSocket(socketRef.current));
  //     requestNotificationPermission();
  //     socketRef.current.emit('callRegister', auth.userId);
  //     socketRef.current.on('incomingCall', (callData: any) => {
  //       console.log('📞 Nhận cuộc gọi từ:', callData);
  //       dispatch(setIncomingCall(callData));
  //       if (callData) {
  //         navigation.navigate('CallWaitingScreen', {
  //           callData,
  //         });
  //       }
  //     });
  //   }

  //   socketRef.current.on('feedbackCancelCall', data => {
  //     const dataCall = {
  //       title: `Bạn có cuộc gọi nhở từ ${data.name}`,
  //       content: `${new Date().toLocaleString()}`,
  //     };
  //     sendNotification(dataCall);
  //     navigation.goBack();
  //   });
  //   socketRef.current.on('notification_message', (data: any) => {
  //     sendNotification(data);
  //   });
  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.off('incomingCall');
  //       socketRef.current.off('callRegister');
  //       socketRef.current.off('feedbackCancelCall');
  //       socketRef.current.off('notification_message');
  //       dispatch(setSocket(null));
  //       socketRef.current.disconnect();
  //       socketRef.current = null;
  //     }
  //   };
  // }, [auth?.userId]);

  // Hiển thị thông báo cuộc gọi đến
  useEffect(() => {
    let isMounted = true;

    const setupSocket = async () => {
      if (!auth.userId || socketInitialized.current) return;

      try {
        console.log('Initializing socket connection...');
        socketInitialized.current = true;

        // Kết nối socket qua service
        const socket = await SocketService.connect(auth.userId);
        if (!socket || !isMounted) return;

        // Thêm handlers cho điều hướng
        const handleIncomingCall = (callData: any) => {
          console.log('Xử lý cuộc gọi đến trong SocketManager:', callData);
          if (callData && isMounted) {
            navigation.navigate('CallWaitingScreen', {
              callData,
            });
          }
        };

        const handleCancelCall = (data: any) => {
          console.log('Xử lý hủy cuộc gọi trong SocketManager');
          if (isMounted) {
            navigation.goBack();
          }
        };

        // Đăng ký các sự kiện liên quan đến điều hướng
        SocketService.addCustomEventListener(
          'incomingCall',
          handleIncomingCall,
        );
        SocketService.addCustomEventListener(
          'feedbackCancelCall',
          handleCancelCall,
        );
      
        console.log('Socket handlers registered successfully');

        return () => {
          // Chỉ xóa các sự kiện liên quan đến điều hướng khi component unmount
          SocketService.removeCustomEventListener(
            'incomingCall',
            handleIncomingCall,
          );
          SocketService.removeCustomEventListener(
            'feedbackCancelCall',
            handleCancelCall,
          );
        };
      } catch (error) {
        console.error('Lỗi khi thiết lập socket:', error);
        socketInitialized.current = false;
      }
    };

    setupSocket();

    return () => {
      isMounted = false;
      // KHÔNG đóng socket ở đây, chỉ xóa các listeners
    };
  }, [auth?.userId, navigation]);

  return null;
};

export default SocketManager;

const styles = StyleSheet.create({});
