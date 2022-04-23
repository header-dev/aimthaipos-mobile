import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as PromotionContext } from '../context/PromotionContext'
import { navigate } from '../navigationRef';

export default () => {
    const { createPromotion, deletePromotion, fetchPromotion } = useContext(PromotionContext);

    const savePromotion = (value) => {
        createPromotion(value).then(() => {
            navigate('PromotionList')
        })
    }


    return [savePromotion]
}