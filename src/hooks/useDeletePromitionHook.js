import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as PromotionContext } from '../context/PromotionContext'
import { navigate } from '../navigationRef';

export default () => {
    const { deletePromotion, fetchPromotion } = useContext(PromotionContext);

    const removePromotion = (id) => {
        deletePromotion(id)
        fetchPromotion()
    }

    return [removePromotion]
}