import {View, Text, Image} from 'react-native';
import React from 'react';
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
    lastMessageColor,majoring
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
      <RowComponent
        styles={{
          justifyContent: 'flex-start',
          paddingHorizontal: 14,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <Image source={{uri: image}} style={[globalStyles.userImg]} />

        <View style={{flex: 1}}>
          <RowComponent>
            <TextComponent label={name} styles={{fontWeight: '500'}} />
            {!isBtnSend && <TextComponent label={`@${massv}`} />}
          </RowComponent>
          <TextComponent
            label={lastMessage}
            numberOfLine={1}
            color={lastMessageColor ?? appColors.grey}
            styles={{fontSize: 14, fontWeight: 'bold', marginLeft: 12}}
          />
        </View>
        {isBtnSend && <ButtonComponent label="Send" onPress={onPressSend} />}
      </RowComponent>
    </TouchableOpacity>
  );
};

export default CarUserChat;
