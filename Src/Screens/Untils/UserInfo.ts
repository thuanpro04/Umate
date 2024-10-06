export class UserInfo {
  static getName = (fullName: string) => {
    const name = fullName.split(' ');
    const splitName = name[0] + ' ' + name[1];
    return splitName;
  };
}
