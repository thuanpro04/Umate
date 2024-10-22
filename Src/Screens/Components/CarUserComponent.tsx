import React, {ReactNode, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import ButtonComponent from './ButtonComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../Theme/appInfo';
import SpaceComponent from './SpaceComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import {Message, Messenger} from 'iconsax-react-native';
import {globalStyles} from '../../Styles/globalStyle';
import {friendServices} from '../Services/friendService.';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
interface Props {
  img?: any;
  name: string;
  onPressYes?: () => void;
  sayYes?: string;
  sayNo?: string;
  onPressNo?: () => void;
  onPressImg?: () => void;
  isShowBtn?: boolean;
  onPressCancel?: () => void;
  isFind?: boolean;
  iconAddCancel?: boolean;
  styles?: StyleProp<ViewStyle>;
  majoring?: string;
  onPressEllipsis?: () => void;
  iconM?: boolean;
  onPressMessages?: () => void;
  userID?: string;
  isFriend?: boolean;
  isRequestFriend?: boolean;
}

const CarUserComponent = (props: Props) => {
  const {
    onPressMessages,
    img,
    name,
    onPressYes,
    sayYes,
    sayNo,
    onPressNo,
    onPressImg,
    isShowBtn,
    onPressCancel,
    iconAddCancel,
    isFind,
    styles,
    majoring,
    onPressEllipsis,
    iconM,
    userID,
    isFriend,
    isRequestFriend,
  } = props;
  const [isShowIcon, setIsShowIcon] = useState(isRequestFriend ?? false);
  const auth = useSelector(authSelector);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleAdd_CancelFriends = async () => {
    if (userID) {
      try {
        const action = isShowIcon ? 'add' : 'cancel';
        const res = await friendServices.handleFriendActionAdd_Cancel(
          userID,
          action,
          auth.userID,
        );

        if (res) {
          // Thay đổi trạng thái ngay lập tức
          setIsShowIcon(!isShowIcon);
          // Tạo hiệu ứng hoạt hình
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            friction: 3,
            useNativeDriver: true,
          }).start(() => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }).start();
          });
        }
      } catch (error) {
        console.log('handleAdd_CancelFriends', error);
      }
    }
  };
  return isFind ? (
    <RowComponent
      styles={[
        iconAddCancel && localStyle.container,
        {paddingHorizontal: 10, paddingVertical: 10},
        styles,
      ]}>
      <Image
        source={{
          uri: img,
        }}
        style={[globalStyles.userImg, iconAddCancel && {width: 50, height: 50}]}
      />
      <View style={{flex: 1}}>
        <TextComponent label={name} title />
        <SpaceComponent height={8} />
        <TextComponent label={majoring ?? '...'} />
      </View>
      {!isFriend && iconAddCancel && (
        <TouchableOpacity
          onPress={handleAdd_CancelFriends}
          activeOpacity={0.7}
          style={[localStyle.buttonStyles, {transform: [{scale: scaleAnim}]}]}>
          {isShowIcon ? (
            <AntDesign
              name="check"
              size={appInfo.sizeIconBold}
              color={appColors.white}
            />
          ) : (
            <AntDesign
              name="adduser"
              size={appInfo.sizeIconBold}
              color={appColors.white}
            />
          )}
        </TouchableOpacity>
      )}
      {iconM && (
        <RowComponent>
          <ButtonComponent
            type="action"
            iconLeft={
              <Messenger size={appInfo.sizeIconBold} color={appColors.grey} />
            }
            onPress={onPressMessages}
          />
          <ButtonComponent
            type="action"
            iconRight={
              <AntDesign
                size={appInfo.sizeIconBold}
                color={appColors.grey}
                name="ellipsis1"
              />
            }
            onPress={onPressEllipsis}
          />
        </RowComponent>
      )}
    </RowComponent>
  ) : (
    <RowComponent styles={{flex: 1, justifyContent: 'flex-start'}}>
      <TouchableOpacity onPress={onPressImg} activeOpacity={0.7}>
        {img ? (
          <Image
            source={{
              uri:
                img ??
                'https://www.google.com/imgres?q=clipart%20person%20images&imgurl=https%3A%2F%2Fclipart-library.com%2F2023%2Flovepik-happy-man-png-image_401141286_wh1200.png&imgrefurl=https%3A%2F%2Fclipart-library.com%2Fclipart%2Fa-man-clipart-12.htm&docid=XVX5d6ymItErVM&tbnid=h-y_6bYduFw3RM&vet=12ahUKEwiY7dGi3O-IAxWrr1YBHfkCEDUQM3oECGUQAA..i&w=1002&h=1002&hcb=2&ved=2ahUKEwiY7dGi3O-IAxWrr1YBHfkCEDUQM3oECGUQAA',
            }}
            style={globalStyles.userImg}
          />
        ) : (
          <ActivityIndicator style={globalStyles.userImg} />
        )}
      </TouchableOpacity>
      <View style={{alignItems: 'flex-start'}}>
        <TextComponent label={name} title />
        <RowComponent styles={{gap: 20, paddingVertical: 0}}>
          <RowComponent styles={{gap: 0}}>
            <Image
              source={{
                uri:
                  img ??
                  'https://www.google.com/imgres?q=clipart%20person%20images&imgurl=https%3A%2F%2Fclipart-library.com%2F8300%2F2368%2Fsuccessful-business-man-clipart-xl.png&imgrefurl=https%3A%2F%2Fclipart-library.com%2Fclipart%2Fclipart-person_56.html&docid=OkUhgGtFeO4JbM&tbnid=Zmddp8xIvMJKSM&vet=12ahUKEwiY7dGi3O-IAxWrr1YBHfkCEDUQM3oECFcQAA..i&w=1906&h=1920&hcb=2&ved=2ahUKEwiY7dGi3O-IAxWrr1YBHfkCEDUQM3oECFcQAA',
              }}
              style={localStyle.imgHint}
            />
            <Image
              source={
                img ? {uri: img} : require('../../assets/images/imgBg.jpg')
              }
              style={localStyle.imgHint}
            />
          </RowComponent>
          <TextComponent label="7 ban chung" />
        </RowComponent>
        <RowComponent styles={{}}>
          {!isShowBtn ? (
            <>
              <ButtonComponent
                lable={sayYes}
                styles={{backgroundColor: appColors.blue, width: '40%'}}
                textStyle={{color: appColors.white}}
                onPress={onPressYes}
              />
              <ButtonComponent
                lable={sayNo}
                styles={{
                  backgroundColor: appColors.grey2,
                  width: '40%',
                  paddingVertical: 1,
                }}
                onPress={onPressNo}
              />
            </>
          ) : (
            <ButtonComponent
              lable={'Cancel'}
              styles={{
                backgroundColor: appColors.grey2,
                width: '80%',
                paddingVertical: 5,
              }}
              onPress={onPressCancel}
            />
          )}
        </RowComponent>
      </View>
    </RowComponent>
  );
};

export default CarUserComponent;
const localStyle = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    borderWidth: 1,

    borderColor: appColors.grey2,
    borderRadius: 10,
    width: '90%',
  },
  imgHint: {
    width: 25,
    height: 25,
    marginRight: -12,
    borderRadius: 100,
    backgroundColor: appColors.grey2,
  },
  buttonStyles: {
    borderRadius: 100,
    padding: 7,
    backgroundColor: appColors.blue,
  },
});
