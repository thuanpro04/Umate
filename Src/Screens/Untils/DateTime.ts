import {appInfo} from '../../Theme/appInfo';
import {UserInfo} from './UserInfo';

export class DateTime {
  static getTime = (num: Date) => {
    const date = new Date(num);
    return `${UserInfo.numberToString(
      date.getHours(),
    )} : ${UserInfo.numberToString(date.getMinutes())}`;
  };

  static getDate = (num: Date) => {
    const date = new Date(num);
    return `${date.getDate()} - ${
      date.getMonth() + 1
    } -  ${date.getFullYear()}`;
  };
}
