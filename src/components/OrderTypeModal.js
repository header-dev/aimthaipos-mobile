import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable } from "react-native";
import { Divider, Input, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    Text,
    View,
    Form,
} from "native-base";
import { Formik } from 'formik';
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Yup from 'yup';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

const InitialDrawerFormSchema = Yup.object().shape({
    cash: Yup.number()
        .required('Please enter a cash.'),
});

const OrderTypeModal = ({ showModal, handleClose, onSubmit }) => {

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeaderText}>Order Type</Text>
                        <Divider style={{ backgroundColor: 'black', width: 200, marginBottom: 10 }} />
                        <Form style={{ width: 200 }}>
                            <View>
                                {/* <ListItem key={1} bottomDivider onPress={() => { onSubmit('dine-in') }}>
                                    <ListItem.Content>
                                        <ListItem.Title style={{
                                            color: '#2E7C31'
                                        }}>Dine In</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                                <ListItem key={2} bottomDivider onPress={() => { onSubmit('take-away') }}>
                                    <ListItem.Content>
                                        <ListItem.Title style={{
                                            color: '#F5A623'
                                        }}>Take Away</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                                <ListItem key={3} bottomDivider onPress={() => { onSubmit('delivery') }}>
                                    <ListItem.Content>
                                        <ListItem.Title style={{
                                            color: '#2160D3'
                                        }}>Delivery</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem> */}
                            </View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: 'center'
                            }}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={handleClose}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                            </View>
                        </Form>
                    </View>

                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputLogin: {
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        borderColor: '#a4a4a4',
        color: '#a4a4a4',
        width: '100%'
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
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 100
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
        textAlign: "center"
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center"
    },
    modalHeaderText: {
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold"
    }
});

export default OrderTypeModal