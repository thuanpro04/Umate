export class Validate{
    static Email(mail:any){
        return mail?.endsWith('@student.tdmu.edu.vn');
    }
    static Email_Admin(mail:any){
        return mail?.endsWith('@tdmu.edu.vn')
    }
}