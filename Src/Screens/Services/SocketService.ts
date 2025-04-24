// SocketService.ts
import {io, Socket} from 'socket.io-client';
import PushNotification from 'react-native-push-notification';
import {Platform, PermissionsAndroid} from 'react-native';
import {setIncomingCall, setSocket} from '../../redux/reducers/socketSlice';
import store from '../../redux/store';
import {appInfo} from '../../Theme/appInfo';
import {NavigationProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserInfo} from '../Untils/UserInfo';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private userId: string | null = null;
  private navigation: NavigationProp<any> | null = null;

  private constructor() {
    // Khởi tạo kênh thông báo
    PushNotification.createChannel(
      {
        channelId: 'zego_video_call',
        channelName: 'Video Call Notifications',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`),
    );
    const self = this;
    PushNotification.configure({
      onNotification: async function (notification) {
        console.log('NOTIFICATION:', {
          ...notification.data,
          typeNotifi: notification.data.typeNotifi,
        });
        self.handleNotification({
          ...notification.data,
          typeNotifi: notification.data.typeNotifi,
        });
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }
  public handleNotification(data: any) {
    console.log(data, 12);

    if (data.typeNotifi === 'message') {
      AsyncStorage.setItem('ConversationInfo', JSON.stringify({...data}));
      this.navigation?.navigate('Chat');
    } else {
      this.navigation?.navigate('NotificationScreen');
    }
  }

  public sendNotification(data: any) {
    PushNotification.localNotification({
      channelId: 'zego_video_call',
      title: data.name,
      message:
        data.content?.length === 0
          ? 'hình ảnh mới'
          : data.typeNotifi === 'message'
          ? UserInfo.decryptText(data.content)
          : data.content,
      userInfo: {
        ...data,
      },
      largeIconUrl: data.avatar,
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
  public setNavigation(navigation: NavigationProp<any>) {
    this.navigation = navigation;
  }
  public getNavigation() {
    return this.navigation;
  }
  private async requestNotificationPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('⚠️ Quyền thông báo bị từ chối');
      }
    }
  }

  public async connect(userId: string) {
    if (!userId) return null;

    // Lưu userId cho kết nối lại
    this.userId = userId;

    // Ngắt kết nối cũ nếu tồn tại
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    await this.requestNotificationPermission();

    console.log('Đang kết nối socket với userId:', userId);

    // Tạo kết nối socket mới
    this.socket = io(appInfo.BASE_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    });

    // Đợi socket kết nối trước khi thiết lập sự kiện
    return new Promise<Socket>(resolve => {
      if (!this.socket) {
        resolve(null as any);
        return;
      }

      this.socket.on('connect', () => {
        console.log('Socket kết nối thành công, socketId:', this.socket?.id);

        // Cập nhật socket trong Redux store
        store.dispatch(setSocket(this.socket));

        // Đăng ký tài khoản cho cuộc gọi
        this.socket?.emit('callRegister', userId);

        // Thiết lập các lắng nghe sự kiện
        this.setupEventListeners();

        resolve(this.socket as Socket);
      });

      this.socket.on('connect_error', error => {
        console.log('Socket kết nối thất bại:', error);
        resolve(null as any);
      });
    });
  }

  private setupEventListeners() {
    if (!this.socket) {
      console.log('Không thể thiết lập sự kiện - socket chưa khởi tạo');
      return;
    }
    // Xóa tất cả listener cũ (nếu có) để tránh trùng lặp
    this.socket.off('incomingCall');
    this.socket.off('feedbackCancelCall');
    this.socket.off('notification_message');
    this.socket.off('disconnect');
    // Log khi mất kết nối và tự động kết nối lại
    this.socket.on('disconnect', reason => {
      console.log('Socket bị ngắt kết nối:', reason);
      if (reason === 'io server disconnect' && this.userId) {
        // Kết nối lại nếu server ngắt kết nối
        setTimeout(() => this.connect(this.userId as string), 1000);
      }
    });
    this.socket.on('reconnect', attemptNumber => {
      console.log('Đã kết nối lại socket sau', attemptNumber, 'lần thử');
      if (this.userId) {
        this.socket?.emit('callRegister', this.userId);
      }
    });
    // Thêm lại các listener mới
    this.socket.on('incomingCall', (callData: any) => {
      console.log('📞 Nhận cuộc gọi từ:', callData);
      store.dispatch(setIncomingCall(callData));
    });
    this.socket.on('call_end', () => {
      store.dispatch(setIncomingCall(null));
      console.log('Cuộc gọi đã kết thúc, đã xóa dữ liệu cuộc gọi');
    });
    this.socket.on('feedbackCancelCall', (data: any) => {
      const dataCall = {
        title: `Bạn có cuộc gọi nhỡ từ ${data.name}`,
        content: UserInfo.encryptText(`${new Date().toLocaleString()}`),
      };
      this.sendNotification(dataCall);
    });

    this.socket.on('notification_message', (data: any) => {
      this.sendNotification(data);
    });
  }
  public resetCallState() {
    store.dispatch(setIncomingCall(null));
  }
  public getSocket(): Socket | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }

  public addCustomEventListener(
    event: string,
    handler: (...args: any[]) => void,
  ) {
    if (!this.socket) {
      console.log('Không thể thêm listener - socket chưa khởi tạo');
      return false;
    }

    this.socket.on(event, handler);
    return true;
  }

  public removeCustomEventListener(
    event: string,
    handler?: (...args: any[]) => void,
  ) {
    if (!this.socket) return;

    if (handler) {
      this.socket.off(event, handler);
    } else {
      this.socket.off(event);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setSocket(null));
      console.log('Socket đã ngắt kết nối');
    }
  }
}

export default SocketService.getInstance();
