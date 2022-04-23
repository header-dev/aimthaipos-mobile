import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Pressable } from "react-native";
import { Divider, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Container,
  Body,
  Footer,
  Header,
  // Input,
  Item,
  Left,
  Text,
  Title,
  Right,
  View,
  Button,
  Toast,
  Label,
  Form,
  Picker,
  Icon,
  Thumbnail,
} from "native-base";
import { Formik } from "formik";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import InputSpinner from "react-native-input-spinner";
import * as Yup from 'yup';

const InitialDrawerFormSchema = Yup.object().shape({
    remark: Yup.number()
        .required('Please enter a customer.'),
});
const CustomerModal = ({ showModal, handleClose, onSubmit }) => {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <KeyboardAwareScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeaderText}>Customer Info (Optional)</Text>
              <Divider
                style={{
                  backgroundColor: "black",
                  width: 300,
                  marginBottom: 10,
                }}
              />

              <Formik
                initialValues={{
                  remark: "",
                }}
                enableReinitialize
                onSubmit={(values) => {
                  onSubmit(values);
                }}
                // validationSchema={InitialDrawerFormSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <Form>
                    <View style={{
                      width: 300
                    }}>
                      <Input
                        placeholder="Cutomer Name"
                        style={styles.inputLogin}
                        onChangeText={handleChange('remark')}
                        onBlur={handleBlur('remark')}
                        value={values.remark}
                        errorMessage={errors.remark}
                        keyboardType="numeric"
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent:'center'
                      }}
                    >
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.textStyle}>OK</Text>
                      </Pressable>
                    </View>
                  </Form>
                )}
              </Formik>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 250,
  },
  inputLogin: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderColor: "#a4a4a4",
    color: "#a4a4a4",
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  buttonClose: {
    // backgroundColor: "#2196F3",
  },
  textStyle: {
    // color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
  },
  modalHeaderText: {
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CustomerModal;
