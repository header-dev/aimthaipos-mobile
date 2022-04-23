import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSavePartnerHook from '../../../hooks/useSavePartnerHook'

import { Context as PartnerContext } from './../../../context/PartnerContext'

import PartnerForm from '../../../components/PartnerForm';
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
const PartnerFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    chargePrice: Yup.string()
        .required('Please enter a charge price.'),
    percentage: Yup.number()
        .required('Please enter a percentage.'),
});
const PartnerCreateScreen = ({ navigation }) => {

    const { state: { isRejected, isLoading } } = useContext(PartnerContext)

    const [savePartner] = useSavePartnerHook()

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
                    text: "Partner Create",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <PartnerForm
                values={{
                    id: "",
                    name: "",
                    chargePrice: "",
                }}
                validateSchema={PartnerFormSchema}
                onSubmit={(image, value) => {
                    savePartner(image, value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(PartnerCreateScreen)
