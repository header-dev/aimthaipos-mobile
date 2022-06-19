import createDataContext from './createDataContext'
import backendApi from '../api/backend'
import { navigate } from './../navigationRef'
import { Toast } from 'native-base'
import { Platform } from 'react-native'
import { BACKEND_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    // Object.keys(body).forEach((key) => {
    //     data.append(key, body[key]);
    // });

    data.append('fileData', {
        type: photo.type,
        name: "photo.jpg",
        uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", ""),
    })

    return data;
};

const createMenu = dispatch => async (image, value) => {


    try {
        dispatch({ type: "save_menu_loading" })
        const data = new FormData();
        data.append("fileData", {
            uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
            name: "photo.jpg",
            type: image.type,
        });
        Object.keys(value).forEach((key) => {
            data.append(key, value[key]);
        });
        const token = await AsyncStorage.getItem('token')
        const setting = {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data;",
                "Authorization": `Bearer ${token}`
            },
            body: data,
        };

        await fetch(BACKEND_URL + '/menu/save', setting);
        dispatch({ type: "save_menu_success" })
        navigate('MenuList')
    } catch (error) {
        dispatch({ type: "save_menu_rejected" })
        Toast.show({
            text: error.message,
            buttonText: "Okay",
            type: "warning",
        });
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
        }).catch(err => {
            Toast.show({
                text: err.message,
                buttonText: "Okay",
                type: "danger",
            });
        })
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