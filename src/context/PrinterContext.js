import createDataContext from "./createDataContext";
import backendApi from "./../api/backend";
import { Toast } from "native-base";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userReducer = (state, action) => {
  switch (action.type) {
    case "save_printer_loading":
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case "save_printer_success":
      return {
        ...state,
        isLoading: false,
        isRejected: false,
      };
    case "save_printer_rejected":
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case "get_printer_fetch":
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case "get_printer_success":
      return {
        ...state,
        printers: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case "get_printer_rejected":
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case "get_prt_fetch":
      return {
        ...state,
        isPrinterLoading: true,
        isPrinterRejected: false,
      };
    case "get_prt_success":
      return {
        ...state,
        printer: action.payload,
        isPrinterLoading: false,
        isPrinterRejected: false,
      };
    case "get_prt_rejected":
      return {
        ...state,
        isPrinterLoading: false,
        isPrinterRejected: true,
      };

    default:
      return state;
  }
};

const fetchPrinter = (dispatch) => (query = "") => {
  dispatch({ type: "get_printer_fetch" });
  backendApi
    .get(`/printer?q=${query}`)
    .then((response) => {
      dispatch({ type: "get_printer_success", payload: response.data });
    })
    .catch((err) => dispatch({ type: "get_printer_rejected" }));
};

const createPrinter = (dispatch) => async (value) => {
  try {
    dispatch({ type: "save_printer_loading" });
    await backendApi.post("/printer/save", value);
    dispatch({ type: "save_printer_success" });
  } catch (error) {
    dispatch({ type: "save_printer_rejected" });
  }
};

const deletePrinter = (dispatch) => (id) => {
  backendApi
    .delete(`/printer/delete/${id}`)
    .then((response) => {
      if (response.data) {
        const { message } = response.data;
        Toast.show({
          text: message,
          buttonText: "Okay",
        });
      }
    })
    .catch((err) => {
      Toast.show({
        text: err.message,
        buttonText: "Okay",
        type: "danger",
      });
    });
};

const getBillPrinter = (dispatch) => async () => {
 
  return await AsyncStorage.getItem('bill_printer');
}

const getKitchenPrinter = (dispatch) => async () => {

  return await AsyncStorage.getItem('kitchen_printer');

}

export const { Provider, Context } = createDataContext(
  userReducer,
  { fetchPrinter, deletePrinter, createPrinter, getBillPrinter, getKitchenPrinter },
  {
    printers: [],
    printer: null,
    isLoading: false,
    isRejected: false,
    isPrinterLoading: false,
    isPrinterRejected: false,
  }
);
