import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
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
  static getTime = (timestamp: string) => {
    const vietnamTime = new Date(timestamp).toLocaleTimeString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
    });
    return vietnamTime;
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
  static encryptText = (text: string) => {
    const secretKey: any = process.env.SECRETKEY ?? 'hahaha';
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };
  static decryptText = (encryptedText: string) => {
    const secretKey: any = process.env.SECRETKEY ?? 'hahaha';
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  static getContent = (text: string) => {
    let content = '';
    try {
      const decodedString = atob(text);
      content = JSON.parse(decodedString).content;
    } catch (error) {
      console.error('Error decoding Base64 string:', error);
    }
    return content;
  };
  static getUserData = async () => {
    const [userData] = await Promise.all([AsyncStorage.getItem('userData')]);
    return userData ? JSON.parse(userData) : {};
  };
  static setUserData = async (data: any) => {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    console.log('Set user data successfully');
  };
  static getAvatar() {
    const temp =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1newdbzQNEDeE0F8ky3T40yrgWDpsNzX4Rw&s';
    return temp;
  }
  static getDataGroup(groupInfo: any, auth: any) {
    const member = groupInfo.invitedUsers.map((item: any) => ({
      ...item.data,
      userName: item.name,
    }));

    const currentUser = {
      userId: auth.userId,
      userName: auth.name,
      avatar: auth.avatar,
      majoring: auth.majoring,
    };
    const dataGroup = {
      authorId: groupInfo.authorId,
      groupName: groupInfo.groupName,
      description: groupInfo.description,
      avatar:
        groupInfo.avatar &&
        typeof groupInfo.avatar === 'object' &&
        groupInfo.avatar.name
          ? groupInfo.avatar.name
          : groupInfo.avatar,
      invitedUsers: [...member, currentUser],
      leader: {
        userId: groupInfo.leader.data
          ? groupInfo.leader.data.userId
          : auth.userId,
      },
      deputyLeader: {
        userId: groupInfo.deputyLeader.data.userId,
      },
      type: 'group',
    };

    return dataGroup;
  }
}
