import createDataContext from './createDataContext';
import backendApi from '../api/backend';
import { navigate } from './../navigationRef';
import { NavigationActions } from 'react-navigation';
import { Toast } from 'native-base';
import _ from 'lodash';
import currency from 'currency.js';
import { formatCurrency } from '../utils/NumberUtil';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'get_dailysale_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_dailysale_success':
      return {
        ...state,
        dailysales: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_dailysal_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case 'get_sumtransitem_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_sumtransitem_success':
      return {
        ...state,
        report_datas: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_sumtransitem_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };

    case 'get_sumitem_fetch':
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case 'get_sumitem_success':
      return {
        ...state,
        report_sum_item_datas: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case 'get_sumitem_rejected':
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    default:
      return state;
  }
};

const fetchDailySaleReport =
  (dispatch) =>
  (query = '') => {
    dispatch({ type: 'get_dailysale_fetch' });
    backendApi
      .get(`/report/daily-sales?q=${query}`)
      .then((response) => {
        dispatch({
          type: 'get_dailysale_success',
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({ type: 'get_dailysal_rejected' });
      });
  };

const fetchSumSaleTransactionItem =
  (dispatch) =>
  (query = '') => {
    dispatch({ type: 'get_sumtransitem_fetch' });
    backendApi
      .get(`/report/summary-sale-transaction-item?q=${query}`)
      .then((response) => {
        dispatch({
          type: 'get_sumtransitem_success',
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({ type: 'get_sumtransitem_rejected' });
      });
  };

const fetchSumItem = (dispatch) => (date_f, date_e) => {
  dispatch({ type: 'get_sumitem_fetch' });
  backendApi
    .get(`/report/summary-sale-item?date_f=${date_f}&date_e=${date_e}`)
    .then((response) => {
      dispatch({
        type: 'get_sumitem_success',
        payload: response.data,
      });
    })
    .catch((err) => {
      dispatch({ type: 'get_sumitem_rejected' });
    });
};

export const { Provider, Context } = createDataContext(
  userReducer,
  { fetchDailySaleReport, fetchSumSaleTransactionItem, fetchSumItem },
  {
    dailysales: [],
    report_datas: [],
    report_sum_item_datas: [],
    isLoading: false,
    isRejected: false,
  }
);
