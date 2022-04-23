import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";

import { Context as SaleContext } from './../../context/SaleContext'
import { Context as AuthContext } from './../../context/AuthContext'
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import CashDrawerForm from '../../components/sales/CashDrawerForm';

const InitialDrawerFormSchema = Yup.object().shape({
    cash: Yup.number().positive('Please enter a cash.').required('Please enter a cash.'),
});

const CashDrawerScreen = ({ navigation }) => {

    const {
        state: {
            orders,
            isLoadingOrder,
            isInitCashDrawerDetail,
            isLoadingInitCashDrawer,
        },
        saveInitCashDrawer,
    } = useContext(SaleContext);

    const {
        state: { user },
        getUser,
        signout,
    } = useContext(AuthContext);


    return (
        <Container style={{ backgroundColor: "#fff" }}>
            <Header
                placement="center"
                containerStyle={{
                    backgroundColor: "#2E7C31",
                }}
                centerComponent={{
                    text: "Cash Drawer (1st order)",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "cancel",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
            />
            <Body>
                <CashDrawerForm
                    values={{
                        cash: '0.00',
                        status: "open"
                    }}
                    validateSchema={InitialDrawerFormSchema}
                    onSubmit={(value) => {
                        value.userId = user.id;
                        saveInitCashDrawer(value, navigation);
                    }}
                />
            </Body>
        </Container>
    )
}

export default withNavigation(CashDrawerScreen)
