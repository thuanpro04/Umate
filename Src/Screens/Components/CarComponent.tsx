import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import ContainerComponent from './ContainerComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import {Heart, Message, MessageQuestion, Share} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';
import ButtonComponent from './ButtonComponent';
import ActionIconComponent from './ActionIconComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
interface Props {}
const CarComponent = () => {
  const [isBackground, setBackground] = useState(false);
  return (
    <View style={{paddingHorizontal: 15, backgroundColor: '#ffff'}}>
      <RowComponent styles={{}}>
        <RowComponent>
          <Image
            source={require('../../assets/images/logo_Tdmu.jpg')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: '#3D9ADC',
              resizeMode: 'cover',
            }}
          />
          <TextComponent label="Đại học Thủ Dầu Một" />
        </RowComponent>
        <TextComponent label="7h" />
      </RowComponent>
      <View>
        <TextComponent
          label="Lễ trao bằng tốt nghiệp cho 4046 tân cử nhân, kỹ sư, kiến trúc sư lần I năm 2024"
          size={17}
        />
        <SpaceComponent height={10} />
        <Image
          source={require('../../assets/images/tdmu.jpg')}
          style={{width: 358, height: 232, borderRadius: 10}}
        />
      </View>
      <RowComponent styles={{justifyContent: 'space-around'}}>
        <ActionIconComponent
          icon={
            isBackground ? (
              <AntDesign name="heart" size={22} color={appColors.red} />
            ) : (
              <AntDesign name="hearto" size={22} color={appColors.grey} />
            )
          }
          onPress={() => setBackground(!isBackground)}
          quantity={10}
        />
        <ActionIconComponent icon={<MessageQuestion color={appColors.grey} size={22}/>} title='Comment'/>
        <ActionIconComponent icon={<Message size={22} color={appColors.grey}/>} title='Send'/>
      </RowComponent>
    </View>
  );
};

export default CarComponent;
