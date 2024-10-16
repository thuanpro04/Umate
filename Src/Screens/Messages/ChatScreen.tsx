import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {ContainerComponent, HeaderComponent} from '../Components';
import ChatHeader from './Component/ChatHeader';
import ChatBody from './Component/ChatBody';
import ChatFoot from './Component/ChatFoot';
import {useRoute} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
const ChatScreen = () => {
  const {userName, avatar, currentUserID, userID} = useRoute().params as {
    userName: string;
    avatar: string;
    currentUserID: string;
    userID: string;
  };
  return (
    <ContainerComponent styles={{paddingBottom: 0}}>
      <HeaderComponent
        title={userName}
        image={avatar}
        iconLeft={
          <ArrowLeft size={appInfo.sizeIconBold} color={appColors.black} />
        }
        isBcolor
        iconRight={
          <AntDesign
            size={appInfo.sizeIconBold}
            color={appColors.grey}
            name="ellipsis1"
          />
        }
      />
      <ChatBody currentUserID={currentUserID} userID={userID} />
    </ContainerComponent>
  );
};

export default ChatScreen;
