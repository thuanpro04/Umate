import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {globalStyles} from '../../../Styles/globalStyle';
import {UserAdd} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
interface Props {
  userName: string;
  authori: string;
  url: string;
  addFriend?: Boolean;
  onPress: () => void;
  onPressAdd: () => void;
  bgColor?: string;
}
const CarUserComponent = (props: Props) => {
  const {userName, authori, url, addFriend, onPress, onPressAdd, bgColor} =
    props;


  return (
    <RowComponent
      styles={[
        styles.card,
        {backgroundColor: bgColor ? bgColor : 'transparent'},
      ]}>
      <RowComponent onPress={onPress} styles={{marginHorizontal: 8}}>
        <Image source={{uri: props.url}} style={globalStyles.userImg} />
        <View style={styles.main}>
          <TextComponent label={userName} styles={globalStyles.label} />
          <SpaceComponent height={6} />
          <TextComponent
            label={authori }
            styles={globalStyles.actionText}
          />
        </View>
        {addFriend && (
          <UserAdd
            size={appInfo.sizeIconBold}
            color="black"
            onPress={onPressAdd}
          />
        )}
      </RowComponent>
    </RowComponent>
  );
};

export default CarUserComponent;

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
  },
  main: {
    flex: 1,
  },
});
