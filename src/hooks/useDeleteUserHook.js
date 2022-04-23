import { useContext } from 'react'
import { Context as UserContext } from '../context/UserContext'

export default () => {
    const { fetchUsers, deleteUser } = useContext(UserContext);

    const deleteUserByID = (id) => {
        deleteUser(id)
        fetchUsers()
    }

    return [deleteUserByID]
}