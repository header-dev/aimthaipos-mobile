import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import backendApi from "../api/backend";
import { navigate, navigateReset } from "../navigationRef";
import jwtDecode from "jwt-decode";
import { StackActions, NavigationActions, CommonActions } from "react-navigation";
import { Toast } from "native-base";

const authReducer = (state, action) => {
  switch (action.type) {
    case "sigin_loading":
      return { ...state, isLoading: true };
    case "add_error":
      return { ...state, errorMessage: action.payload, isLoading: false };
    case "signin":
      return { errorMessage: "", token: action.payload, isLoading: false };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    case "get_user_success":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("OrderList");
  } else {
    navigate("SignIn");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await backendApi.post("/signup", { email, password });
      await AsyncStorage.setItem("token", response.data.token);

      dispatch({ type: "signin", payload: response.data });

      navigate("TrackList");
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up",
      });
    }
  };
};

const signin = (dispatch) => async ({ username, password }) => {
  try {
    dispatch({ type: "sigin_loading" });
    const response = await backendApi.post("/authen/login", {
      username,
      password,
    });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("OrderList");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
    Toast.show({
      text: err.message,
      type: "danger"
    })
  }
};

const signinVoid = (dispatch) => async (orderId, userId, { username, password }) => {
  try {
    dispatch({ type: "sigin_loading" });
    const response = await backendApi.post("/authen/login", {
      username,
      password,
    });

    if (response.data.token) {
      await backendApi.put(`/sale/order/${orderId}`, {
        orderStatus: 'void',
        userId: userId
      });
      dispatch({ type: "signin", payload: response.data.token });
      navigate("OrderList")
    } else {
      Toast.show({
        text: "Incorrect ID or Username",
        type: "warning"
      })
    }

  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
    Toast.show({
      text: err.message,
      type: "danger"
    })
  }
};

const getUser = (dispatch) => async () => {
  let token = await AsyncStorage.getItem("token");
  const { sub } = jwtDecode(token);
  dispatch({ type: "get_user_success", payload: sub });
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("currentOrder");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signinVoid, signout, clearErrorMessage, tryLocalSignin, getUser },
  { token: null, errorMessage: "", isLoading: false, user: null }
);
