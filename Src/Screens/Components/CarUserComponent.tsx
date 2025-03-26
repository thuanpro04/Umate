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
import {themeSelector} from '../../redux/reducers/themeSlice';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
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
  onPressPersonal?: () => void;
  userId?: string;
  isFriend?: boolean;
  isRequestFriend?: boolean;
  mutualFriend?: number;
  mutualUser?: any[];
}

const CarUserComponent = (props: Props) => {
  const {
    onPressPersonal,
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
    userId,
    isFriend,
    isRequestFriend,
    mutualFriend,
    mutualUser,
  } = props;

  const [isShowIcon, setIsShowIcon] = useState(isRequestFriend ?? false);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleAdd_CancelFriends = async () => {
    if (userId) {
      setIsShowIcon(!isShowIcon);
      const action = !isShowIcon ? 'add' : 'cancel';
      const res = await friendServices.handleFriendActionAdd_Cancel(
        userId,
        action,
        auth.userId,
      );

      if (res && res.data) {
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
    }
  };
  return isFind ? (
    <RowComponent
      styles={[
        iconAddCancel && localStyle.container,
        {borderColor: colors.border},
        styles,
      ]}>
      <TouchableOpacity onPress={onPressImg}>
        <FastImage
          source={{
            uri: img,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={[
            globalStyles.userImg,
            iconAddCancel && {width: 50, height: 50},
          ]}
        />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <TextComponent label={name} title />
        <SpaceComponent height={8} />
        <TextComponent
          label={majoring ?? t('majoring')}
          styles={globalStyles.actionText}
        />
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
              color={colors.icon}
            />
          ) : (
            <AntDesign
              name="adduser"
              size={appInfo.sizeIconBold}
              color={colors.icon}
            />
          )}
        </TouchableOpacity>
      )}
      {iconM && (
        <ButtonComponent
          type="action"
          iconRight={
            <AntDesign
              size={appInfo.sizeIconBold}
              color={colors.icon}
              name="ellipsis1"
            />
          }
          onPress={onPressEllipsis}
        />
      )}
    </RowComponent>
  ) : (
    <RowComponent styles={{flex: 1, justifyContent: 'flex-start'}}>
      <TouchableOpacity
        onPress={() => onPressImg && onPressImg()}
        activeOpacity={0.7}>
        {img ? (
          <FastImage
            source={{
              uri:
                img ??
                'https://www.google.com/imgres?q=clipart%20person%20images&imgurl=https%3A%2F%2Fclipart-library.com%2F2023%2Flovepik-happy-man-png-image_401141286_wh1200.png&imgrefurl=https%3A%2F%2Fclipart-library.com%2Fclipart%2Fa-man-clipart-12.htm&docid=XVX5d6ymItErVM&tbnid=h-y_6bYduFw3RM&vet=12ahUKEwiY7dGi3O-IAxWrr1YBHfkCEDUQM3oECGUQAA..i&w=1002&h=1002&hcb=2&ved=2ahUKEwiY7dGi3O-IAxWrr1YBHfkCEDUQM3oECGUQAA',
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={globalStyles.userImg}
          />
        ) : (
          <ActivityIndicator style={globalStyles.userImg} />
        )}
      </TouchableOpacity>
      <View style={{alignItems: 'flex-start', marginVertical: 6}}>
        <TextComponent label={name} title />
        <RowComponent styles={{gap: 20, paddingVertical: 0}}>
          <RowComponent styles={[localStyle.card, {gap: 0}]}>
            {!!mutualFriend &&
              mutualUser?.map(
                item =>
                  item.userId !== userId && (
                    <FastImage
                      key={item.userId}
                      source={{
                        uri: item.avatar,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                      }}
                      style={localStyle.imgHint}
                    />
                  ),
              )}
          </RowComponent>
          {!!mutualFriend && (
            <TextComponent
              label={`${mutualFriend?.toString() ?? ''} ${t('mutual_friend')}`}
            />
          )}
        </RowComponent>
        <RowComponent styles={localStyle.card}>
          {!isShowBtn ? (
            <>
              <ButtonComponent
                label={sayYes}
                styles={{width: '40%'}}
                onPress={onPressYes}
                textStyle={{fontSize: 10}}
              />
              <ButtonComponent
                label={sayNo}
                styles={{
                  width: '40%',
                  backgroundColor: colors.icon,
                }}
                textStyle={{fontSize: 10}}
                onPress={onPressNo}
              />
            </>
          ) : (
            <ButtonComponent
              label={t('cancel')}
              styles={{
                backgroundColor: colors.icon,
                width: '80%',
                paddingVertical: 3,
              }}
              textStyle={{fontSize: 14}}
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

    borderRadius: 10,
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  },
  card: {
    marginVertical: 6,
  },
});
