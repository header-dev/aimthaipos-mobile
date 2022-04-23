import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { NavigationActions } from "react-navigation";
import { Toast } from 'native-base'


const userReducer = (state, action) => {
    switch (action.type) {
        case 'get_shop_fetch':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'get_shop_success':
            return {
                ...state,
                shop: action.payload, isLoading: false, isRejected: false
            }
        case 'get_shop_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        default:
            return state
    }
}

const fetchShop = dispatch => () => {
    dispatch({ type: 'get_shop_fetch' })
    backendApi.get('/shop').then(response => {
        dispatch({ type: 'get_shop_success', payload: response.data })
    }).catch(err => dispatch({ type: 'get_shop_rejected' }))
}

const createShop = dispatch => async (value) => {
    const response = await backendApi.post(`/shop/create`, value)
    if (response.data) {
        Toast.show({
            text: "Update shop information has successfully.",
            buttonText: "Okay",
            type:"success"
        })
    }
}

export const { Provider, Context } = createDataContext(
    userReducer,
    { fetchShop, createShop },
    {
        shop: null,
        isLoading: false,
        isRejected: false,
    }
)