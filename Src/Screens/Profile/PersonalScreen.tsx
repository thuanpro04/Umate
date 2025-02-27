import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
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
import {Android, ArrowLeft, ArrowLeft2, UserAdd} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {userServices} from '../Services/userService';
import LoadingModal from '../Modal/LoadingModal';
import {UserInfo} from '../Untils/UserInfo';
import {globalStyles} from '../../Styles/globalStyle';
import {Linking} from 'react-native';
import ZoomImageComponent from '../Messages/Component/ZoomImageComponent';
import {friendServices} from '../Services/friendService.';
import {Notification} from '../Untils/Notification';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';

const PersonalScreen = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const [userInfo, setUserInfo] = useState<any>(null);
  const {userId} = useRoute().params as {userId: string};
  const [isLoading, setIsLoading] = useState(false);
  const [isDetail, setDetail] = useState(false);
  const bgColor = useSharedValue('#009688');
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const infoUser = {
    stats: {
      friends: userInfo && userInfo.friends ? userInfo.friends.length : 0,
      shares:
        userInfo && userInfo.eventShares ? userInfo.eventShares.length : 0,
      likes: 0,
    },
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isDetail ? colors.bgProfile : colors.bgProfile2,
        {
          duration: 900,
        },
      ),
    };
  });
  useFocusEffect(
    useCallback(() => {
      handleGetUserInfoById();
    }, [userId]),
  );
  const handleGetUserInfoById = async () => {
    try {
      setIsLoading(true);
      const res = await userServices.getUserInfo(userId);
      if (res && res.data) {
        setUserInfo(res.data);

        // console.log('userInfo', userInfo);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const toggleDetail = () => {
    setDetail(!isDetail);
    bgColor.value = isDetail ? '#009688' : '#009688';
  };
  const renderPost = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailEvent', {href: item.href})}
        style={[profileStyles.postContainer, {backgroundColor: colors.card}]}
        key={item._id}>
        <Image source={{uri: item.urlImage}} style={profileStyles.postImage} />
        <TextComponent
          label={item.content}
          styles={profileStyles.postContent}
        />
      </TouchableOpacity>
    );
  };

  const handleAddFriend = async (friendUserId: string) => {
    try {
      const res = await friendServices.handleFriendActionAdd_Cancel(
        friendUserId,
        'add',
        auth.userId,
      );
    } catch (error) {
      console.log('handleFriendAction', error);
    }
  };

  const renderHeader = () => {
    const dataUser = [
      {
        key: 'majoring',
        content: (
          <TextComponent
            styles={profileStyles.majoring}
            label={userInfo?.majoring ?? 'Chuyên ngành'}
          />
        ),
        icon: <Icon name="school" size={20} color={'#1b4f72'} />,
      },
      {
        key: 'link',
        content: (
          <ButtonComponent
            type="action"
            onPress={() => {
              if (userInfo?.link) {
                Linking.openURL(userInfo.link).catch(err =>
                  Alert.alert('Lỗi', 'Không thể mở liên kết'),
                );
              }
            }}>
            <TextComponent
              styles={profileStyles.link}
              label={
                userInfo?.link ? userInfo?.link.slice(0, 24) + '...' : 'Link'
              }
            />
          </ButtonComponent>
        ),
        icon: <Icon name="link" size={20} color={appColors.blue} />,
      },
      {
        key: 'email',
        content: (
          <TextComponent label={userInfo?.email} styles={profileStyles.email} />
        ),
        icon: <Icon name="email" size={20} color={appColors.pink} />,
      },
      {
        key: 'majoring',
        content: (
          <TextComponent
            styles={profileStyles.majoring}
            label={userInfo?.address ? userInfo?.address : 'Địa chỉ'}
          />
        ),
        icon: <Icon name="location-on" size={20} color={appColors.green2} />,
      },
    ];
    return (
      <Animated.View style={[profileStyles.header, animatedStyle]}>
        <ArrowLeft
          onPress={() => navigation.goBack()}
          size={appInfo.sizeIconBold}
          color={appColors.white}
          style={{position: 'absolute', left: '5%', top: '5%'}}
        />
        {!friendData.friends.includes(userId) && userId !== auth.userId && (
          <UserAdd
            onPress={() => handleAddFriend(userId)}
            size={appInfo.sizeIconBold}
            color={colors.icon}
            style={{position: 'absolute', right: '5%', top: '5%'}}
          />
        )}
        {userInfo ? (
          isDetail ? (
            <View style={profileStyles.profileContainer}>
              <TextComponent
                styles={profileStyles.name}
                label={UserInfo.getName(userInfo.name)}
              />
              <SpaceComponent height={8} />
              <Animated.View style={[{alignItems: 'flex-start'}]}>
                {dataUser.map((item, index) => {
                  return (
                    <RowComponent key={index} styles={{marginBottom: 12}}>
                      {item.icon}
                      {item.content}
                    </RowComponent>
                  );
                })}
                <RowComponent>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/18438/18438783.png',
                    }}
                    style={globalStyles.iconImage}
                  />
                  <TextComponent
                    label={userInfo.bio ?? 'bio'}
                    styles={profileStyles.bio}
                    color={colors.text2}
                  />
                </RowComponent>
              </Animated.View>
              <SpaceComponent height={10} />
              <ButtonComponent
                onPress={toggleDetail}
                type="action"
                label="Cancel"
                textStyle={[profileStyles.btn_Detail]}
                styles={{}}
              />
            </View>
          ) : (
            <View style={profileStyles.profileContainer}>
              <RowComponent>
                <ZoomImageComponent
                  url={
                    userInfo.avatar
                      ? userInfo.avatar
                      : 'https://via.placeholder.com/150'
                  }
                  styles={profileStyles.avatar}
                />
                {userInfo.online && (
                  <View
                    style={{
                      backgroundColor: 'green',
                      padding: 6,
                      borderRadius: 50,
                      position: 'absolute',
                      top: 0,
                      right: 20,
                    }}
                  />
                )}
              </RowComponent>
              <TextComponent
                styles={profileStyles.name}
                label={UserInfo.getName(userInfo.name)}
              />
              <SpaceComponent height={6} />
              <TextComponent
                styles={profileStyles.majoring}
                label={userInfo.majoring ?? 'Chuyên ngành'}
              />
              <SpaceComponent height={8} />
              <RowComponent>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/18438/18438783.png',
                  }}
                  style={globalStyles.iconImage}
                />
                <TextComponent
                  label={userInfo.bio ?? 'bio'}
                  styles={profileStyles.bio}
                  color={colors.text2}
                />
              </RowComponent>
              <SpaceComponent height={10} />
              <ButtonComponent
                onPress={toggleDetail}
                type="action"
                label="Detail"
                textStyle={[profileStyles.btn_Detail]}
              />
            </View>
          )
        ) : (
          <></>
        )}
      </Animated.View>
    );
  };

  return !isLoading ? (
    <SafeAreaView
      style={[profileStyles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle="dark-content" />

      {userInfo ? (
        <>
          {renderHeader()}
          <View style={[profileStyles.statsContainer, ,]}>
            {Object.entries(infoUser.stats).map(([key, value]) => (
              <View
                key={key}
                style={[
                  profileStyles.stat,
                  {
                    backgroundColor:
                      theme === 'light' ? colors.background : colors.border,
                    shadowColor: colors.shadow,
                  },
                ]}>
                <Text style={profileStyles.statNumber}>{value}</Text>
                <Text style={profileStyles.statLabel}>{key.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          <TextComponent
            label="Shared recently"
            styles={profileStyles.sectionTitle}
          />
          {userInfo.eventShares && (
            <FlatList
              inverted
              data={userInfo.eventShares}
              renderItem={renderPost}
              keyExtractor={item => item._id}
              contentContainerStyle={profileStyles.postList}
            />
          )}
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextComponent label="Tài khoản không tồn tại." />
        </View>
      )}
    </SafeAreaView>
  ) : (
    <LoadingModal visible={isLoading} />
  );
};

export default PersonalScreen;
