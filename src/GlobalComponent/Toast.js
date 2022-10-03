import { ToastAndroid } from 'react-native'
import SimpleToast from 'react-native-simple-toast'
import Toast from 'react-native-simple-toast'
export const showToast = (msg) => {
    return(
        Toast.showWithGravity(msg,SimpleToast.SHORT,SimpleToast.CENTER)
    )
}