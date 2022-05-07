import { useContext, useEffect } from 'react'
import { Context as SaleContext } from '../../context/SaleContext'
import { Context as AuthContext } from '../../context/AuthContext'

export default () => {
    const { fetchOrder } = useContext(SaleContext);
    const { state: { user }, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser()
        return () => {
            
        }
    }, [])

    const getOrder = () => {
        fetchOrder()
    }

    return [getOrder]
}