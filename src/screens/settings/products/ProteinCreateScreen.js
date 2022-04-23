import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSaveProteinHook from '../../../hooks/useSaveProteinHook'
import { Context as ProteinContext } from './../../../context/ProteinContext'
import ProteinForm from '../../../components/ProteinForm';

import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

const ProteinFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    addition_price: Yup.number()
        .required('Please enter a addition price.'),
});
const ProteinCreateScreen = ({ navigation }) => {

    const { state: { isRejected, isLoading } } = useContext(ProteinContext)

    const [saveProtein] = useSaveProteinHook()

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
                    text: "Protein Create",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
                <ProteinForm
                    values={{
                        id: "",
                        name: ""
                    }}
                    validateSchema={ProteinFormSchema}
                    onSubmit={(value) => {
                        saveProtein(value)
                    }}
                    isLoading={isLoading}
                />
        </Container>
    )
}

export default withNavigation(ProteinCreateScreen)
