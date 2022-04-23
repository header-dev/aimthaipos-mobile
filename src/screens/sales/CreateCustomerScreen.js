import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Container, Body } from "native-base";

import { Context as SaleContext } from "./../../context/SaleContext";

import CustomerForm from "../../components/sales/CustomerForm";
import * as Yup from "yup";
import { ActivityIndicator } from "react-native";
import { withNavigation } from "react-navigation";
import { Header } from "react-native-elements";
const CustomerFormSchema = Yup.object().shape({
  name: Yup.string().required("Please enter a name."),
  tel: Yup.string().required("Please enter a tel."),
  mobile: Yup.string().required("Please enter a mobile."),
  postalcode: Yup.number().required("Please enter a postalcode."),
}, ['tel', 'mobile']);
const PartnerCreateScreen = ({ navigation }) => {
  const { createCustomer } = useContext(SaleContext);

  return (
    <Container style={{ backgroundColor: "#fff" }}>
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => {
            navigation.goBack()
          },
        }}
        centerComponent={{
          text: `Customer Create`,
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <Body>
        <CustomerForm
          values={{
            name: "",
            tel: "",
            mobile: "",
            address: "",
            city: "",
            state: "",
            postalcode: "",
          }}
          validateSchema={CustomerFormSchema}
          onSubmit={(value) => {
            createCustomer(value, navigation);
          }}
        />
      </Body>
    </Container>
  );
};

export default withNavigation(PartnerCreateScreen);
