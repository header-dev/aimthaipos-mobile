import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as ShopContext } from '../context/ShopContext'

export default () => {
    const { state: { isRejected },fetchShop, createShop } = useContext(ShopContext);

    const saveShopInfo = (value) => {
        createShop(value)
        fetchShop()
    }

    return [saveShopInfo]
}