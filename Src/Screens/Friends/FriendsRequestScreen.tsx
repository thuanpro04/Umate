import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {CarUserComponent} from '../Components';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';

const FriendsRequestScreen = () => {
  const [showTabBar, setshowTabBar] = useState(false);
  const user = useSelector(authSelector);
  const handleScrool = (event: any) => {
    const currenOffset = event.nativeEvent.contentOffset.y;
    currenOffset > 50 ? setshowTabBar(false) : setshowTabBar(true);
  };
  return (
    <ScrollView
      style={{
        backgroundColor: appColors.background,
        flex: 1,
        paddingHorizontal: 10,
      }}
      onScroll={handleScrool}
      scrollEventThrottle={16}>
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />
      <CarUserComponent img={user.avatar} name={user.name} />


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo chiếm toàn bộ không gian
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendsRequestScreen;
