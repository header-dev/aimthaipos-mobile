import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { Toast } from 'native-base'


const userReducer = (state, action) => {
    switch (action.type) {
        case 'save_categories_loading':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'save_categories_success':
            return {
                ...state,
                isLoading: false, isRejected: false
            }
        case 'save_categories_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        case 'get_categories_fetch':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'get_categories_success':
            return {
                ...state,
                categories: action.payload, isLoading: false, isRejected: false
            }
        case 'get_categories_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        default:
            return state
    }
}

const fetchCategory = dispatch => (query = "") => {
    dispatch({ type: 'get_categories_fetch' })
    backendApi.get(`/categories?q=${query}`).then(response => {
        dispatch({ type: 'get_categories_success', payload: response.data })
    }).catch(err => dispatch({ type: 'get_categories_rejected' }))
}

const createCategory = dispatch => async (value) => {
    try {
        dispatch({ type: "save_categories_loading" })
        await backendApi.post('/categories/save', value)
        dispatch({ type: "save_categories_success" })
    } catch (error) {
        dispatch({ type: "save_categories_rejected" })
    }
}

const deleteCategory = dispatch => (id) => {
    backendApi.delete(`/categories/delete/${id}`)
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
    { fetchCategory, deleteCategory, createCategory },
    {
        categories: [],
        menus: [],
        isLoading: false,
        isRejected: false
    }
)