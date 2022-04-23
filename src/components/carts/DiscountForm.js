import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Button, Divider, Input, Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  View,
  Form,
} from "native-base";
import { Formik } from "formik";
import * as Yup from "yup";
import { FakeCurrencyInput } from "react-native-currency-input";

const DiscountScreema = Yup.object().shape({
  discount: Yup.number()
    .lessThan(Yup.ref('price'), "Discount should be < menu price")
});
var width = Dimensions.get("window").width;

const DiscountForm = ({ onSubmit, foodTitle, initialValue }) => {
  return (
    <View style={styles.centeredView}>
      <KeyboardAwareScrollView>
        <View style={styles.centeredView}>
          <Formik
            initialValues={initialValue}
            enableReinitialize
            onSubmit={(values) => {
              onSubmit(values);
            }}
            validationSchema={DiscountScreema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form>
                <View style={{
                  marginBottom: 5
                }}>
                  <FakeCurrencyInput
                    value={values.discount ? `${values.discount}` : `${0}`}
                    onChangeValue={(value) => {
                      setFieldValue("discount", value)
                    }}
                    onBlur={handleBlur('discount')}
                    placeholder="Discount"
                    unit=""
                    delimiter=","
                    separator="."
                    precision={2}
                    style={{ fontSize: 16, borderWidth: 0.5, padding: 10 }}
                  />
                  {errors.discount && <Text style={{ color: 'red' }}>{errors.discount}</Text>}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: '100%'
                  }}
                >
                  <Button
                    title="Discount"
                    onPress={handleSubmit}
                    containerStyle={styles.buttonSubmit}
                  />
                </View>
              </Form>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20
  },
  inputLogin: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderColor: "#a4a4a4",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    height: 35,
    color: "blue",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonSubmit: {
    width: '100%'
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    margin: 10,
    textAlign: "center",
  },
  modalHeaderText: {
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default DiscountForm;
