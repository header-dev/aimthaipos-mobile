import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as ProteinContext } from '../context/ProteinContext'
import { navigate } from '../navigationRef';

export default () => {
    const { createProtein } = useContext(ProteinContext);

    const saveProtein = (value) => {
        createProtein(value).then(() => {
            navigate('ProteinList')
        })
    }

    return [saveProtein]
}