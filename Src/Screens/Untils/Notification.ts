import Snackbar from "react-native-snackbar"

export class Notification{
    static showSnackbar = (message:string, onPress:any)=>{
        Snackbar.show({
            text:message,
            duration:Snackbar.LENGTH_LONG,
            action:{
                text:'Close',
                onPress:onPress
            }
        })
    }
}