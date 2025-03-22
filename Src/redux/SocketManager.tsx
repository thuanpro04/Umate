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
        const handleDisplayScreenOnCLickNotification = (data: any) => {
          console.log('Data notification: ', data);
          if (data.typeNotifi === 'message') {
            console.log('Chuyển màng hình message');
          } else {
            console.log('Chuyển màng hình home');
          }
        };
        SocketService.addCustomEventListener(
          'notification_message',
          handleDisplayScreenOnCLickNotification,
        );
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
