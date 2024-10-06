import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {ContainerComponent, RowComponent, TextComponent} from './Components';
import {appColors} from '../Theme/Colors/appColors';
import {Digital, Rocket} from '../assets/svgs/indexSvg';
import {appInfo} from '../Theme/appInfo';
const WelcomtoApp = () => {
  return (
    <ContainerComponent styles={localStyles.conatiner}>
      <View>
        <Digital height={145} width={145} />
        <RowComponent
          styles={{gap: 0, marginTop: -25, justifyContent: 'flex-end'}}>
          <TextComponent label="UMate" title styles={localStyles.text} />
          <View style={{justifyContent:'center', alignItems:'center',flex:0}}>
            <Rocket height={50} width={50} />
          </View>
        </RowComponent>
        <ActivityIndicator />
      </View>
    </ContainerComponent>
  );
};

export default WelcomtoApp;
const localStyles = StyleSheet.create({
  conatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0096FF',
  },
  text: {
    color: appColors.white,
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight:'regular'
  },
});
