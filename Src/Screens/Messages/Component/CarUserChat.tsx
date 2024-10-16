import {View, Text, Image} from 'react-native';
import React from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {globalStyles} from '../../../Styles/globalStyle';
import { TouchableOpacity } from 'react-native';
interface Props {
  name: string;
  massv: string;
  image: string;
  onPress?: () => void;
}
const CarUserChat = (props: Props) => {
  const {name, massv, image,onPress} = props;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} >
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
          <TextComponent label={name} />
          <TextComponent label={`@${massv}`} />
        </RowComponent>
        <TextComponent label="Hello, My name is Thuận  " />
      </View>
    </RowComponent>
    </TouchableOpacity>
  );
};

export default CarUserChat;
