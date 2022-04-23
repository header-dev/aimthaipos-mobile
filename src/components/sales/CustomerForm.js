import React, { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
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
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { navigate } from '../../navigationRef';

var width = Dimensions.get("window").width;

export default function CustomerForm({
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
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.tel && touched.tel)} >
                                    <MaterialIcons name="phone" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('tel')}
                                        onBlur={handleBlur('tel')}
                                        placeholder="Tel."
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.tel}
                                        keyboardType="phone-pad"
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.mobile && touched.mobile)} >
                                    <MaterialIcons name="mobile-friendly" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('mobile')}
                                        onBlur={handleBlur('mobile')}
                                        placeholder="Mobile"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.mobile}
                                        keyboardType="phone-pad"
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.address && touched.address)} >
                                    <FontAwesome5 name="address-card" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        placeholder="Address"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.address}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.city && touched.city)} >
                                    <FontAwesome5 name="address-card" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('city')}
                                        onBlur={handleBlur('city')}
                                        placeholder="City"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.city}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.state && touched.state)} >
                                    <MaterialIcons name="format-list-numbered" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('state')}
                                        onBlur={handleBlur('state')}
                                        placeholder="State"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.state}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.postalcode && touched.postalcode)} >
                                    <MaterialIcons name="local-post-office" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('postalcode')}
                                        onBlur={handleBlur('postalcode')}
                                        placeholder="Postel"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.postalcode}
                                        keyboardType="number-pad"
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
        width: width * 0.80,
        shadowRadius: 5,
        marginBottom: 10,
        // borderColor: '#a4a4a4',
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