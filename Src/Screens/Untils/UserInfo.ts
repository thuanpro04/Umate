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
    return Math.min(Math.max(x * 5, 20), 80);
  };
  static getYearOfbirth = (year: string) => {
    return year ? year.slice(0, 2) : '';
  };
  static numberToString = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
  };
}
