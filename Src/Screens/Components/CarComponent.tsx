import {Message, MessageQuestion} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import ActionIconComponent from './ActionIconComponent';
import {RowComponent, SpaceComponent, TextComponent} from './index';

interface Props {}
const CarComponent = () => {
  const [isBackground, setBackground] = useState(false);
  return (
    <View style={localStyles.container}>
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
          size={appInfo.size.WIDTH * 0.04}
        />
        <SpaceComponent height={10} />
        <Image
          source={require('../../assets/images/tdmu.jpg')}
          style={localStyles.avatar}
        />
      </View>
      <RowComponent styles={{justifyContent: 'space-around'}}>
        <ActionIconComponent
          styles={localStyles.IconStyle}
          icon={
            isBackground ? (
              <AntDesign
                name="heart"
                size={appInfo.sizeIcon}
                color={appColors.red}
              />
            ) : (
              <AntDesign
                name="hearto"
                size={appInfo.sizeIcon}
                color={appColors.grey}
              />
            )
          }
          onPress={() => setBackground(!isBackground)}
          quantity={10}
        />
        <ActionIconComponent
          icon={
            <MessageQuestion color={appColors.grey} size={appInfo.sizeIcon} />
          }
          title="Comment"
          styles={localStyles.IconStyle}
        />
        <ActionIconComponent
          icon={<Message size={appInfo.sizeIcon} color={appColors.grey} />}
          title="Send"
          styles={localStyles.IconStyle}
        />
      </RowComponent>
    </View>
  );
};

export default CarComponent;
const localStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
  },
  IconStyle: {
    backgroundColor: appColors.bgIcon,
    paddingHorizontal: 10,
    marginVertical: 12,
  },
  avatar: {
    width: appInfo.size.WIDTH * 0.92,
    height: appInfo.size.HEIGHT * 0.3,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
