import AsyncStorage from '@react-native-async-storage/async-storage';

export class UserInfo {
  static getName = (fullName: string) => {
    if (!fullName) {
      return '';
    }
    const name = fullName.split(' ');
    if (name.length === 1) {
      return name[0];
    }
    const splitName = name[0] + ' ' + name[1];
    return splitName;
  };
  static getTimePresent = (time: any) => {
    const date = new Date(time);
    const vietNameTime = date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    return vietNameTime.slice(0, 5).toString();
  };
  static getMessageWidth = (x: number) => {
    return Math.min(Math.max(x * 4, 20), 80);
  };
  static getYearOfbirth = (year: string) => {
    return year ? year.slice(0, 2) : '';
  };
  static numberToString = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  static getDay = (timestamp: string) => {
    const vietnamDate = new Date(timestamp).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    return vietnamDate;
  };
  static getIdUsers = (data: any[]) => {
    const users = data.map(item => item.userId);
    return users;
  };
  static getUserInfo = (userId: string, allUsers: any[]) => {
    let temp: any = '';
    if (allUsers) {
      temp = allUsers.filter(user => user.userId === userId)[0].userName;
    }
    return temp;
  };
  static compareObject = (obj: any, obj2: any) => {
    for (let key in obj) {
      if (obj[key] != obj2[key]) {
        return true;
      }
    }
    return false;
  };
  static getConversationInfo = async (getItem: any) => {
    const res = await getItem();
    if (res) {
      return JSON.parse(res);
    }
  };
  static getUserData = async () => {
    const [userData] = await Promise.all([AsyncStorage.getItem('userData')]);
    return userData ? JSON.parse(userData) : {};
  };
}
