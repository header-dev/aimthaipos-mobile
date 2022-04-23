import { Button } from "native-base";
import React from "react";
import { FlatList } from "react-native";
import { View, Text } from "react-native";
import { Header, ListItem } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigate } from "../../navigationRef";
import useSaveOrderHook from "./../../hooks/sales/useSaveOrderHook";

export default function OrderTypeModalScreen() {
  const [saveNewOrder] = useSaveOrderHook();

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => {
        saveNewOrder(item.value);
      }}
    >
      <ListItem.Content>
        <ListItem.Title>{item.label}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Header
        placement="left"
        centerComponent={{
          text: "Order Type",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        rightComponent={{
          icon: "close",
          color: "#fff",
          onPress: () => {
            navigate("OrderList");
          },
        }}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={[
          {
            value: "dine-in",
            label: "Dine In",
          },
          {
            value: "take-away",
            label: "Take Away",
          },
          {
            value: "partner",
            label: "Partner",
          },
          {
            value: "delivery",
            label: "Delivery",
          },
        ]}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
