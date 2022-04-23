import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body,
    Toast
} from "native-base";
import useSavePrinterHook from '../../../hooks/useSavePrinterHook'
import { Context as PrinterContext } from './../../../context/PrinterContext'
import * as Yup from 'yup';
import { withNavigation } from 'react-navigation';
import { Header, Text } from 'react-native-elements';
import PrinterForm from '../../../components/PrinterForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProteinFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    ipAddress: Yup.string().required('Please enter a IP Address.').matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
        message: 'Invalid IP address',
        excludeEmptyString: true
    }).test('ip', 'Invalid IP address', value => {
        return value === undefined || value.trim() === ''
            ? true
            : value.split('.').find(i => parseInt(i, 10) > 255) === undefined;
    }),
    port: Yup.number().required('Please enter a port.')
});

const PrinterKitchenEditScreen = ({ navigation }) => {

    const [data, setData] = useState({
        name: "",
        ipAddress: "",
        port: 9100,
    })

    useEffect(() => {
        retrieveData()
        return () => { }
    }, [])

    const retrieveData = async () => {
        try {
            const valueString = await AsyncStorage.getItem('bill_printer');
            if (valueString) {
                const value = JSON.parse(valueString);
                setData(value);
            }
        } catch (error) {
            
        }
    };

    const saveData = async (value) => {
        try {
            await AsyncStorage.setItem('bill_printer', JSON.stringify(value));
            Toast.show({
                text: 'The printer has been successfully.',
                buttonText: "Okay",
                type: "success",
            });
        } catch (error) {
            Toast.show({
                text: error.message,
                buttonText: "Okay",
                type: "warning",
            });
        }
    }

    return (
        <Container style={{ backgroundColor: "#fff" }}>
            <Header
                placement="center"
                containerStyle={{
                    backgroundColor: "#2E7C31",
                }}
                leftComponent={{
                    icon: "arrow-back",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
                centerComponent={{
                    text: "Bill / Receipt Printer Preferences",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <PrinterForm
                    values={data}
                    validateSchema={ProteinFormSchema}
                    onSubmit={(value) => {
                        saveData(value)
                    }}
                />
        </Container>
    )
}

export default withNavigation(PrinterKitchenEditScreen)
