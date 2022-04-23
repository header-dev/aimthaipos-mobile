import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as TableContext } from '../context/TableContext'
import { navigate, navigatePop } from '../navigationRef';

export default () => {
    const { deleteTable } = useContext(TableContext);

    const removeTable = (id) => {
        deleteTable(id)
        navigate('TableList')
    }

    return [removeTable]
}