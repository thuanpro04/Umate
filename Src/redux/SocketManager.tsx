import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from './reducers/authReducer';
import {useNavigation} from '@react-navigation/native';
import {io, Socket} from 'socket.io-client';
import {appInfo} from '../Theme/appInfo';
import {setIncomingCall} from './reducers/socketSlice';
import PushNotification from 'react-native-push-notification';

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
      requestNotificationPermission();
      socketRef.current.emit('callRegister', auth.userId);

      socketRef.current.on('incomingCall', (callData: any) => {
        console.log('📞 Nhận cuộc gọi từ:', callData);
        dispatch(setIncomingCall(callData));
        if (callData) {
          const screen =
            callData.callType === 'video' ? 'VideoCall' : 'VoiceCall';
          console.log(`📲 Chuyển hướng đến ${screen}`);
          navigation.navigate(screen, {
            roomID: callData.callID,
            name: callData.targetName,
            userID: callData.targetId,
          });
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('incomingCall');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [auth?.userId]);

  // Hiển thị thông báo cuộc gọi đến
  const showIncomingCallNotification = (callData: any) => {
    PushNotification.localNotification({
      channelId: 'zego_video_call',
      title: '📞 Cuộc gọi đến',
      message: `${callData.targetName} đang gọi cho bạn!`,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      priority: 'high',
      importance: 'high',
      actions: ['Chấp nhận', 'Từ chối'],
      invokeApp: true, // Đảm bảo mở app khi người dùng nhấn vào thông báo
      userInfo: {callData},
    });
  };

  // Cấu hình xử lý khi người dùng nhấn vào thông báo

  // Điều hướng đến màn hình nhận cuộc gọi khi người dùng nhấn "Chấp nhận"
  const handleAcceptCall = (callData: any) => {
    if (!callData || !callData.callType || !callData.callID) {
      console.log('⚠️ Dữ liệu cuộc gọi không hợp lệ:', callData);
      return;
    }
  };

  return null;
};

export default SocketManager;

const styles = StyleSheet.create({});
