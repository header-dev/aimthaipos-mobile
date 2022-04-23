import { Toast } from 'native-base';
import { useContext, useEffect } from 'react'
import { Context as SaleContext } from '../../context/SaleContext'
import { Context as AuthContext } from '../../context/AuthContext'
import { navigate, navigateReplace } from './../../navigationRef';

export default () => {
    const { createOrder, saveInitCashDrawer } = useContext(SaleContext);
    const { state: { user }, getUser } = useContext(AuthContext);

    useEffect(() => {
        // getUser()
        return () => {
            
        }
    }, [])

    const initialCashDrawer = async (value) => {
        value.userId = user.id
        await saveInitCashDrawer(value)
    }

    return [initialCashDrawer]
}