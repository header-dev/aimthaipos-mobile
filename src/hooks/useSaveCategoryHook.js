import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as CategoryContext } from '../context/CategoryContext'
import { navigate } from '../navigationRef';

export default () => {
    const { state: {  },createCategory } = useContext(CategoryContext);

    const saveCategory = (value) => {
        createCategory(value).then(() => {
            navigate('CategoryList')
        })
    }
    
    return [saveCategory]
}