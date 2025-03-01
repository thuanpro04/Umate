import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {io} from 'socket.io-client';
import {appInfo} from '../../Theme/appInfo';

const ZegoCallDiaLogScreen = () => {
  const socket = io(appInfo.BASE_URL);
  useEffect(() => {
    socket.on('incomingCall', (callData: any) => {
      console.log('Nhận được cuộc gọi:', callData);
      // Alert.alert(
      //   'Cuộc gọi đến',
      //   `Bạn có cuộc gọi từ ${callData.userName}`,
      //   [
      //     {
      //       text: 'Từ chối',
      //       onPress: () => console.log('Call declined'),
      //       style: 'cancel',
      //     },
      //     {
      //       text: 'Trả lời',
      //       onPress: () => {
      //         // Chuyển hướng hoặc xử lý cuộc gọi tại đây
      //         console.log('Call accepted', callData);
      //       },
      //     },
      //   ],
      //   {cancelable: true},
      // );
    });
    return () => {
      socket.off('incomingCall');
    };
  }, []);
  return (
    <View>
      <Text>ZegoCallDiaLogScreen</Text>
    </View>
  );
};

export default ZegoCallDiaLogScreen;

const styles = StyleSheet.create({});
