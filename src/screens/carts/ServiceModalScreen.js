import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Header } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { withNavigation } from "react-navigation";
import ServiceForm from "../../components/sales/ServiceForm";
import { Context as SaleContext } from './../../context/SaleContext'
import * as Yup from 'yup';

const ServiceFormSchema = Yup.object().shape({
  serviceCharge: Yup.number().required('Please enter a service.'),
});

const ServiceModalScreen = ({ navigation }) => {

  const _orderId = navigation.getParam('_orderId')

  const {
    state: { order },
    updateOrder,
  } = useContext(SaleContext);

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <Header
        placement="left"
        centerComponent={{
          text: "Service Charge",
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
      <ServiceForm
        values={{
          serviceCharge: '0.00'
        }}
        validateSchema={ServiceFormSchema}
        onSubmit={(value) => {
          delete value.actualPay
          updateOrder(_orderId, value).then(() => {
            navigation.goBack()
          })
        }}
      />
    </SafeAreaView>
  );
};

export default withNavigation(ServiceModalScreen);
