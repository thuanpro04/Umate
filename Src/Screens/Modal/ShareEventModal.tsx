import React, {ReactNode, useCallback, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Icon library
import {useDispatch, useSelector} from 'react-redux';
import io from 'socket.io-client';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {SpaceComponent, TextComponent} from '../Components';
import {messageServices} from '../Services/messageServices';
import {UserInfo} from '../Untils/UserInfo';
import {eventSevices} from '../Services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  title: string;
  icon: ReactNode;
  styles?: StyleProp<ViewStyle>;
  href: string;
  eventId: string;
  urlImg: string;
}

const ShareEventModal = (props: Props) => {
  const {title, icon, styles, href, eventId, urlImg} = props;
  const [value, setValue] = useState('');
  const modalizeRef = useRef<Modalize>();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const socket = io(appInfo.BASE_URL);
  const url = `https://tdmu.edu.vn${href}`;
  const dispatch = useDispatch();
  const onOpenModal = () => {
    modalizeRef.current?.open();
    getAllConversation();
  };

  const onCloseModal = () => {
    modalizeRef.current?.close();
  };
  const handleSendEventForUser = async (key: string, Id: string | string[]) => {
    const messageData = {
      senderId: auth.userId,
      content: url,
      imagesUrl: [],
    };
    try {
      if (key === 'personal') {
        const data = {
          ...messageData,
          receiverId: Id,
        };
        // console.log(data);

        socket.emit('send_message', data, (response: any) => {
          console.log(
            'Message sent to user:',
            Id,
            'server response:',
            response,
          );
        });
      } else {
        const data = {
          ...messageData,
          recipients: Id,
        };
        socket.emit('send event info ', data, (response: any) => {
          console.log(
            'Message sent to user:',
            Id,
            'server response:',
            response,
          );
        });
      }

      onCloseModal();
    } catch (error) {
      console.log('handle share event error: ', error);
    }

    // socket.emit('send event ', href);
  };

  const handlePostEventMyApp = async () => {
    try {
      const data = {
        userId: auth.userId,
        eventId,
        content: value,
        urlImg,
        href: url,
      };
      const res = await eventSevices.shareEventMyApp(data);
      if (res?.data) {
        const eventShares = res.data.eventShares;
    
        
        dispatch(addAuth({...auth,eventShares}));
        // await AsyncStorage.setItem('auth', JSON.stringify(res.data));
        // console.log('res.data', res.data);
      }
    } catch (error) {
      console.log('share event my app error: ', error);
    }
  };
  const handleShare = async (platform: string) => {
    console.log(platform);

    switch (platform) {
      case 'In-App':
        await handlePostEventMyApp();
        break;

      default:
        break;
    }
    onCloseModal();
  };
  const getAllConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await messageServices.getAllConversationUsers(auth.userId);
      if (res?.data && res) {
        setUsers(res?.data);
        // console.log(res.data, 1234);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false);
    }
  }, []);
  const renderUserItems = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={item.userId}
        onPress={async () =>
          await handleSendEventForUser(
            item.type,
            item.userId ? item.userId : item.groupId,
          )
        }
        style={{marginRight: 12, alignItems: 'center'}}>
        <Image source={{uri: item.avatar}} style={globalStyles.userImg} />
        <TextComponent
          label={
            item.name
              ? UserInfo.getName(item.name)
              : item.groupName.split(' ')[0]
          }
          styles={globalStyles.actionText}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <TouchableOpacity onPress={() => onOpenModal()} style={styles}>
        {icon && icon}
        <Text style={globalStyles.actionText}>{title}</Text>
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          closeSnapPointStraightEnabled
          adjustToContentHeight
          modalStyle={modalStyles.modal}>
          <View style={modalStyles.container}>
            <TextComponent styles={modalStyles.title} label="Share Event" />
            <TextInput
              value={value}
              onChangeText={setValue}
              style={modalStyles.input}
              placeholder="Add a comment..."
              placeholderTextColor={appColors.grey}
              multiline
              numberOfLines={4}
              maxLength={300}
            />
            <View>
              <TextComponent label="Gửi message" styles={modalStyles.title} />
              <FlatList
              
                data={users}
                horizontal
                keyExtractor={item => item.userId}
                renderItem={renderUserItems}
              />
            </View>
            <SpaceComponent height={12} />
            <View style={modalStyles.shareOptions}>
              <TouchableOpacity
                style={modalStyles.shareButton}
                onPress={() => handleShare('Facebook')}>
                <Icon name="facebook" size={24} color={appColors.blue} />
                <Text style={modalStyles.buttonText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.shareButton}
                onPress={() => handleShare('Email')}>
                <Icon name="email" size={24} color={'#FFCA28'} />
                <Text style={modalStyles.buttonText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.shareButton}
                onPress={async () => await handleShare('In-App')}>
                <Icon name="send" size={24} color={appColors.orange2} />
                <Text style={modalStyles.buttonText}>In-App</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default ShareEventModal;

const modalStyles = StyleSheet.create({
  modal: {
    backgroundColor: appColors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.black,
    marginBottom: 12,
  },
  input: {
    backgroundColor: appColors.background,
    borderWidth: 0.2,
    borderColor: appColors.grey,
    borderRadius: 8,
    padding: 12,
    color: appColors.black,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: appColors.black,
    marginTop: 4,
  },
});
