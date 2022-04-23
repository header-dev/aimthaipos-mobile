import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as MenuContext } from '../context/MenuContext'
import { navigate } from '../navigationRef';

export default () => {
    const { deleteMenu, fetchMenu } = useContext(MenuContext);

    const removeMenu = (id) => {
        deleteMenu(id)
        fetchMenu()
    }

    return [removeMenu]
}