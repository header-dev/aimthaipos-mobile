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
import {
    COMMANDS,
    NetPrinter
} from "react-native-thermal-receipt-printer-image-qr";

import * as Permissions from 'expo-permissions';

var width = Dimensions.get("screen").width;

const BOLD_ON = '\x1b\x45\x01';
const BOLD_OFF = '\x1b\x45\x00';
const CENTER_TEXT = '\x1b\x61\x01'

export default function PrinterForm({
    values,
    validateSchema,
    onSubmit,
    isLoading
}) {
    const [disableSave, setDisableSave] = useState(true)

    const [printerConnect, setPrinterConnect] = useState(false);


    useEffect(() => {
        async function getPermissionBluetooth() {
            const { status } = await Permissions.getAsync(Permissions.MOTION);
            if (status !== 'granted') {
                alert('Hey! You might want to enable bluetooth for my app, they are good.');
            }
        }
        getPermissionBluetooth()

        return () => {

        }
    }, [])


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
                                    <Text style={{ margin: 5, color: 'red' }}>{errors.name}</Text>
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.ipAddress && touched.ipAddress)}>
                                    <FontAwesome5 name="network-wired" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('ipAddress')}
                                        onBlur={handleBlur('ipAddress')}
                                        placeholder="IP Address"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={String(values.ipAddress)}
                                        keyboardType="decimal-pad"
                                    />
                                    <Text style={{ margin: 5, color: 'red' }}>{errors.ipAddress}</Text>
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.port && touched.port)} >
                                    <FontAwesome5 name="network-wired" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('port')}
                                        onBlur={handleBlur('port')}
                                        placeholder="PORT"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={String(values.port)}
                                        keyboardType="decimal-pad"
                                    />
                                    <Text style={{ margin: 5, color: 'red' }}>{errors.port}</Text>
                                </Item>
                            </Form>
                            <Button
                                rounded
                                block
                                onPress={handleSubmit}
                                style={[styles.button_auth]}
                                disabled={Boolean(errors.ipAddress || errors.port || errors.name)}
                            >
                                {isLoading && (<ActivityIndicator animating />)}
                                <Text>Save</Text>
                            </Button>
                            <Button
                                rounded
                                block
                                disabled={Boolean(errors.ipAddress || errors.port || errors.name)}
                                onPress={async () => {
                                    if (values.ipAddress && values.port) {
                                        try {
                                            await NetPrinter.init()
                                            await NetPrinter.connectPrinter(values.ipAddress || '', values.port || 9100)
                                            setPrinterConnect(true)
                                            await NetPrinter.printBill(`${COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT}${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}Print ${values.name} Test${COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF}`, {
                                                cut: true
                                            })
                                        } catch (error) {
                                            setPrinterConnect(false)
                                            Toast.show({
                                                text: error,
                                                buttonText: "Okay",
                                                type: "warning",
                                            });
                                        }
                                    }

                                }}
                                style={[styles.buttonPrint, {
                                    backgroundColor: Boolean(errors.ipAddress || errors.port || errors.name) ? "grey" : 'blue'
                                }]}
                            >
                                <Text>Print Test</Text>
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
    buttonPrint: {
        alignSelf: 'center',
        width: '80%',
        backgroundColor: "blue",
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