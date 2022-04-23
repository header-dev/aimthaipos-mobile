import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as CategoryContext } from '../context/CategoryContext'
import { navigate } from '../navigationRef';

export default () => {
    const { fetchCategory,
        deleteCategory } = useContext(CategoryContext);

    const removeCategory = (id) => {
        deleteCategory(id)
        fetchCategory()
    }

    return [removeCategory]
}