import {DirectRight} from 'iconsax-react-native';
import {debounce} from 'lodash';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import LikeListModal from '../Modal/LikeListModal';
import ShareEventModal from '../Modal/ShareEventModal';
import {eventSevices} from '../Services/eventService';
import {RowComponent, SpaceComponent, TextComponent} from './index';
import {setLikeEvent} from '../../redux/reducers/eventSlice';
import {UserInfo} from '../Untils/UserInfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface Props {
  img: string;
  content: string;
  timeStamp: string; 
  navigation: any;
  href: string;
  title: string;
}

const CarEventComponent = (props: Props) => {
  const {
    img,
    content,
    timeStamp,
    navigation,
    href,
    title,
  } = props;

  // const [isLiked, setLiked] = useState(like);
  const [isProcessing, setProcessing] = useState(false);
  const [isShowContent, setIsShowContent] = useState(false);
  // const [count, setCount] = useState(countLike);
  const {t} = useTranslation();
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const dispatch = useDispatch();
  const getTime = () => {
    const timePart: any = timeStamp.split('-')[0].trim();
    const [date, time, ampm] = timePart.split(' ');
    const [day, month, year] = date.split('/');
    const [hours, minutes] = time.split(':');

    // Bước 3: Định dạng lại năm và bỏ giây
    const formattedYear = year.slice(-2);
    const formattedTime = `${day}/${month}/${formattedYear} ${hours}:${minutes} ${ampm}`;
    return formattedTime;
  };
  // const updateUserHeartForEvent = debounce(async (action: any) => {
  //   const res = await eventSevices.updateUserHeartForEvent(
  //     auth.userId,
  //     id,
  //     action,
  //   );
  //   if (res?.data) {
  //     console.log(res?.data.messages, res.data.value);
  //     const parseData = await UserInfo.getUserData();
  //     const value: number = parseInt(res.data.value);
  //     parseData.event.like += value;
  //     await Promise.all([
  //       dispatch(setLikeEvent(value)),
  //       await UserInfo.setUserData(parseData),
  //     ]);
  //   }
  // }, 5000);

  // const handleLikeClick = useCallback(async () => {
  //   if (isProcessing) return; // If already processing, do nothing

  //   setProcessing(true);
  //   const newLikedState = !isLiked;
  //   setLiked(newLikedState);

  //   const newCount = newLikedState ? count + 1 : count > 0 ? count - 1 : 0;
  //   setCount(newCount);

  //   const action = newLikedState ? 'add' : 'cancel';
  //   await updateUserHeartForEvent(action); // Await the debounced function
  //   setProcessing(false);
  // }, [count, isLiked, isProcessing]);

  return (
    <View
      style={[
        localStyles.card,
        {backgroundColor: colors.background, shadowColor: colors.shadow},
      ]}>
      {/* Header */}
      <RowComponent styles={localStyles.header}>
        <RowComponent>
          <Image
            source={require('../../assets/images/logo_Tdmu.jpg')}
            style={localStyles.profileImage}
          />
          <TextComponent
            label="@Admin"
            styles={localStyles.username}
            size={16}
          />
        </RowComponent>
        <TextComponent
          label={timeStamp ? getTime().toString() : 'null'}
          styles={localStyles.timestamp}
        />
      </RowComponent>
      {/* Content */}
      <View>
        <TextComponent label={title} styles={localStyles.title} size={18} />
        <SpaceComponent height={4} />
        {isShowContent ? (
          <TouchableOpacity onPress={() => setIsShowContent(!isShowContent)}>
            <TextComponent
              label={t('hide')}
              styles={globalStyles.actionText}
              size={22}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsShowContent(!isShowContent)}>
            <TextComponent
              label={t('more')}
              styles={globalStyles.actionText}
              size={22}
            />
          </TouchableOpacity>
        )}
        {isShowContent && (
          <View>
            <TextComponent
              label={content}
              styles={localStyles.content}
              size={15}
            />
            <RowComponent
              styles={{justifyContent: 'flex-end'}}
              onPress={() =>
                navigation.navigate('DetailEvent', {
                  href: 'https://tdmu.edu.vn' + href,
                })
              }>
              <TextComponent
                label={t('next')}
                styles={localStyles.link}
                size={15}
              />
              <MaterialCommunityIcons name='arrow-right-bold' color={colors.icon} size={appInfo.sizeIcon} />
            </RowComponent>
          </View>
        )}
        <SpaceComponent height={10} />
        <ZoomImageComponent url={img} styles={localStyles.postImage} />
      </View>
      {/* Actions */}
      {/* <RowComponent styles={localStyles.actionRow}>
        <View
          style={[
            localStyles.actionButton,
            isLiked && localStyles.activeButton,
            {borderColor: colors.border, borderWidth: 1},
          ]}>
          <TouchableOpacity onPress={handleLikeClick}>
            <AntDesign
              name={isLiked ? 'heart' : 'hearto'}
              size={appInfo.sizeIcon}
              color={isLiked ? appColors.red : appColors.grey}
            />
          </TouchableOpacity>
          <LikeListModal
            title={count.toString()}
            listUsers={listUsers}
            navigation={navigation}
          />
        </View>

        <ShareEventModal
          eventId={id}
          styles={[
            localStyles.actionButton,
            {borderColor: colors.border, borderWidth: 1},
          ]}
          title="Share"
          urlImg={img}
          href={href}
          icon={
            <Foundation
              name="social-skillshare"
              size={appInfo.sizeIcon}
              color={colors.icon}
            />
          }
        />
      </RowComponent> */}
    </View>
  );
};

const localStyles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 15,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#3D9ADC',
    resizeMode: 'cover',
  },
  username: {
    marginLeft: 10,
    fontWeight: '600',
  },
  timestamp: {
    color: appColors.grey,
    fontSize: 12,
  },
  content: {
    lineHeight: 22,
  },
  link: {
    color: appColors.blue,
    fontStyle: 'italic',
  },
  title: {
    lineHeight: 22,
    fontWeight: '500',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  actionRow: {
    justifyContent: 'space-evenly',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: '#FFCDD2',
  },
  actionText: {
    marginLeft: 8,
    color: appColors.grey,
  },
});
export default CarEventComponent;
