import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';

const AppRouters = () => {
  const {getItem, setItem} = useAsyncStorage('auth');
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    handleCheckLogin();
    console.log(auth);
    
  }, []);
  const handleCheckLogin = async () => {
    const res = await getItem();
    console.log('res app routers', res);
    res && dispatch(addAuth(JSON.parse(res)));
  };
  return auth.accesstoken ? <MainNavigator /> : <AuthNavigator />;
};

export default AppRouters;
