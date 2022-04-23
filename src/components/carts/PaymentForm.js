import React, { useEffect, useState } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Formik } from "formik";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import {
  Container,
  Body,
  Footer,
  Header,
  Input,
  Item,
  Left,
  Title,
  Right,
  View,
  Button,
  Toast,
  Label,
  Form,
} from "native-base";
import { FakeCurrencyInput } from "react-native-currency-input";
import { ButtonGroup, Text } from "react-native-elements";
import currency from "currency.js";
import { CalculatorInput } from "react-native-calculator";

export default function PaymentForm({ validateSchema,initialValue, onSubmit,
  bindSubmitForm
}) {

  

  return (
    <KeyboardAwareScrollView>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Formik
          initialValues={initialValue}
          enableReinitialize
          validationSchema={validateSchema}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            submitForm
          }) => {

            // bindSubmitForm(submitForm);

            return (
              <>
                <Form>
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text h3 style={{ color: "orange" }}>
                      Return :{" "}
                      {currency(values.returnAmount, { separator: "," }).format()}
                    </Text>
                  </View>
                  <Item rounded style={styles.inputLogin} error={Boolean(errors.payReceive && touched.payReceive)} >
                    <MaterialIcons name="money" style={styles.iconInput} />
                    <FakeCurrencyInput
                      value={values.payReceive}
                      onChangeValue={(value) => {
                        if (value > 0) {
                          setFieldValue(
                            "returnAmount",
                            Math.abs(value - values.amountDue)
                          );
                        } else {
                          setFieldValue("returnAmount", 0);
                        }
                        setFieldValue("payReceive", value);
                      }}
                      onBlur={handleBlur("payReceive")}
                      placeholder="Pay Receive"
                      unit=""
                      delimiter=","
                      separator="."
                      precision={2}
                      style={{
                        fontSize: 16,
                        minWidth: 220,
                        maxWidth: 400,
                        color: "black",
                      }}
                    />
                    <MaterialIcons
                      name="clear"
                      style={styles.iconInputClear}
                      onPress={() => {
                        setFieldValue("payReceive", 0.0);
                        setFieldValue("returnAmount", 0.0);
                      }}
                    />
                  </Item>
                  <ButtonGroup
                    onPress={(selectedIndex) => {
                      switch (selectedIndex) {
                        case 0:
                          setFieldValue("payReceive", values.payReceive + 1);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 1 - values.amountDue
                          );
                          break;
                        case 1:
                          setFieldValue("payReceive", values.payReceive + 2);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 2 - values.amountDue
                          );
                          break;
                        case 2:
                          setFieldValue("payReceive", values.payReceive + 5);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 5 - values.amountDue
                          );
                          break;
                        case 3:
                          setFieldValue("payReceive", values.payReceive + 10);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 10 - values.amountDue
                          );
                          break;
                        case 4:
                          setFieldValue("payReceive", values.payReceive + 20);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 20 - values.amountDue
                          );
                          break;
                        case 5:
                          setFieldValue("payReceive", values.payReceive + 50);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 50 - values.amountDue
                          );
                          break;
                        case 6:
                          setFieldValue("payReceive", values.payReceive + 100);
                          setFieldValue(
                            "returnAmount",
                            values.payReceive + 100 - values.amountDue
                          );
                          break;
                        default:
                          setFieldValue("payReceive", 0);
                          setFieldValue("returnAmount", 0);
                          break;
                      }
                      handleSubmit()
                    }}
                    buttons={["$1", "$2", "$5", "$10", "$20", "$50", "$100"]}
                    textStyle={{
                      fontSize: 16,
                    }}
                    containerStyle={{
                      marginBottom: 20,
                    }}
                  />
                </Form>
              </>
            )
          }
          }
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  inputLogin: {
    backgroundColor: "#FFFFFF",
    shadowRadius: 5,
    marginBottom: 10,
    height: 50,
    color: "#a4a4a4",
  },
  button_auth: {
    backgroundColor: "green",
    marginBottom: 8,
    height: 53,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  button_price: {
    backgroundColor: "violet",
    marginBottom: 10,
    height: 50,
    width: 60,
    alignContent: "center",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  text_auth: {
    backgroundColor: "transparent",
    textAlign: "center",
    // minWidth: 200,
    marginTop: 5,
    color: "#808080",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  iconInput: {
    fontSize: 18,
    marginLeft: 18,
    marginRight: 5,
    color: "#a4a4a4",
  },
  iconInputClear: {
    fontSize: 18,
    marginLeft: 5,
    marginRight: 18,
    color: "#a4a4a4",
  },
});
