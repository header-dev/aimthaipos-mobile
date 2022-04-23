import React, { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Formik } from 'formik';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from 'react-native-elements'
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
    CheckBox
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { BACKEND_URL } from '../constants';
import { navigate } from '../navigationRef';
import InputCheckBoxForm from './../components/InputCheckBoxForm'

var width = Dimensions.get("window").width;

const initailThumb = require('./../../assets/thumbnail-empty.png');

export default function PartnerForm({
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
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
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
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.discount_percentage && touched.discount_percentage)}>
                                    <FontAwesome5 name="percent" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('discount_percentage')}
                                        onBlur={handleBlur('discount_percentage')}
                                        placeholder="Discount Percentage"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={`${values.discount_percentage}`}
                                        keyboardType="number-pad"
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.discount_price && touched.discount_price)}>
                                    <FontAwesome name="dollar" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('discount_price')}
                                        onBlur={handleBlur('discount_price')}
                                        placeholder="Discount Price"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={`${values.discount_price}`}
                                        keyboardType="number-pad"
                                    />
                                </Item>
                                <InputCheckBoxForm
                                    checked={values.promotionType === "percentage" ? true : false}
                                    error={errors.promotionType}
                                    onChecked={() => {
                                        setFieldValue('promotionType', values.promotionType === "percentage" ? "price" : "percentage")
                                    }}
                                >
                                    <Text>
                                        Select Percent Discount (%)
                                    </Text>
                                </InputCheckBoxForm>

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
        alignSelf: 'center',
        width: '80%',
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
        width: '80%',
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