import { Toast } from 'native-base';
import { useContext, useEffect } from 'react'
import { Context as TableContext } from '../context/TableContext'
import { Context as AuthContext } from '../context/AuthContext'
import { navigate } from '../navigationRef';


export default () => {
    const { createTable } = useContext(TableContext);
    const { state: { user }, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser()
        return () => {
            
        }
    }, [])

    const saveTable = (value) => {
        value.userId = user.id
        createTable(value).then(()=>{
            navigate("TableList")
        })
    }

    return [saveTable]
}