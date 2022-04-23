import React, { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
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
    Picker,
    Icon,
    Thumbnail,
} from "native-base";

import { ActivityIndicator } from 'react-native';
import { navigate } from '../navigationRef';

var width = Dimensions.get("window").width;

export default function ProteinForm({
    values,
    validateSchema,
    onSubmit,
    isLoading
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
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <Form>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.name && touched.name)} >
                                    <MaterialIcons name="format-list-numbered" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        placeholder="Name"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.name}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.addition_price && touched.addition_price)} >
                                    <MaterialIcons name="format-list-numbered" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('addition_price')}
                                        onBlur={handleBlur('addition_price')}
                                        placeholder="Addition Price"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.addition_price ? String(values.addition_price) : null}
                                        keyboardType="decimal-pad"
                                    />
                                </Item>
                            </Form>
                            <Button
                                rounded
                                block
                                onPress={handleSubmit}
                                style={styles.button_auth}
                            >
                                {isLoading && (<ActivityIndicator animating />)}
                                <Text>Save</Text>
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
        width: '80%',
        shadowRadius: 5,
        marginBottom: 10,
        // borderColor: '#a4a4a4',
        color: '#a4a4a4',
    },
    inputTextArea: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        shadowRadius: 5,
        marginBottom: 10,
        color: '#a4a4a4',
        height: 150
    },
    button_auth: {
        width: '80%',
        alignSelf:'center',
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