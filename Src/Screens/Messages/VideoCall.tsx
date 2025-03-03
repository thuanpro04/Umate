import React, {useRef} from 'react';

import {StyleSheet, View, Text, Button, Image} from 'react-native';
import ZegoUIKitPrebuiltCallService, {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function VideoCall(props: any) {
  const {roomID, name, userID} = useRoute().params as {
    roomID: string;
    name: string;
    userID: string;
  };
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={869126873}
        appSign={
          'fa5f0ebaabd60e8769aa6a5792f6330c188ffad58dd5b60a840e40a16fd545da'
        }
        userID={userID} // userID can be something like a phone number or the user id on your own user system.
        userName={name}
        callID={roomID} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ... ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onCallEnd: (callID: any, reason: any, duration: any) => {
            navigation.navigate("Home");

          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
