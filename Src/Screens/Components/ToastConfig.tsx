import React from 'react';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {useColorScheme} from 'react-native';

const ToastConfig = (theme: 'light' | 'dark') => ({
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme === 'light' ? '#4CAF50' : '#81C784',
        backgroundColor: theme === 'light' ? '#E8F5E9' : '#2E7D32',
      }}
      text1Style={{
        color: theme === 'light' ? '#2E7D32' : '#C8E6C9',
        fontWeight: 'bold',
      }}
      text2Style={{
        color: theme === 'light' ? '#388E3C' : '#A5D6A7',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: theme === 'light' ? '#F44336' : '#EF9A9A',
        backgroundColor: theme === 'light' ? '#FFEBEE' : '#C62828',
      }}
      text1Style={{
        color: theme === 'light' ? '#C62828' : '#FFCDD2',
        fontWeight: 'bold',
      }}
      text2Style={{
        color: theme === 'light' ? '#D32F2F' : '#FFCDD2',
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme === 'light' ? '#2196F3' : '#90CAF9',
        backgroundColor: theme === 'light' ? '#E3F2FD' : '#1565C0',
      }}
      text1Style={{
        color: theme === 'light' ? '#1565C0' : '#BBDEFB',
        fontWeight: 'bold',
      }}
      text2Style={{
        color: theme === 'light' ? '#1976D2' : '#90CAF9',
      }}
    />
  ),
});
export default ToastConfig;
