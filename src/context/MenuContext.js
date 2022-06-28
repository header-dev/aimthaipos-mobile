import createDataContext from './createDataContext';
import backendApi from '../api/backend';
import { navigate } from './../navigationRef';
import { Toast } from 'native-base';
import { Platform } from 'react-native';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'save_menu_loading':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'save_menu_success':
      return {
        ...state,
        isLoading: false,
        isRejected: false,
      };
    case 'save_menu_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case 'get_menu_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_menu_success':
      return {
        ...state,
        menus: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_menu_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case 'get_submenu_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_submenu_success':
      return {
        ...state,
        submenus: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_submenu_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case 'save_photo_loading':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'save_photo_success':
      return {
        ...state,
        isLoading: false,
        isRejected: false,
      };
    default:
      return state;
  }
};

const fetchMenu =
  (dispatch) =>
  (query = '', type = '', category = '', subsetmenu = '') => {
    dispatch({ type: 'get_menu_fetch' });
    backendApi
      .get(
        `/menu?q=${query}&type=${type}&category=${category}&subsetmenu=${subsetmenu}`
      )
      .then((response) => {
        dispatch({ type: 'get_menu_success', payload: response.data });
      })
      .catch((err) => dispatch({ type: 'get_menu_rejected' }));
  };

const fetchSubSetMenu =
  (dispatch) =>
  (query = '') => {
    dispatch({ type: 'get_submenu_fetch' });
    backendApi
      .get(`/menu/subset?q=${query}`)
      .then((response) => {
        dispatch({ type: 'get_submenu_success', payload: response.data });
      })
      .catch((err) => dispatch({ type: 'get_submenu_rejected' }));
  };

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append('fileData', {
    type: 'image/jpg',
    name: 'photo_menu',
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const createMenu = (dispatch) => async (image, imageChanged, value) => {
  try {
    dispatch({ type: 'save_menu_loading' });
    let resp = await backendApi.post('/menu/save', value);

    if (imageChanged) {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${BACKEND_URL}/menu/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: createFormData(image, { id: resp.data.id }),
      });
    }

    dispatch({ type: 'save_menu_success' });
    navigate('MenuList');
  } catch (error) {
    dispatch({ type: 'save_menu_rejected' });
    Toast.show({
      text: error.message,
      buttonText: 'Okay',
      type: 'warning',
    });
  }
};

const uploadPhoto = (dispatch) => async (id, image) => {
  dispatch({ type: 'save_photo_loading' });
  const token = await AsyncStorage.getItem('token');
  await fetch(`${BACKEND_URL}/menu/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: createFormData(image, { id: id }),
  });
  dispatch({ type: 'save_photo_success' });
};

const deleteMenu = (dispatch) => (id) => {
  backendApi
    .delete(`/menu/delete/${id}`)
    .then((response) => {
      if (response.data) {
        const { message } = response.data;
        Toast.show({
          text: message,
          buttonText: 'Okay',
        });
      }
    })
    .catch((err) => {
      Toast.show({
        text: err.message,
        buttonText: 'Okay',
        type: 'danger',
      });
    });
};

const addProteinToItem = (dispatch) => (menuData) => {
  dispatch({ type: 'get_submenu_fetch' });
  dispatch({ type: 'get_submenu_success', payload: menuData });
};

export const { Provider, Context } = createDataContext(
  userReducer,
  {
    fetchMenu,
    createMenu,
    deleteMenu,
    uploadPhoto,
    fetchSubSetMenu,
    addProteinToItem,
  },
  {
    menus: [],
    submenus: [],
    isLoading: false,
    isRejected: false,
  }
);
