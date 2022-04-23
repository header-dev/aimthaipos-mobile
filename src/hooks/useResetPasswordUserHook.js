import { useContext } from 'react'
import { Context as UserContext } from '../context/UserContext'
import { navigate } from '../navigationRef';
import { Toast } from 'native-base'

export default () => {
    const { state: { resetMessage,
        isResetPasswordRejected }, resetPassword } = useContext(UserContext);
    const resetUserPassword = (id, value) => {
        resetPassword(id, value)
        if (isResetPasswordRejected) {
            Toast.show({
                text: "Some thing wrong reset password.",
                buttonText: "Okay"
            })
        }else{
            navigate("UserList")
        }

    }
    return [resetUserPassword]
}