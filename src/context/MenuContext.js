import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { Toast } from 'native-base'
import { Platform } from 'react-native'

const userReducer = (state, action) => {
    switch (action.type) {
        case 'save_menu_loading':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'save_menu_success':
            return {
                ...state,
                isLoading: false, isRejected: false
            }
        case 'save_menu_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        case 'get_menu_fetch':
            return {
                ...state,
                isLoading: true, isRejected: false
            }
        case 'get_menu_success':
            return {
                ...state,
                menus: action.payload, isLoading: false, isRejected: false
            }
        case 'get_menu_rejected':
            return {
                ...state,
                isLoading: false, isRejected: true
            }
        default:
            return state
    }
}

const fetchMenu = dispatch => (query = "") => {
    dispatch({ type: 'get_menu_fetch' })
    backendApi.get(`/menu?q=${query}`).then(response => {
        dispatch({ type: 'get_menu_success', payload: response.data })
    }).catch(err => dispatch({ type: 'get_menu_rejected' }))
}

const createFormData = (photo, body) => {
    const data = new FormData();
    data.append('photo', {
        type: photo.type,
        name: "photo.jpg",
        uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", ""),
    })
    Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
    });

    return data;
};

const createMenu = dispatch => async (image, value) => {

    try {
        dispatch({ type: "save_menu_loading" })
        return backendApi.post('/menu/save', createFormData(image, value), {
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', //Specifying the Content-Type
            })
        })
        
        dispatch({ type: "save_menu_success" })
    } catch (error) {
        dispatch({ type: "save_menu_rejected" })
    }
}

const deleteMenu = dispatch => (id) => {
    backendApi.delete(`/menu/delete/${id}`)
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
    { fetchMenu, createMenu, deleteMenu },
    {
        menus: [],
        isLoading: false,
        isRejected: false
    }
)