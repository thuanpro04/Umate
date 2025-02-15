import {debounce} from 'lodash';
import React, {useCallback, useRef, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import LikeListModal from '../Modal/LikeListModal';
import {eventSevices} from '../Services/eventService';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from './index';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import Share from 'react-native-share';
import RNBlobUtil from 'react-native-blob-util';
import ShareEventModal from '../Modal/ShareEventModal';
import {globalStyles} from '../../Styles/globalStyle';
import {DirectRight} from 'iconsax-react-native';
interface Props {
  img: string;
  content: string;
  timeStamp: string;
  eventId: string;
  like: boolean;
  countLike: number;
  listUsers: string[];
  navigation: any;
  href: string;
  title: string;
}

const CarComponent = (props: Props) => {
  const {
    img,
    content,
    timeStamp,
    eventId,
    like,
    countLike,
    listUsers,
    navigation,
    href,
    title,
  } = props;

  const [isLiked, setLiked] = useState(like);
  const [isProcessing, setProcessing] = useState(false);
  const [isShowContent, setIsShowContent] = useState(false);
  const [count, setCount] = useState(countLike);
  const auth = useSelector(authSelector);

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
  const updateUserHeartForEvent = debounce(async (action: any) => {
    try {
      const res = await eventSevices.updateUserHeartForEvent(
        auth.userId,
        eventId,
        action,
      );
      if (res?.data) {
        console.log(res?.data.messages);
      }
    } catch (error) {
      console.error('Heart event error: ', error);
      // Hoàn tác trạng thái nếu có lỗi
      setLiked(prev => !prev);
    } finally {
      setProcessing(false); // Kết thúc trạng thái xử lý
    }
  }, 5000);
  const handleLikeClick = useCallback(() => {
    if (isProcessing) return; // Nếu đang xử lý, không cho phép bấm

    setProcessing(true);
    const newLikedState = !isLiked;
    setLiked(newLikedState);

    // Tính toán giá trị mới của count
    const newCount = newLikedState ? count + 1 : count > 0 ? count - 1 : 0;

    setCount(newCount); // Cập nhật count

    let action = newLikedState ? 'add' : 'cancel';
    console.log(newLikedState, newCount);

    updateUserHeartForEvent(action);
  }, [count, isLiked, isProcessing]);
  const fetchImageAsBase64 = async () => {
    try {
      const base64Img = await RNBlobUtil.fetch('GET', img).then(res =>
        res.base64(),
      );
      console.log(base64Img);
      return `data:image/jpeg;base64,${base64Img}`;
    } catch (error) {
      console.error('Error fetch image base64 error:', error);
    }
  };

  return (
    <View style={localStyles.card}>
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
              label="Ẩn đi"
              styles={globalStyles.actionText}
              size={22}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsShowContent(!isShowContent)}>
            <TextComponent
              label="Xem thêm"
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
                label={'Đi đến'}
                styles={localStyles.link}
                size={15}
              />
              <DirectRight color={appColors.blue} size={appInfo.sizeIcon} />
            </RowComponent>
          </View>
        )}
        <SpaceComponent height={10} />
        <ZoomImageComponent url={img} styles={localStyles.postImage} />
      </View>
      {/* Actions */}
      <RowComponent styles={localStyles.actionRow}>
        <View
          style={[
            localStyles.actionButton,
            isLiked && localStyles.activeButton,
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
          eventId={eventId}
          styles={localStyles.actionButton}
          title="Share"
          urlImg={img}
          href={href}
          icon={
            <Foundation
              name="social-skillshare"
              size={appInfo.sizeIcon}
              color={appColors.grey}
            />
          }
        />
      </RowComponent>
    </View>
  );
};

export default CarComponent;

const localStyles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 15,
    backgroundColor: appColors.white,
    shadowColor: '#000',
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
    color: '#333333',
    fontWeight: '600',
  },
  timestamp: {
    color: appColors.grey,
    fontSize: 12,
  },
  content: {
    color: '#333333',
    lineHeight: 22,
  },
  link: {
    color: appColors.blue,
    fontStyle: 'italic',
  },
  title: {
    lineHeight: 22,
    color: appColors.black,
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
    backgroundColor: appColors.bgIcon,
  },
  activeButton: {
    backgroundColor: '#FFCDD2',
  },
  actionText: {
    marginLeft: 8,
    color: appColors.grey,
  },
});
