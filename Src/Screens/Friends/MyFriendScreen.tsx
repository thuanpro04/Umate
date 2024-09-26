import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {HeaderComponent} from '../Components/index';
import {ArrowLeft, Level} from 'iconsax-react-native';

const MyFriendScreen = () => {
  return (
    <View style={{flex:1, marginTop:StatusBar.currentHeight, backgroundColor:'violet'}}>
      <HeaderComponent
        iconLeft={<ArrowLeft size={30} color="red" />}
        iconRight={<Level size={30} color="red" />}
        title="Tin Nhắn"
        onPress={()=> console.log("Hello")
        }
      />
    </View>
  );
};

export default MyFriendScreen;
