import createDataContext from './createDataContext';
import backendApi from '../api/backend';
import { navigate } from './../navigationRef';
import { Toast } from 'native-base';
import { Platform } from 'react-native';
import { BACKEND_URL } from '@env';
const initialState = {
  users: { data: [], isLoading: false, isRejected: false },
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'save_partner_loading':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'save_partner_success':
      return {
        ...state,
        isLoading: false,
        isRejected: false,
      };
    case 'save_partner_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case 'get_partner_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_partner_success':
      return {
        ...state,
        partners: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_partner_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    default:
      return state;
  }
};

const fetchPartner =
  (dispatch) =>
  (query = '') => {
    dispatch({ type: 'get_partner_fetch' });
    backendApi
      .get(`/partner?q=${query}`)
      .then((response) => {
        dispatch({ type: 'get_partner_success', payload: response.data });
      })
      .catch((err) => dispatch({ type: 'get_partner_rejected' }));
  };

const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('logo', {
    type: photo.type,
    name: 'photo.jpg',
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });
  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const createPartner = (dispatch) => async (image, value) => {
  // try {
  //     dispatch({ type: "save_partner_loading" })

  // await backendApi.post('/partner/save', createFormData(image, {
  //     id: value.id,
  //     name: value.name,
  //     chargePrice: value.chargePrice,
  //     percentage: value.percentage
  // }), {
  //     headers: new Headers({
  //         'Content-Type': 'application/x-www-form-urlencoded', //Specifying the Content-Type
  //     })
  // })

  //     dispatch({ type: "save_partner_success" })
  // } catch (error) {
  //     dispatch({ type: "save_partner_rejected" })
  // }

  try {
    dispatch({ type: 'save_partner_loading' });

    const data = new FormData();
    data.append('fileData', {
      uri:
        Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', ''),
      name: 'photo.jpg',
      type: image.type,
    });

    Object.keys(value).forEach((key) => {
      data.append(key, value[key]);
    });
    const token = await AsyncStorage.getItem('token');
    const setting = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;',
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };

    await fetch(BACKEND_URL + '/partner/save', setting);
    dispatch({ type: 'save_partner_success' });
    navigate('MenuList');
  } catch (error) {
    dispatch({ type: 'save_partner_rejected' });
    Toast.show({
      text: error.message,
      buttonText: 'Okay',
      type: 'warning',
    });
  }
};

const deletePartner = (dispatch) => (id) => {
  backendApi
    .delete(`/partner/delete/${id}`)
    .then((response) => {
      if (response.data) {
        const { message } = response.data;
        Toast.show({
          text: message,
          buttonText: 'Okay',
        });
      }
    })
    .catch((err) => {});
};

export const { Provider, Context } = createDataContext(
  userReducer,
  { fetchPartner, createPartner, deletePartner },
  {
    partners: [],
    isLoading: false,
    isRejected: false,
  }
);
