import createDataContext from './createDataContext';
import backendApi from '../api/backend';
import { navigate } from './../navigationRef';
import { Toast } from 'native-base';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'save_submenu_loading':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'save_submenu_success':
      return {
        ...state,
        isLoading: false,
        isRejected: false,
      };
    case 'save_submenu_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
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
    case 'get_table_fetch':
      return {
        ...state,
        isLoadingTable: true,
        isRejectedTable: false,
      };
    case 'get_table_success':
      return {
        ...state,
        tables: action.payload,
        isLoadingTable: false,
        isRejectedTable: false,
      };
    case 'get_table_rejected':
      return {
        ...state,
        isLoadingTable: false,
        isRejectedTable: true,
      };

    case 'get_menu_sale_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_menu_sale_success':
      return {
        ...state,
        menus: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_menu_sale_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case 'get_init_cashdrawer_fetch':
      return {
        ...state,
        isLoadingInitCashDrawer: true,
        isRejectedInitCashDrawer: false,
      };
    case 'get_init_cashdrawer_success':
      return {
        ...state,
        isInitCashDrawer: action.payload,
        isLoadingInitCashDrawer: false,
        isRejectedInitCashDrawer: false,
      };
    case 'get_init_cashdrawer_rejected':
      return {
        ...state,
        isLoadingInitCashDrawer: false,
        isRejectedInitCashDrawer: true,
      };
    case 'get_order_fetch':
      return {
        ...state,
        isLoadingOrder: true,
        isRejectedOrder: false,
      };
    case 'get_order_success':
      return {
        ...state,
        orders: action.payload,
        isLoadingOrder: false,
        isRejectedOrder: false,
      };
    case 'get_order_rejected':
      return {
        ...state,
        isLoadingOrder: false,
        isRejectedOrder: true,
      };
    case 'get_customer_fetch':
      return {
        ...state,
        isCustomerLoading: true,
        isCustomerRejected: false,
      };
    case 'get_customer_success':
      return {
        ...state,
        customers: action.payload,
        isCustomerLoading: false,
        isCustomerRejected: false,
      };
    case 'get_customer_rejected':
      return {
        ...state,
        isCustomerLoading: false,
        isCustomerRejected: true,
      };
    case 'get_order_detail_fetch':
      return {
        ...state,
        isLoadingOrderDetail: true,
        isRejectedOrderDetail: false,
      };
    case 'get_order_detail_success':
      return {
        ...state,
        order: action.payload,
        isLoadingOrderDetail: false,
        isRejectedOrderDetail: false,
      };
    case 'get_order_detail_rejected':
      return {
        ...state,
        isLoadingOrderDetail: false,
        isRejectedOrderDetail: true,
      };
    case 'get_current_order_success':
      return {
        ...state,
        currentOrder: action.payload,
      };
    case 'save_order_detail_success':
      return {
        ...state,
        order: action.payload,
      };
    case 'save_initial_drawer_success':
      return {
        ...state,
        isInitCashDrawerDetail: action.payload,
      };
    default:
      return state;
  }
};

const fetchMenuSale = (dispatch) => (favorite, productname, category) => {
  dispatch({ type: 'get_menu_sale_fetch' });
  backendApi
    .get(`/menu/sales?fav=${favorite}&name?${productname}&category=${category}`)
    .then((response) => {
      dispatch({ type: 'get_menu_sale_success', payload: response.data });
    })
    .catch((err) => dispatch({ type: 'get_menu_sale_rejected' }));
};

const saveFavorite = (dispatch) => (id, fav) => {
  return backendApi.put(`/menu/favorite/${id}/${fav}`);
};

const checkInitCashDrawer = (dispatch) => () => {
  dispatch({ type: 'save_initial_drawer_success', payload: false });
  return backendApi
    .get(`/sale/check-cashdrawer`)
    .then((result) => {
      if (result.data) {
        dispatch({ type: 'save_initial_drawer_success', payload: true });
      } else {
        dispatch({ type: 'save_initial_drawer_success', payload: false });
      }
      return result.data;
    })
    .catch((err) => {
      dispatch({ type: 'get_init_cashdrawer_rejected' });
    });
};

const saveInitCashDrawer = (dispatch) => (value) => {
  backendApi
    .post(`/sale/init-cashdrawer`, value)
    .then(() => {
      navigate('OrderTypeModal');
    })
    .catch((err) => {
      Toast.show({
        text: err.message,
        buttonText: 'Okay',
        type: 'danger',
      });
    });
};

const createOrder = (dispatch) => (value) => {
  return backendApi.post(`/sale/order`, value);
};

const createOrderDetail = (dispatch) => (value) => {
  delete value.priceAdditionPrice;
  return backendApi.post(`/sale/order-detail`, value);
};

const deleteOrderDetail = (dispatch) => async (id) => {
  await backendApi.delete(`/sale/order-detail/${id}`);
};

const fetchOrder = (dispatch) => () => {
  dispatch({ type: 'get_order_fetch' });
  backendApi
    .get(`/sale/order`)
    .then((response) => {
      dispatch({ type: 'get_order_success', payload: response.data });
    })
    .catch((err) => {
      console.warn(err);
      dispatch({ type: 'get_order_rejected' });
    });
};

const fetchOrderById = (dispatch) => (id) => {
  dispatch({ type: 'get_order_detail_fetch' });
  backendApi
    .get(`/sale/order/${id}`)
    .then((response) => {
      dispatch({ type: 'get_order_detail_success', payload: response.data });
    })
    .catch((err) => dispatch({ type: 'get_order_detail_rejected' }));
};

const fetchCurrentOrder = (dispatch) => async () => {
  const order = await AsyncStorage.getItem('currentOrder');
  dispatch({ type: 'get_current_order_success', payload: JSON.parse(order) });
};

const saveAddTable = (dispatch) => (value) => {
  backendApi
    .post(`/sale/order-table`, value)
    .then(() => {
      return backendApi.get(`/sale/order/${value.orderId}`);
    })
    .then(async (result) => {
      await AsyncStorage.setItem('currentOrder', JSON.stringify(result.data));
      navigate('rootSaleFlow');
    })
    .catch((err) => {
      Toast.show({
        text: err.message,
        buttonText: 'Okay',
        type: 'warning',
      });
    });
};

const mergeAddTable = (dispatch) => (value) => {
  backendApi
    .post(`/sale/order-table`, value)
    .then(() => {
      return backendApi.get(`/sale/order/${value.orderId}`);
    })
    .then(async (result) => {
      await AsyncStorage.setItem('currentOrder', JSON.stringify(result.data));
      navigate('Cart');
    })
    .catch((err) => {
      Toast.show({
        text: err.message,
        buttonText: 'Okay',
        type: 'warning',
      });
    });
};

const clearCurrentOrder = (dispatch) => async () => {
  await AsyncStorage.removeItem('currentOrder');
  navigate('orderListFlow');
};

const updateOrderDetail = (dispatch) => async (id, value, orderId) => {
  backendApi.put(`/sale/order-detail/${id}`, value).then(async () => {
    const response = await backendApi.get(`/sale/order/${orderId}`);

    await backendApi.put(`/sale/order/${orderId}`, {
      promotionAmount: 0,
      promotionId: null,
    });

    dispatch({ type: 'get_order_detail_success', payload: response.data });
  });
};

const addDiscount = (dispatch) => (id, value) => {
  return backendApi.put(`/sale/order-detail-discount/${id}`, value);
};

const updateOrder = (dispatch) => (id, value) => {
  return backendApi.put(`/sale/order/${id}`, value);
};

const fetchCustomer =
  (dispatch) =>
  (query = '') => {
    dispatch({ type: 'get_customer_fetch' });
    backendApi
      .get(`/sale/customer?q=${query}`)
      .then((response) => {
        dispatch({ type: 'get_customer_success', payload: response.data });
      })
      .catch((err) => dispatch({ type: 'get_customer_rejected' }));
  };

const createCustomer = (dispatch) => (value, navigation) => {
  backendApi
    .post(`/sale/customer`, value)
    .then(() => {
      navigation.goBack();
    })
    .catch((err) => {
      Toast.show({
        text: err.message,
        buttonText: 'Okay',
        type: 'warning',
      });
    });
};

const getSaleTable =
  (dispatch) =>
  (query = '') => {
    dispatch({ type: 'get_table_fetch' });
    backendApi
      .get(`/sale/table?q=${query}`)
      .then((result) => {
        dispatch({ type: 'get_table_success', payload: result.data });
      })
      .catch((err) => {
        dispatch({ type: 'get_table_rejected' });
        Toast.show({
          text: err.message,
          buttonText: 'Okay',
          type: 'warning',
        });
      });
  };

const getMenuSale = (dispatch) => () => {
  dispatch({ type: 'get_menu_sale_fetch' });
  backendApi
    .get(`/sale/menu`)
    .then((response) => {
      dispatch({ type: 'get_menu_sale_success', payload: response.data });
    })
    .catch((err) => dispatch({ type: 'get_menu_sale_rejected' }));
};

export const { Provider, Context } = createDataContext(
  userReducer,
  {
    mergeAddTable,
    createCustomer,
    fetchCustomer,
    saveFavorite,
    fetchMenuSale,
    saveInitCashDrawer,
    checkInitCashDrawer,
    createOrder,
    fetchOrder,
    fetchCurrentOrder,
    saveAddTable,
    clearCurrentOrder,
    createOrderDetail,
    fetchOrderById,
    updateOrderDetail,
    deleteOrderDetail,
    addDiscount,
    updateOrder,
    getSaleTable,
    getMenuSale,
  },
  {
    menus: [],
    orders: [],
    customers: [],
    tables: [],
    order: {
      orderDetails: [],
    },
    currentOrder: null,
    isLoadingTable: false,
    isRejectedTable: false,
    isLoadingOrderDetail: false,
    isRejectedOrderDetail: false,
    isInitCashDrawerDetail: false,
    isLoadingOrder: false,
    isRejectedOrder: false,
    isInitCashDrawer: false,
    isLoadingInitCashDrawer: false,
    isRejectedInitCashDrawer: false,
    isLoading: false,
    isRejected: false,
    isCustomerLoading: false,
    isCustomerRejected: false,
  }
);
