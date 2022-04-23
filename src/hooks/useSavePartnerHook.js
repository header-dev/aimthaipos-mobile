import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as PartnerContext } from '../context/PartnerContext'
import { navigate } from '../navigationRef';

export default () => {
    const { createPartner } = useContext(PartnerContext);

    const savePartner = (image,value) => {
        createPartner(image,value).then(() => {
            navigate('PartnerList')
        })
    }

    return [savePartner]
}