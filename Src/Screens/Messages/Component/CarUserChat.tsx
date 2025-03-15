import {View, Text, Image} from 'react-native';
import React, {ReactNode} from 'react';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import {globalStyles} from '../../../Styles/globalStyle';
import {TouchableOpacity} from 'react-native';
import {appColors} from '../../../Theme/Colors/appColors';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {Check, Pin, PinIcon} from 'lucide-react-native';
import {appInfo} from '../../../Theme/appInfo';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
interface Props {
  name: string;
  massv?: string;
  image: string;
  onPress?: () => void;
  lastMessage: string;
  isBtnSend?: boolean;
  onPressSend?: () => void;
  lastMessageColor?: string;
  majoring?: string;
  iconCheck?: ReactNode;
  isGhim?: boolean;
}
const CarUserChat = (props: Props) => {
  const {
    name,
    massv,
    image,
    onPress,
    lastMessage,
    isBtnSend,
    onPressSend,
    lastMessageColor,
    majoring,
    iconCheck,
    isGhim,
  } = props;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={{
        borderRadius: 12,
        marginHorizontal: 12,
        marginVertical: 8,
        borderWidth: 0.3,
        borderColor: colors.border,
      }}>
      {isGhim && (
        <Entypo
          name="pin"
          size={appInfo.sizeIcon}
          color={'red'}
          style={{position: 'absolute', right: '0%', top: '-12%'}}
        />
      )}
      <RowComponent
        styles={{
          justifyContent: 'flex-start',
          paddingHorizontal: 14,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <FastImage
          source={{
            uri: image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={[globalStyles.userImg]}
        />

        <View style={{flex: 1}}>
          <RowComponent>
            <TextComponent label={name} styles={{fontWeight: '500'}} />
            {!isBtnSend && !iconCheck && <TextComponent label={`@${massv}`} />}
          </RowComponent>
          <TextComponent
            label={lastMessage}
            numberOfLine={1}
            color={lastMessageColor ?? appColors.grey}
            styles={{fontSize: 14, fontWeight: 'bold', marginLeft: 12}}
          />
        </View>
        {isBtnSend && !iconCheck && (
          <ButtonComponent label="Send" onPress={onPressSend} />
        )}
        {!isBtnSend && iconCheck && iconCheck}
      </RowComponent>
    </TouchableOpacity>
  );
};

export default CarUserChat;
