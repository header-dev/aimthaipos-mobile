import React, { useContext } from 'react'
import { StyleSheet, Text } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSavePartnerHook from '../../../hooks/useSavePartnerHook'
import PartnerForm from '../../../components/PartnerForm';
import { Context as PartnerContext } from './../../../context/PartnerContext'
import * as Yup from 'yup';
import { withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';
const PartnerFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    chargePrice: Yup.number()
        .required('Please enter a charge price.'),
    percentage: Yup.number()
        .required('Please enter a percentage.'),
});
const PartnerEditScreen = ({ navigation }) => {


    const { state: { isRejected, isLoading } } = useContext(PartnerContext)

    const _partner = navigation.getParam('_partner')

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
                    text: "Partner Edit",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <PartnerForm
                values={_partner}
                validateSchema={PartnerFormSchema}
                onSubmit={(photo, value) => {
                    value.id = _partner.id
                    savePartner(photo, value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(PartnerEditScreen)
