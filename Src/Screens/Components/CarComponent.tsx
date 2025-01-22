import {Message, MessageQuestion, Share} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import ActionIconComponent from './ActionIconComponent';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from './index';
import Foundation from 'react-native-vector-icons/Foundation';
import {eventSevices} from '../Services/eventService';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {debounce} from 'lodash';
interface Props {
  img: string;
  content: string;
  timeStamp: string;
  eventId: string;
  like: boolean;
  countLike: number;
}

const CarComponent = (props: Props) => {
  const {img, content, timeStamp, eventId, like, countLike} = props;
  const [isLiked, setLiked] = useState(like);
  const [isProcessing, setProcessing] = useState(false);
  const [count, setCount] = useState<any>(countLike);
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
  const updateUserHeartForEvent = debounce(async (action: 'add' | 'cancel') => {
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
  const handleLikeClick = () => {
    if (isProcessing) return; // Nếu đang xử lý, không cho phép bấm

    setProcessing(true);
    setLiked(!isLiked);

    const action = isLiked ? 'cancel' : 'add';
    action === 'add'
      ? setCount((prev: any) => prev + 1)
      : setCount((prev: any) => (prev > 0 ? prev - 1 : 0));
    updateUserHeartForEvent(action);
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
        <TextComponent label={content} styles={localStyles.content} size={15} />
        <SpaceComponent height={10} />
        <Image source={{uri: img}} style={localStyles.postImage} />
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
          <ButtonComponent
            type="action"
            onPress={() => console.log('hiển thị modal!!')}
            label={count.toString()}
            textStyle={localStyles.actionText}
          />
        </View>

        <TouchableOpacity style={localStyles.actionButton}>
          <Foundation
            name="social-skillshare"
            size={appInfo.sizeIcon}
            color={appColors.grey}
          />
          <TextComponent
            label="Share"
            styles={localStyles.actionText}
            size={14}
          />
        </TouchableOpacity>
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
