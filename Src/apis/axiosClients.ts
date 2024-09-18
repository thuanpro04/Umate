import axios from 'axios';
import {appInfo} from '../Theme/appInfo';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
  baseURL: appInfo.URL_RENDER,
  paramsSerializer: params => queryString.stringify(params),
});
const getAccessToken = async () => {
  const res = await AsyncStorage.getItem('auth');
  return res ? JSON.parse(res).accesstoken : '';
};

axiosClient.interceptors.request.use(async (config: any) => {
  const accesstoken = await getAccessToken();
  config.headers = {
    Authorization: accesstoken ? `Beareer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers,
  };
  config.data;
  return config;
});
axiosClient.interceptors.response.use(
  res => {
    if (res.data && res.status === 200) {
      return res.data;
    }
    throw new Error(`Unexpected response format: ${JSON.stringify(res)}`);
  },
  error => {
    console.log(`Error api: ${JSON.stringify(error)}`);
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${error.response.statusText}`,
      );
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  },
);

export default axiosClient;