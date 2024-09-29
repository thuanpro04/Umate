import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { appColors } from '../../Theme/Colors/appColors';
import ButtonComponent from './ButtonComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
interface Props {
  img: any;
  name: string;
}
const CarUserComponent = (props: Props) => {
  const {img, name} = props;
  return (
    <RowComponent styles={{flex: 1, justifyContent: 'flex-start'}}>
      <Image source={{uri: img}} style={localStyle.userImg} />
      <View style={{alignItems: 'flex-start', }}>
        <TextComponent label={name} title />
        <RowComponent styles={{gap: 20, paddingVertical: 0,}}>
          <RowComponent styles={{gap: 0}}>
            <Image source={{uri: img}} style={localStyle.imgHint} />
            <Image source={{uri: img}} style={localStyle.imgHint} />
          </RowComponent>
          <TextComponent label="7 ban chung" />
        </RowComponent>
        <RowComponent styles={{}}>
          <ButtonComponent
            lable="Add friend"
            styles={{backgroundColor: appColors.blue, width: '40%'}}
            textStyle={{color: appColors.white}}
          />
          <ButtonComponent
            lable="Delete"
            styles={{backgroundColor: appColors.grey2, width: '40%', paddingVertical:1}}
          />
        </RowComponent>
      </View>
    </RowComponent>
  );
};

export default CarUserComponent;
const localStyle = StyleSheet.create({
  userImg: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: appColors.grey2,
  },
  imgHint: {
    width: 25,
    height: 25,
    marginRight: -12,
    borderRadius: 100,
    backgroundColor: appColors.grey2,
  },
});
