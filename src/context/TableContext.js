import createDataContext from "./createDataContext";
import backendApi from "../api/backend";
import { navigate } from "./../navigationRef";
import { NavigationActions } from "react-navigation";
import { Toast } from "native-base";

const userReducer = (state, action) => {
  switch (action.type) {
    case "get_table_fetch":
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case "get_table_success":
      return {
        ...state,
        tables: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case "get_table_rejected":
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    default:
      return state;
  }
};

const fetchTable = (dispatch) => (query = "") => {
  dispatch({ type: "get_table_fetch" });
  backendApi
    .get(`/table?q=${query}`)
    .then((response) => {
      dispatch({ type: "get_table_success", payload: response.data });
    })
    .catch((err) => {
      dispatch({ type: "get_table_rejected" });
    });
};

const createTable = (dispatch) => async (value) => {
  await backendApi.post("/table/create", value);
};

const updateTable = (dispatch) => async (id, value) => {
  await backendApi.put(`/table/update/${id}`, value);
};

const deleteTable = (dispatch) => async (id) => {
  await backendApi.delete(`/table/delete/${id}`);
};

export const { Provider, Context } = createDataContext(
  userReducer,
  { fetchTable, createTable, updateTable, deleteTable },
  {
    tables: [],
    isLoading: false,
    isRejected: false,
  }
);
