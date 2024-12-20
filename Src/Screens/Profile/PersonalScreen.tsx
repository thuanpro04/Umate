import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {profileStyles} from './profileStyles';

const PersonalScreen = () => {
  const auth = useSelector(authSelector);
  const [isDetail, setDetail] = useState(false);
  const bgColor = useSharedValue('#009688');
  const userInfo = {
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    majoring: 'Công nghệ thông tin',
    email: 'phanminhthuan240304@gmail.com',
    link: 'https://www.facebook.com/profile.php?id=100072424793021',
    address: 'Tây Ninh ',
    bio: 'Loving life, learning every day!',
    stats: {
      friends: 120,
      shares: 45,
      likes: 230,
    },
    recentPosts: [
      {
        id: '1',
        content: 'Had an amazing day!',
        image: require('../../assets/images/image1.png'),
      },
      {
        id: '2',
        content: 'Exploring new places.',
        image: require('../../assets/images/image2.png'),
      },
      {
        id: '3',
        content: 'React Native is awesome!',
        image: require('../../assets/images/image3.png'),
      },
    ],
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isDetail ? '#00968891' : '#009688', {
        duration: 900,
      }),
    };
  });

  const toggleDetail = () => {
    setDetail(!isDetail);
    bgColor.value = isDetail ? '#009688' : '#00968891';
  };
  const renderPost = ({item}: any) => (
    <View style={profileStyles.postContainer}>
      <Image source={item.image} style={profileStyles.postImage} />
      <Text style={profileStyles.postContent}>{item.content}</Text>
    </View>
  );
  const dataUser = [
    {
      key: 'majoring',
      content: (
        <TextComponent
          styles={profileStyles.majoring}
          label={userInfo.majoring}
        />
      ),
      icon: <Icon name="school" size={20} color={'#1b4f72'} />,
    },
    {
      key: 'link',
      content: (
        <TextComponent
          styles={profileStyles.link}
          label={userInfo.link.slice(0, 24) + '...'}
        />
      ),
      icon: <Icon name="link" size={20} color={appColors.blue} />,
    },
    {
      key: 'email',
      content: (
        <TextComponent label={userInfo.email} styles={profileStyles.email} />
      ),
      icon: (
        <Icon name="email" size={20} color={appColors.linearFocus59_pink} />
      ),
    },
    {
      key: 'majoring',
      content: (
        <TextComponent
          styles={profileStyles.majoring}
          label={userInfo.address}
        />
      ),
      icon: <Icon name="location-on" size={20} color={appColors.green2} />,
    },
  ];

  const renderHeader = () => {
    return (
      <Animated.View style={[profileStyles.header, animatedStyle]}>
        {isDetail ? (
          <View style={profileStyles.profileContainer}>
            <TextComponent styles={profileStyles.name} label={userInfo.name} />
            <Animated.View style={[{alignItems: 'flex-start'}]}>
              {dataUser.map((item, index) => {
                return (
                  <RowComponent key={index}>
                    {item.icon}
                    {item.content}
                  </RowComponent>
                );
              })}
            </Animated.View>
            <TextComponent label={userInfo.bio} styles={profileStyles.bio} />
            <SpaceComponent height={10} />
            <ButtonComponent
              onPress={toggleDetail}
              type="action"
              label="Cancel"
              textStyle={[
                profileStyles.btn_Detail,
                {backgroundColor: '#009688'},
              ]}
              styles={{}}
            />
          </View>
        ) : (
          <View style={profileStyles.profileContainer}>
            <Image source={{uri: auth.avatar}} style={profileStyles.avatar} />
            <TextComponent styles={profileStyles.name} label={userInfo.name} />
            <TextComponent
              styles={profileStyles.majoring}
              label={userInfo.majoring}
            />
            <TextComponent label={userInfo.bio} styles={profileStyles.bio} />
            <SpaceComponent height={10} />
            <ButtonComponent
              onPress={toggleDetail}
              type="action"
              label="Detail"
              textStyle={[
                profileStyles.btn_Detail,
                {backgroundColor: '#00961047'},
              ]}
            />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <View style={profileStyles.statsContainer}>
        {Object.entries(userInfo.stats).map(([key, value]) => (
          <View key={key} style={profileStyles.stat}>
            <Text style={profileStyles.statNumber}>{value}</Text>
            <Text style={profileStyles.statLabel}>{key.toUpperCase()}</Text>
          </View>
        ))}
      </View>

      {/* Recent Posts */}
      <Text style={profileStyles.sectionTitle}>Shared recently</Text>
      <FlatList
        data={userInfo.recentPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={profileStyles.postList}
      />
    </SafeAreaView>
  );
};

export default PersonalScreen;
