import React, { useContext } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native";
import { View, Text } from "react-native";
import { Header, ListItem } from "react-native-elements";
import { NavigationEvents, withNavigation } from "react-navigation";
import { navigate } from "../../navigationRef";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Context as SaleContext } from "./../../context/SaleContext";
import { Context as SettingContext } from './../../context/SettingContext'
import { Toast } from "native-base";

const PaymentModalScreen = ({ navigation }) => {
  const { updateOrder } = useContext(SaleContext);
  const { state: { card, isCardLoading, isCardRejected }, fetchCard } = useContext(SettingContext)

  const keyExtractor = (item, index) => index.toString();
  const _order = navigation.getParam("_order");
  const _amountDue = navigation.getParam("_amountDue");
  const _actualPayment = navigation.getParam("_actualPayment")

  let paymentData = []

  if (_order.partner) {
    paymentData = [
      {
        value: "partner",
        label: _order.partner.name,
        icon: "package-variant-closed",
      },
    ]
  } else {
    if (_actualPayment.payReceive > 0) {
      paymentData = [
        {
          value: "cash",
          label: "Cash",
          icon: "cash-usd-outline",
        }
      ]
    } else {

      paymentData = [
        {
          value: "card",
          label: `Card (Fee ${card.fee} %)`,
          icon: "credit-card-check",
        },
        {
          value: "take-away",
          label: "Take Away",
          icon: "package-variant-closed",
        },
        {
          value: "pay-id",
          label: "Pay ID",
          icon: "credit-card-scan",
        }
      ]

      
    }
  }




  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => {
        var orderValue = Object.assign({}, _order)

        delete orderValue.tableTransactions;
        delete orderValue.orderDetails;
        delete orderValue.actualPay

        if (item.value === "cash") {
          orderValue.payReceive = _actualPayment.payReceive
          orderValue.payChange = _actualPayment.returnAmount
        }

        updateOrder(_order.id, {
          ...orderValue,
          paymentType: item.value,
          pay: _amountDue,
          cardCharge: item.value === "card" ? card.fee : 0.00,
          orderStatus: "closed",
        }).then(() => {
          navigate("Final", {
            _orderId: _order.id,
            _payReceive: _actualPayment.payReceive > 0 ? _actualPayment.payReceive : 0,
            _returnAmount: _actualPayment.returnAmount > 0 ? _actualPayment.returnAmount : 0,
            _paymentType: item.value
          });
        });

      }}
    >
      <MaterialCommunityIcons name={item.icon} size={40} color="black" />
      <ListItem.Content>
        <ListItem.Title h4>{item.label}</ListItem.Title>
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
      <NavigationEvents
        onWillFocus={fetchCard}
      />
      <Header
        placement="left"
        centerComponent={{
          text: "Payment",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        rightComponent={{
          icon: "close",
          color: "#fff",
          onPress: () => {
            navigation.goBack();
          },
        }}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={paymentData}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default withNavigation(PaymentModalScreen);
