import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as ProteinContext } from '../context/ProteinContext'
import { navigate } from '../navigationRef';

export default () => {
    const { fetchProtein, deleteProtein } = useContext(ProteinContext);

    const removeProtein = (id) => {
        deleteProtein(id)
        fetchProtein()
    }

    return [removeProtein]
}