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
import TipForm from '../../components/sales/TipForm';


const TipScreen = ({ navigation }) => {

    const _order = navigation.getParam("_order");

    const {
        state: {
            orders,
            isLoadingOrder,
            isInitCashDrawerDetail,
            isLoadingInitCashDrawer,
        },
        updateOrder,
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
                    text: "Adjustment",
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
                <TipForm
                    values={{
                        tip: `${_order.tip ? _order.tip : 0.00}`,
                    }}
                    validateSchema={null}
                    onSubmit={(value) => {
                        value.userId = user.id;
                        updateOrder(_order.id, value).then(() => {
                            navigation.goBack()
                        });
                    }}
                />
            </Body>
        </Container>
    )
}

export default withNavigation(TipScreen)
