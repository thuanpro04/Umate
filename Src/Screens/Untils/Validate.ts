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
}
