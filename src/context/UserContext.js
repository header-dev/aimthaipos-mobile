import createDataContext from "./createDataContext";
import backendApi from "../api/backend";
import { navigate } from "./../navigationRef";
import { NavigationActions } from "react-navigation";
import { Toast } from "native-base";

const initialState = {
  users: { data: [], isLoading: false, isRejected: false },
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "get_role_fetch":
      return {
        ...state,
        isRoleLoading: true,
        isRoleRejected: false,
      };
    case "get_role_success":
      return {
        ...state,
        roles: action.payload,
        isRoleLoading: false,
        isRoleRejected: false,
      };
    case "get_role_rejected":
      return {
        ...state,
        isRoleLoading: false,
        isRoleRejected: true,
      };
    case "get_user_fetch":
      return {
        ...state,
        isLoading: true,
        isRejected: false,
      };
    case "get_user_success":
      return {
        ...state,
        users: action.payload,
        isLoading: false,
        isRejected: false,
      };
    case "get_user_rejected":
      return {
        ...state,
        isLoading: false,
        isRejected: true,
      };
    case "reset_password_success":
      return {
        ...state,
        resetMessage: action.payload,
        isResetPasswordRejected: false,
      };
    case "reset_password_rejected":
      return {
        ...state,
        resetMessage: action.payload,
        isResetPasswordRejected: true,
      };
    default:
      return state;
  }
};



const fetchUsers = (dispatch) => (query = "") => {
  dispatch({ type: "get_user_fetch" });
  backendApi.get(`/user?q=${query}`).then(response => {
      dispatch({ type: 'get_user_success', payload: response.data })
  }).catch(err => {
      dispatch({ type: 'get_user_rejected' })
  })
};

const createUser = (dispatch) => (value) => {
  backendApi
    .post("/user/create", value)
    .then(() => {
      navigate("UserList");
    })
    .catch((err) => {});
};

const updateUser = (dispatch) => (id, value) => {
  backendApi
    .put(`/user/update/${id}`, value)
    .then(() => {
      navigate("UserList");
    })
    .catch((err) => {});
};

const resetPassword = (dispatch) => (id, value) => {
  backendApi
    .put(`/user/reset-password/${id}`, value)
    .then((response) => {
      const { message } = response.data;
      dispatch({ type: "reset_password_success", payload: message });
    })
    .catch((err) =>
      dispatch({ type: "reset_password_rejected", payload: err.message })
    );
};

const deleteUser = (dispatch) => (id) => {
  backendApi
    .delete(`/user/delete/${id}`)
    .then((response) => {
      if (response.data) {
        const { message } = response.data;
        Toast.show({
          text: message,
          buttonText: "Okay",
        });
      }
    })
    .catch((err) => {});
};

const fetchRoles = (dispatch) => () => {
  dispatch({ type: "get_role_fetch" });
  backendApi
    .get("/user/roles")
    .then((response) => {
      dispatch({ type: "get_role_success", payload: response.data });
    })
    .catch((err) => dispatch({ type: "get_role_rejected" }));
};

export const { Provider, Context } = createDataContext(
  userReducer,
  { fetchUsers, createUser, updateUser, deleteUser, resetPassword, fetchRoles },
  {
    users: [],
    roles: [],
    isLoading: false,
    isRejected: false,
    isRoleLoading: false,
    isRoleRejected: false,
    resetMessage: "",
    isResetPasswordRejected: false,
  }
);
