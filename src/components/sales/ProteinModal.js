import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable } from "react-native";
import { Divider, Input, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
    Radio
} from "native-base";
import { Formik } from 'formik';
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Yup from 'yup';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

const formSchema = Yup.object().shape({
    proteinId: Yup.number()
        .required('Please choose a protein.'),
});

const ProteinModal = ({ showModal, handleClose, onSubmit, data }) => {
    let formValue = {
        id: 1
    }
    if (data !== undefined) {
        [formValue] = [...data]
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeaderText}>Protein</Text>
                        <Divider style={{ backgroundColor: 'black', width: 200, marginBottom: 10 }} />
                        <Formik
                            initialValues={{
                                // proteinId: formValue ? formValue.id : null,
                                protein: null
                            }}
                            enableReinitialize
                            onSubmit={values => {
                                onSubmit(values)
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <Form style={{ width: 200 }}>
                                    <View>
                                        <RadioGroup
                                            onSelect={(index, value) => {
                                                setFieldValue("protein", value)
                                            }}
                                            selectedIndex={0}
                                        >
                                            {data && data.map(i => (
                                                <RadioButton value={i}>
                                                    <Text>{i.name}</Text>
                                                </RadioButton>
                                            ))}
                                        </RadioGroup>
                                        <Text style={{ color: "red" }}>{errors.protein}</Text>
                                    </View>
                                    <Divider style={{ backgroundColor: 'black', width: 200, marginBottom: 10 }} />
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: 'center'
                                    }}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={handleSubmit}
                                        >
                                            <Text style={styles.textStyle}>OK</Text>
                                        </Pressable>
                                        <Divider style={{ backgroundColor: 'black', width: 30, marginBottom: 10, bottom: -20, transform: [{ rotate: '90deg' }] }} />
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={handleClose}
                                        >
                                            <Text style={styles.textStyle}>Cancel</Text>
                                        </Pressable>
                                    </View>
                                </Form>
                            )}
                        </Formik>
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

export default ProteinModal