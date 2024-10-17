export class UserInfo {
  static getName = (fullName: string) => {
    const name = fullName.split(' ');
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
    return Math.min(Math.max(x * 5, 40), 80);
  };
}
