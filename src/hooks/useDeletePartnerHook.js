import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as PartnerContext } from '../context/PartnerContext'
import { navigate } from '../navigationRef';

export default () => {
    const { deletePartner, fetchPartner } = useContext(PartnerContext);

    const removePartner = (value) => {
        deletePartner(value)
        fetchPartner()
    }

    return [removePartner]
}