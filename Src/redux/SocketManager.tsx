import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from './reducers/authReducer';
import {useNavigation} from '@react-navigation/native';
import {io, Socket} from 'socket.io-client';
import {appInfo} from '../Theme/appInfo';
import {setIncomingCall, setSocket} from './reducers/socketSlice';
import PushNotification from 'react-native-push-notification';
import {Notification} from '../Screens/Untils/Notification';
import {UserInfo} from '../Screens/Untils/UserInfo';

const SocketManager = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const navigation = useNavigation<any>();
  const socketRef = useRef<Socket | null>(null);
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('⚠️ Quyền thông báo bị từ chối');
      }
    }
  };

  useEffect(() => {
    if (!auth.userId) return;

    if (!socketRef.current) {
      socketRef.current = io(appInfo.BASE_URL);
      dispatch(setSocket(socketRef.current));
      requestNotificationPermission();
      socketRef.current.emit('callRegister', auth.userId);

      socketRef.current.on('incomingCall', (callData: any) => {
        console.log('📞 Nhận cuộc gọi từ:', callData);
        dispatch(setIncomingCall(callData));
        if (callData) {
          navigation.navigate('CallWaitingScreen', {
            callData,
          });
        }
      });
    }
    

    socketRef.current.on('feedbackRefused', (data: any) => {
      console.log('callRefused: ', data.callID);
      if(data.type === 'personal_voice' || data.type === 'personal_viceo'){
        navigation.goBack();
      }
      Notification.showToast(
        'error',
        `${data.userName} đã từ chối`,
        'Cuộc gọi của bạn ',
      );
    });
    socketRef.current.on('feedbackCancelCall', data => {
      Notification.showToast(
        'info',
        `Bạn có cuộc gọi nhở từ ${UserInfo.getName(data.name)}`,
        `${new Date().toLocaleString()}`,
      );
      navigation.goBack();
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('incomingCall');
        socketRef.current.off('callRegister');
        socketRef.current.off('feedbackRefused');
        socketRef.current.off('feedbackCancelCall');
        dispatch(setSocket(null));
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [auth?.userId]);

  // Hiển thị thông báo cuộc gọi đến

  return null;
};

export default SocketManager;

const styles = StyleSheet.create({});
