import React, { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Formik } from 'formik';

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
    Text,
    Title,
    Right,
    View,
    Button,
    Toast,
    Label,
    Form,
} from "native-base";
import { FakeCurrencyInput } from 'react-native-currency-input';

var width = Dimensions.get("window").width;

export default function TipForm({
    values,
    validateSchema,
    onSubmit
}) {

    return (
        <KeyboardAwareScrollView>
            <View
                style={{
                    flex: 0.8,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    marginTop: 30,
                }}
            >
                <Formik
                    initialValues={values}
                    enableReinitialize
                    onSubmit={values => {
                        onSubmit(values)
                    }}
                    validationSchema={validateSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            <Form>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.cash && touched.cash)} >
                                    <MaterialIcons name="format-list-numbered" style={styles.iconInput} />                                    
                                    <FakeCurrencyInput
                                        value={values.tip}
                                        onChangeValue={(value) => {
                                            setFieldValue("tip", value)
                                        }}
                                        onBlur={handleBlur('tip')}
                                        placeholder="Tip"
                                        unit=""
                                        delimiter=","
                                        separator="."
                                        precision={2}
                                        style={{ fontSize: 16,width:width * 0.75 }}
                                    />
                                </Item>
                            </Form>

                            <Button
                                rounded
                                block
                                onPress={handleSubmit}
                                style={styles.button_auth}
                            >
                                <Text>Save</Text>
                            </Button>
                            <Button
                                rounded
                                block
                                onPress={() => {
                                    setFieldValue("tip", 0.00)
                                }}
                            >
                                <Text>Clear</Text>
                            </Button>
                        </>
                    )}
                </Formik>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    inputLogin: {
        backgroundColor: '#FFFFFF',
        width: width * 0.80,
        shadowRadius: 5,
        marginBottom: 10,
        height: 50,
        color: '#a4a4a4',
    },
    inputTextArea: {
        backgroundColor: '#FFFFFF',
        width: width * 0.80,
        shadowRadius: 5,
        marginBottom: 10,
        color: '#a4a4a4',
        height: 150
    },
    button_auth: {
        minWidth: 200,
        backgroundColor: "green",
        marginBottom: 8,
        height: 53,
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    text_auth: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        minWidth: 200,
        marginTop: 5,
        color: '#808080',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    iconInput: {
        fontSize: 18,
        marginLeft: 18,
        marginRight: 5,
        color: "#a4a4a4"
    }
});