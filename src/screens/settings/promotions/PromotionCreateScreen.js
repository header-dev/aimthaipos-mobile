import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSavePromotionHook from '../../../hooks/useSavePromotionHook'

import { Context as PromotionContext } from './../../../context/PromotionContext'

import PromotionForm from '../../../components/PromotionForm';
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
const PromotionFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    discount_percentage: Yup.string()
        .required('Please enter a discount percentage.')
});
const PromotionCreateScreen = ({ navigation }) => {

    const { state: { isRejected, isLoading } } = useContext(PromotionContext)

    const [savePromotion] = useSavePromotionHook()

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
                    text: "Promotion Create",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <PromotionForm
                values={{
                    id: "",
                    name: "",
                    discount_percentage: "",
                    discount_price: "",
                    promotionType: "price"
                }}
                validateSchema={PromotionFormSchema}
                onSubmit={(value) => {
                    savePromotion(value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(PromotionCreateScreen)
