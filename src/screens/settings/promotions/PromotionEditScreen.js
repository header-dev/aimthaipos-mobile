import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSavePromotionHook from '../../../hooks/useSavePromotionHook'
import PromotionForm from '../../../components/PromotionForm';
import { Context as PromotionContext } from './../../../context/PromotionContext'
import * as Yup from 'yup';
import { withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';
const PromotionFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    discount_percentage: Yup.string()
        .required('Please enter a discount percentage.'),
});
const PromotionEditScreen = ({ navigation }) => {


    const { state: { isRejected, isLoading } } = useContext(PromotionContext)

    const _promotion = navigation.getParam('_promotion')

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
                    text: "Promotion Edit",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <PromotionForm
                values={_promotion}
                validateSchema={PromotionFormSchema}
                onSubmit={(value) => {
                    savePromotion(value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(PromotionEditScreen)
