import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CarUserComponent, ContainerComponent} from '../../Components';
import CarUserChat from './CarUserChat';
import {Users} from '../../Services/friendService.';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import {UserInfo} from '../../Untils/UserInfo';

const ListUsersChat = ({navigation}: any) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const getUsers = async () => {
    const url = `/get-all?currentUserID=${auth.userID}`;
    setIsLoading(true)
    try {
      const res = await Users.getUsers(url);
      setUsers(res);
      setIsLoading(false)
    } catch (error) {
      console.log('ListChat', error);
      setIsLoading(false)
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <ContainerComponent isScroll styles={{paddingVertical: 0}}>
      {users &&
        users.map((item: any, index) => (
          <React.Fragment key={index}>
            <CarUserChat
              key={index}
              name={UserInfo.getName(item.name)}
              massv="22"
              image={item.avatar}
              onPress={() =>
                navigation.navigate('Chat', {
                  currentUserID: auth.userID,
                  friendID: item.userID,
                })
                
              }
            />
            <CarUserChat
              key={index}
              name={UserInfo.getName(item.name)}
              massv="22"
              image={item.avatar}
            />
            <CarUserChat
              key={index}
              name={UserInfo.getName(item.name)}
              massv="22"
              image={item.avatar}
            />
          </React.Fragment>
        ))}
    </ContainerComponent>
  );
};

export default ListUsersChat;

const styles = StyleSheet.create({});
