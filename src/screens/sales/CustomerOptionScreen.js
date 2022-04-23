import AsyncStorage from '@react-native-async-storage/async-storage'
import { Body, Container } from 'native-base'
import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { Header } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
import CustomerInfoForm from '../../components/sales/CustomerInfoForm'
import { Context as SaleContext } from "./../../context/SaleContext";
import backendApi from './../../api/backend'
import { navigate } from '../../navigationRef'

const CustomerOptionScreen = ({ navigation }) => {

    const partnerId = navigation.getParam('partnerId')
    const orderId = navigation.getParam('orderId')

    const { updateOrder } = useContext(SaleContext)

    return (
        <SafeAreaView style={{
            flex: 1
        }}>
            <Container>
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
                        text: "Customer Info (Optional)",
                        style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                    }}
                />
                <Body>
                    <CustomerInfoForm
                        values={{
                            remark: "",
                        }}
                        onSubmit={(value) => {
                            updateOrder(orderId, {
                                partnerId: partnerId,
                                remark: value.remark
                            }).then(() => {
                                return backendApi.get(`/sale/order/${orderId}`);
                            })
                                .then(async (result) => {
                                    await AsyncStorage.setItem("currentOrder", JSON.stringify(result.data));
                                    navigate("rootSaleFlow");
                                })
                        }}
                        onSkip={() => {
                            updateOrder(orderId, {
                                partnerId: partnerId
                            }).then(() => {
                                return backendApi.get(`/sale/order/${orderId}`);
                            })
                                .then(async (result) => {
                                    await AsyncStorage.setItem("currentOrder", JSON.stringify(result.data));
                                    navigate("rootSaleFlow");
                                })
                        }}
                    />
                </Body>
            </Container>
        </SafeAreaView>
    )
}

export default withNavigation(CustomerOptionScreen)