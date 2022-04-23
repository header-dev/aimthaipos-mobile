import { Toast } from 'native-base';
import { useContext, useEffect } from 'react'
import { Context as SaleContext } from '../../context/SaleContext'
import { Context as AuthContext } from '../../context/AuthContext'
import { navigate } from './../../navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default () => {
    const { createOrder } = useContext(SaleContext);
    const { state: { user }, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser()
    }, [])

    const saveNewOrder = (value) => {
        createOrder({
            id: null,
            userId: user.id,
            orderType: value,
            customerId: null
        }).then(async (result) => {
            const { id } = result.data
            if (value === 'dine-in') {
                navigate("SelectTable", {
                    _id: id
                })
            } else if (value === 'take-away') {
                await AsyncStorage.setItem('currentOrder', JSON.stringify(result.data))
                navigate("rootSaleFlow");
            } else if (value === 'partner') {
                await AsyncStorage.setItem('currentOrder', JSON.stringify(result.data))
                navigate('SelectPartner', {
                    _id: id
                })
            }
             else if (value === 'delivery') {
                await AsyncStorage.setItem('currentOrder', JSON.stringify(result.data))
                navigate('SelectCustomer', {
                    _id: id
                })
            }
        }).catch(err => {
            Toast.show({
                text: err.message,
                buttonText: "Okay",
                type: "warning",
            });
        })
    }

    return [saveNewOrder]
}