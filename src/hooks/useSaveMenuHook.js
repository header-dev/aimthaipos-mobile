import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as MenuContext } from '../context/MenuContext'
import { navigate } from '../navigationRef';

export default () => {
    const { createMenu } = useContext(MenuContext);

    const saveMenu = (image, value) => {
        createMenu(image, value)
    }

    return [saveMenu]
}