import { navigate } from "./../../navigationRef";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => {
  
  const openOrderTransaction = async (value) => {
    await AsyncStorage.setItem("currentOrder", JSON.stringify(value));

    const { id, tableTransactions } = value;

    if (!tableTransactions) {
      navigate("SelectTable", {
        _id: id,
      });
    } else {
      navigate("rootSaleFlow");
    }
  };

  return [openOrderTransaction];
};
