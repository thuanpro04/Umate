import {View, Text} from 'react-native';
import React from 'react';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import ButtonComponent from './ButtonComponent';
import { Google } from 'iconsax-react-native';
import { appColors } from '../../Theme/Colors/appColors';

const OrtherLoginComponent = () => {
  return (
    <View>
      <RowComponent
        styles={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
        <SpaceComponent
          isCrossBar
          bgCrossBar={appColors.background}
          width={94}
          height={1}
        />
        <TextComponent label="Or continue with" color={appColors.white} />
        <SpaceComponent
          isCrossBar
          bgCrossBar={appColors.background}
          width={94}
          height={1}
        />
      </RowComponent>
      <SpaceComponent height={30} />
      <ButtonComponent
          lable="Google"
          styles={{
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: appColors.white,
            height:62, 
            width:'100%',
            justifyContent:'center',
            
          }}
          iconLeft={<Google color={appColors.white}/>}
        />
    </View>
  );
};

export default OrtherLoginComponent;
