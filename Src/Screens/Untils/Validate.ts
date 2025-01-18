export class Validate {
  static Email(mail: any) {
    return mail?.endsWith('@student.tdmu.edu.vn');
  }
  static Email_Admin(mail: any) {
    return mail?.endsWith('@tdmu.edu.vn');
  }
  static UserName(username: string) {
    let nameParts = username
      .trim()
      .split(' ')
      .filter(part => part); // Bỏ khoảng trắng thừa và lọc ra các chuỗi rỗng

    if (nameParts.length === 1) {
      return (
        nameParts[0].slice(0, 1).toLocaleUpperCase() +
        nameParts[0].slice(1).toLocaleLowerCase()
      );
    }

    let capitalizedParts = nameParts.map(part => {
      return part[0].toLocaleUpperCase() + part.slice(1).toLocaleLowerCase();
    });
    return capitalizedParts.join(' ');
  }
  static groupValidation(data: any) {
    const mess: string[] = [];
    Object.keys(data).forEach(key => {
      if (key !== 'description' && key !== 'authorId' && key !== 'avatar' && key !=='leader') {
        !data[`${key}`] && mess.push(`${key} is required !!!`);
      }
    });
    if (data.invitedUsers.length < 2) {
      mess.push('invitedUsers must be greater than two !!!');
    }
    return mess
  }
  static eventValidation(data: any) {
    const mess: string[] = [];
    const persent = new Date();
    Object.keys(data).forEach(key => {
      if (key !== 'users' && key !== 'photoUrl') {
        !data[`${key}`] && mess.push(`${key} is required !!!`);
      }
    });
    if (data.startAt && data.endAt && data.endAt <= data.startAt) {
      mess.push('endAt must be greater than startAt !!!');
    }
    if (data.endAt && new Date(data.endAt) < persent) {
      mess.push('endAt must be a future date !!!');
    }

    return mess;
  }
   static validateGroupName(groupName: any) {
    if (!groupName || groupName.length > 100) {
      throw new Error('Tên nhóm không hợp lệ');
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(groupName)) {
      throw new Error('Tên nhóm chỉ được chứa chữ và số');
    }
    return true;
  }
}
