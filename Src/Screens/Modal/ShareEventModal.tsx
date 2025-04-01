import React, {ReactNode, useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Mailer from 'react-native-mail';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Icon library
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import {socketSelector} from '../../redux/reducers/socketSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {SpaceComponent, TextComponent} from '../Components';
import {eventSevices} from '../Services/eventService';
import {messageServices} from '../Services/messageServices';
import {addEvent, eventSelector} from '../../redux/reducers/eventSlice';
import {profileSelector} from '../../redux/reducers/profileSlice';
import LoadingModal from './LoadingModal';
import {UserInfo} from '../Untils/UserInfo';

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
  const profile = useSelector(profileSelector);
  const event = useSelector(eventSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const socket = useSelector(socketSelector).socket;
  const url = `https://tdmu.edu.vn${href}`;
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const onOpenModal = () => {
    modalizeRef.current?.open();
    getAllConversation();
  };

  const onCloseModal = () => {
    modalizeRef.current?.close();
  };
  const handleSendEventForUser = async (
    key: string,
    Id: string | string[],
    avatar: string,
    name: string,
    recipients: string[],
  ) => {
    setIsLoading(true);
    let content = UserInfo.encryptText(url);
    const messageData = {
      senderId: auth.userId,
      content,
      imagesUrl: [],
      avatar,
      name,
      title: value && value,
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
          groupId: Id,
          recipients,
        };

        socket.emit('send_message', data, (response: any) => {
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
    setIsLoading(false);
  };

  const handlePostEventMyApp = async () => {
    try {
      setIsLoading(true);

      const data = {
        userId: auth.userId,
        eventId,
        content: value,
        urlImg,
        href: url,
      };
      const res = await eventSevices.shareEventMyApp(data);
      if (res?.data) {
        const eventShares = res.data;
        console.log(eventShares);

        dispatch(addEvent({...event, eventShares}));
      }
    } catch (error) {
      console.log('share event my app error: ', error);
    }
    setIsLoading(false);
  };
  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'In-App':
        await handlePostEventMyApp();
        break;
      case 'facebook':
        await handleShareInFacebook();
        break;
      default:
        handleShareInEmail();
        break;
    }
    onCloseModal();
  };
  const handleShareInEmail = () => {
    Mailer.mail(
      {
        subject: 'Check out this event!',
        recipients: [], // Danh sách email người nhận (có thể truyền array)
        body: `Hey, check out this event: <a href="${url}">${url}</a>`,
        isHTML: true, // Sử dụng HTML để format nội dung email
      },
      (error, event) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent successfully!');
        }
      },
    );
  };
  const handleShareInFacebook = async () => {
    setIsLoading(true);

    const shareOptions: any = {
      title: 'Chia sẽ sự kiện',
      message: `Hãy xem sự kiện này ${url}`,
      url: urlImg,
      social: Share.Social.FACEBOOK,
    };
    try {
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.log('Error sharing on Facebook:', error);
    }
    setIsLoading(false);
  };
  const getAllConversation = useCallback(async () => {
    setIsLoading(true);
    const res = await messageServices.getAllConversationUsers(auth.userId);
    if (res?.data && res) {
      setUsers(res?.data.allConversations);
    }
    setIsLoading(false);
  }, []);
  const renderUserItems = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={item.userId ?? item.groupId}
        onPress={async () =>
          await handleSendEventForUser(
            item.type,
            item.userId ?? item.groupId,
            item.avatar,
            item.type == 'personal'
              ? profile.name
              : `${item.groupName} - ${profile.name}`,
            item?.invitedUsers,
          )
        }
        style={{marginRight: 12, alignItems: 'center'}}>
        <FastImage
          source={{
            uri: item.avatar,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={globalStyles.userImg}
        />
        <SpaceComponent height={6} />
        <TextComponent
          label={item.name ? item.name : item.groupName.split(' ')[0]}
          styles={globalStyles.actionText}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{}}>
      <TouchableOpacity onPress={() => onOpenModal()} style={styles}>
        {icon && icon}
        <TextComponent styles={globalStyles.actionText} label={title} />
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          closeSnapPointStraightEnabled
          adjustToContentHeight
          modalStyle={[
            modalStyles.modal,
            {backgroundColor: colors.background},
          ]}>
          <View style={modalStyles.container}>
            <TextComponent
              styles={modalStyles.title}
              label={t('share_event')}
            />
            <TextInput
              value={value}
              onChangeText={setValue}
              style={[
                modalStyles.input,
                {borderColor: colors.border, color: colors.text},
              ]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.placeholderTextColor}
              multiline
              numberOfLines={4}
              maxLength={300}
            />
            <View>
              <TextComponent
                label={t('send_message')}
                styles={modalStyles.title}
              />
              {users.length > 0 && (
                <FlatList
                  data={users.slice(0, 10).reverse()}
                  horizontal
                  keyExtractor={item =>
                    item.type === 'personal' ? item.userId : item.groupId
                  }
                  style={{flex: 1}}
                  renderItem={renderUserItems}
                />
              )}
            </View>
            <SpaceComponent height={12} />
            <View style={modalStyles.shareOptions}>
              <TouchableOpacity
                style={[
                  modalStyles.shareButton,
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleShare('facebook')}>
                <Icon name="facebook" size={24} color={colors.facebook} />
                <TextComponent
                  styles={modalStyles.buttonText}
                  label="Facebook"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.shareButton, {borderColor: colors.border}]}
                onPress={() => handleShare('email')}>
                <Icon name="email" size={24} color={colors.email} />
                <TextComponent label="Email" styles={modalStyles.buttonText} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.shareButton, {borderColor: colors.border}]}
                onPress={async () => await handleShare('In-App')}>
                <Icon name="send" size={24} color={colors.inApp} />
                <TextComponent label="In-App" styles={modalStyles.buttonText} />
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
      </Portal>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default ShareEventModal;

const modalStyles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 0.2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 4,
  },
});
