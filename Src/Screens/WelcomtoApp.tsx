import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { Digital, Rocket } from '../assets/svgs/indexSvg';
import { appColors } from '../Theme/Colors/appColors';
import { RowComponent, TextComponent } from './Components';
const WelcomtoApp = () => {
  return (
    <SafeAreaView style={localStyles.conatiner}>
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
    </SafeAreaView>
  );
};

export default WelcomtoApp;
const localStyles = StyleSheet.create({
  conatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0096FF',
    flex:1
  },
  text: {
    color: appColors.white,
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight:'regular'
  },
});
