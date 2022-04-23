import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { Toast } from 'native-base'
import { Platform } from 'react-native'

const initialState = {
    users: { data: [], isLoading: false, isRejected: false },
}

const userReducer = (state, action) => {
    switch (action.type) {
        case 'save_promotion_loading':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'save_promotion_success':
            return {
                ...state,
                isLoading: false, isRejected: false
            }
        case 'save_promotion_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        case 'get_promotion_fetch':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'get_promotion_success':
            return {
                ...state,
                promotions: action.payload, isLoading: false, isRejected: false
            }
        case 'get_promotion_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        default:
            return state
    }
}

const fetchPromotion = dispatch => (query = "") => {
    dispatch({ type: 'get_promotion_fetch' })
    backendApi.get(`/promotion?q=${query}`).then(response => {
        dispatch({ type: 'get_promotion_success', payload: response.data })
    }).catch(err => dispatch({ type: 'get_promotion_rejected' }))
}

const createPromotion = dispatch => async (value) => {
    try {
        dispatch({ type: "save_promotion_loading" })
        await backendApi.post('/promotion/save', value)
        dispatch({ type: "save_promotion_success" })
    } catch (error) {
        dispatch({ type: "save_promotion_rejected" })
    }
}

const deletePromotion = dispatch => (id) => {
    backendApi.delete(`/promotion/delete/${id}`)
        .then((response) => {
            if (response.data) {
                const { message } = response.data
                Toast.show({
                    text: message,
                    buttonText: "Okay"
                })
            }

        }).catch(err => {})
}

export const { Provider, Context } = createDataContext(
    userReducer,
    { fetchPromotion, createPromotion, deletePromotion },
    {
        promotions: [],
        isLoading: false,
        isRejected: false
    }
)