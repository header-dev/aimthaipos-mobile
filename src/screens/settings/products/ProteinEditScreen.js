import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSaveProteinHook from '../../../hooks/useSaveProteinHook'
import ProteinForm from '../../../components/ProteinForm';
import { Context as ProteinContext } from './../../../context/ProteinContext'
import * as Yup from 'yup';
import { withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';
const ProteinFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    addition_price: Yup.number()
        .required('Please enter a addition price.'),
});
const ProteinEditScreen = ({ navigation }) => {


    const { state: { isRejected, isLoading } } = useContext(ProteinContext)

    const _protein = navigation.getParam('_protein')

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
                    text: "Protein Edit",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
                <ProteinForm
                    values={_protein}
                    validateSchema={ProteinFormSchema}
                    onSubmit={(value) => {
                        saveProtein(value)
                    }}
                    isLoading={isLoading}
                />
        </Container>
    )
}

export default withNavigation(ProteinEditScreen)
