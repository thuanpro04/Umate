import {useFocusEffect, useRoute} from '@react-navigation/native';
import {ArrowLeft2, SearchFavorite} from 'iconsax-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {appColors} from '../Theme/Colors/appColors';
import {appInfo} from '../Theme/appInfo';
import {authSelector} from '../redux/reducers/authReducer';
import {HeaderComponent, InputComponent, SpaceComponent} from './Components';
import CarUserChat from './Messages/Component/CarUserChat';
import {messageServices} from './Services/messageServices';
import {UserInfo} from './Untils/UserInfo';

const ShareScreen = ({navigation}: any) => {
  const [value, setValue] = useState('');
  const [conversationUsers, setConversationUsers] = useState<any[]>([]);
  const auth = useSelector(authSelector);
  const {arrUrlImages, isShare} = useRoute().params as {
    arrUrlImages: string | string[];
    isShare: boolean;
  };
  const socket = io(appInfo.BASE_URL);

  useFocusEffect(
    useCallback(() => {
      getConversation();
    }, []),
  );
  useEffect(() => {
    socket.on('receive_message', (data: any) => {
      console.log('Received message: ', data);
    });
    return () => {
      socket.off('receive_message');
    };
  }, []);
  const getConversation = async () => {
    const res = await messageServices.getAllConversationUsers(auth.userID);
    if (res && res.data) {
      setConversationUsers(res.data);
      console.log(conversationUsers);
    }
  };
  const cardImages = (url: string, index?: number) => {
    console.log(url);

    return (
      <Image
        key={index}
        source={{uri: url}}
        style={{width: 100, height: 100, borderRadius: 12, marginRight: 12}}
        resizeMode="cover"
      />
    );
  };

  const renderImages = () => {
    return Array.isArray(arrUrlImages) ? (
      <FlatList
        data={arrUrlImages}
        horizontal
        keyExtractor={item => item}
        renderItem={({item, index}) => {
          return cardImages(item, index);
        }}
      />
    ) : (
      cardImages(arrUrlImages)
    );
  };
  const handleSendImages = async (receiverID: string) => {
    const data = {
      senderID: auth.userID,
      receiverID: receiverID,
      content: '',
      imagesUrl: arrUrlImages,
    };
    try {
      socket.emit('send_message', data, (response: any) => {
        console.log('Message sent, server response:', response);
      });
      navigation.navigate('Messages');
    } catch (error) {
      console.log('share images', error);
    }
  };
  return (
    <SafeAreaView>
      <HeaderComponent
        iconLeft={
          <ArrowLeft2 color={appColors.blueBack} size={appInfo.sizeIconBold} />
        }
        title={'Share friend'}
      />
      {arrUrlImages && (
        <View style={[styles.container, {}]}>{renderImages()}</View>
      )}
      <SpaceComponent height={20} />
      <View style={styles.container}>
        <InputComponent
          value={value}
          onChange={e => setValue(e)}
          styles={{paddingVertical: 6}}
          subffix={
            <SearchFavorite
              color={appColors.blueBack}
              size={appInfo.sizeIconBold}
            />
          }
          placehold="Search..."
        />
      </View>
      <SpaceComponent height={20} />
      <View>
        {conversationUsers.map((item, index) => (
          <CarUserChat
            key={index}
            name={item.name}
            isBtnSend={isShare}
            massv={UserInfo.getYearOfbirth(item.email)}
            lastMessage={item.lastMessage}
            image={item.avatar}
            onPressSend={() => handleSendImages(item.userID)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center'},
});
