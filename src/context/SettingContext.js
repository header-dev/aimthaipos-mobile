import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { NavigationActions } from "react-navigation";
import { Toast } from 'native-base'

const userReducer = (state, action) => {
    switch (action.type) {
        case 'get_card_fetch':
            return {
                ...state,
                isCardLoading: true, isCardRejected: false
            }
        case 'get_card_success':
            return {
                ...state,
                card: action.payload, isCardLoading: false, isCardRejected: false
            }
        case 'get_card_rejected':
            return {
                ...state,
                isCardLoading: false, isCardRejected: true
            }
        default:
            return state
    }
}

const fetchCard = dispatch => () => {
    dispatch({ type: 'get_card_fetch' })
    backendApi.get('/card').then(response => {
        console.log(response.data);
        dispatch({ type: 'get_card_success', payload: response.data })
    }).catch(err => dispatch({ type: 'get_card_rejected' }))
}

const createCard = dispatch => async (value) => {
    const response = await backendApi.post(`/card/create`, value)
    if (response.data) {
        Toast.show({
            text: "Update card services fee has successfully.",
            buttonText: "Okay",
            type: "success"
        })
    }
}

export const { Provider, Context } = createDataContext(
    userReducer,
    { fetchCard, createCard },
    {
        card: {
            fee: 0.0
        },
        isCardLoading: false,
        isCardRejected: false,
    }
)