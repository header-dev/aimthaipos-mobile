import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { Toast } from 'native-base'
import { Platform } from 'react-native'


const userReducer = (state, action) => {
    switch (action.type) {
        case 'save_protein_loading':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'save_protein_success':
            return {
                ...state,
                isLoading: false, isRejected: false
            }
        case 'save_protein_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        case 'get_protein_fetch':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'get_protein_success':
            return {
                ...state,
                proteins: action.payload, isLoading: false, isRejected: false
            }
        case 'get_protein_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        default:
            return state
    }
}

const fetchProtein = dispatch => (query = "") => {
    dispatch({ type: 'get_protein_fetch' })
    backendApi.get(`/protein?q=${query}`).then(response => {
        dispatch({ type: 'get_protein_success', payload: response.data })
    }).catch(err => dispatch({ type: 'get_protein_rejected' }))
}

const createProtein = dispatch => async (value) => {
    try {
        dispatch({ type: "save_protein_loading" })
        await backendApi.post('/protein/save', value)
        dispatch({ type: "save_protein_success" })
    } catch (error) {
        dispatch({ type: "save_protein_rejected" })
    }
}

const deleteProtein = dispatch => (id) => {
    backendApi.delete(`/protein/delete/${id}`)
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
    { fetchProtein, deleteProtein, createProtein },
    {
        proteins: [],
        isLoading: false,
        isRejected: false
    }
)