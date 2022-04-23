import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Header } from 'react-native-elements'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { Context as SaleContext } from './../../context/SaleContext'
import { Context as PrinterContext } from './../../context/PrinterContext'
import { Context as AuthContext } from './../../context/AuthContext'
import {
    NetPrinter
} from "react-native-thermal-receipt-printer-image-qr";
import moment from 'moment'
import { menuItem } from '../../utils/DisplayUtil'
import currency from 'currency.js'
import _ from 'lodash'
import { Alert } from 'react-native'
import { Toast } from 'native-base'
const BOLD_ON = '\x1b\x45\x01';
const BOLD_OFF = '\x1b\x45\x00';
const CENTER_ON = '\x1b\x61\x01';
const CENTER_OFF = '\x1b\x61\x00';

const FinalScreen = ({ navigation }) => {

    const _orderId = navigation.getParam('_orderId')
    const _payReceive = navigation.getParam('_payReceive')
    const _returnAmount = navigation.getParam('_returnAmount')
    const _paymentType = navigation.getParam('_paymentType')

    const {
        state: { user },
    } = useContext(AuthContext);

    const { getBillPrinter } = useContext(PrinterContext)
    const {
        state: { order }, fetchOrderById, clearCurrentOrder,
    } = useContext(SaleContext);

    const [printer, setPrinter] = useState(null)
    const [printerConnected, setPrinterConnected] = useState(false)


    useEffect(() => {
        getBillPrinter().then(async result => {
            const value = JSON.parse(result);
            if (value) {
                await NetPrinter.init()
                await NetPrinter.connectPrinter(value.ipAddress || "", value.port || 9100).then(result => {
                    if (result.includes('Connected')) {
                        setPrinter(value)
                        setPrinterConnected(true)
                    } else {
                        setPrinter(null)
                        setPrinterConnected(false)
                    }
                })
            } else {
                Toast.show({
                    text: 'The printer not found, Please re-check your config again.',
                    type: 'warning'
                })
            }
        })

        return () => {

        };
    }, []);

    const printBill = () => {

        const _tableNo = order
            .tableTransactions.map((e) => e.table.table_name)
            .join(",")
        const totalAmount = _.sumBy(order.orderDetails, "totalAmount")
        const serviceCharge = (order.serviceCharge / 100) * totalAmount
        const cardCharge = (order.cardCharge / 100) * totalAmount
        const total = totalAmount + serviceCharge + cardCharge - order.promotionAmount + order.tip
        let allContent = ``
        allContent += `${CENTER_ON}${BOLD_ON}BILL${BOLD_OFF}${CENTER_OFF}\n================================\n`
        allContent += `${moment().format('DD/MM/YYYY HH:mm')}\nNo.${order.orderNo}\n`

        let contentType = ``
        if (order.orderType === 'take-away') {
            contentType = `Take Away`
        } else if (order.orderType === 'delivery') {
            contentType = `Delivery`
        } else if (order.orderType === 'partner') {
            contentType = `Customer: ${order.remark}\n`
            contentType += `Partner: ${order.partner.name}`
        } else {
            contentType = `Table: ${_tableNo}`
        }

        allContent += `Service : ${user ? user.username : ''}\n${contentType}\n`
        allContent += `================================\n${CENTER_ON}${BOLD_ON}Description${BOLD_OFF}${CENTER_OFF}\n================================\n`
        let contentProduct = ``
        let contentPartner = ``
        if (order.orderType === 'partner') {
            contentPartner = `(${parseFloat(order.partner.chargePrice).toFixed(2)})`
        }
        order.orderDetails.map(i => {
            contentProduct += `${menuItem(i.product.name.substring(0, 7), `${i.quantity} x ${currency(i.priceAdditionPrice, { separator: "," }).format()}${contentPartner} = ${currency(i.totalAmount, { separator: "," }).format()}`)}\n`
        })
        allContent += contentProduct

        let paymentDetail = ``
        if (_paymentType === 'cash') {
            paymentDetail = `Cash : ${currency(_payReceive,
                {
                    separator: ",",
                }
            ).format()}\nChange : ${currency(_returnAmount,
                {
                    separator: ",",
                }
            ).format()}\n`
        } else if (_paymentType === 'card') {
            paymentDetail = `Card : ${currency(total,
                {
                    separator: ",",
                }
            ).format()}\n`
        } else if (_paymentType === 'pay-id') {
            paymentDetail = `Pay ID : ${currency(total,
                {
                    separator: ",",
                }
            ).format()}\n`
        } else if (_paymentType === 'take-away') {
            paymentDetail = `Take Away : ${currency(total,
                {
                    separator: ",",
                }
            ).format()}\n`
        } else if (order.paymentType === 'partner') {
            paymentDetail = `${order.partner.name} : ${currency(total,
                {
                    separator: ",",
                }
            ).format()}\n`
        }

        let cardChargeContent = `Card Charge: ${order.cardCharge}(%)\n`

        allContent += `<C>================================\nSub-Total : ${currency(parseFloat(totalAmount), {
            separator: ",",
        }).format()}\nPromo Discount: -${currency(order.promotionAmount, {
            separator: ",",
        }).format()}\nService : ${order.serviceCharge}(%)\n${cardChargeContent}Adjustment : ${currency(order.tip,
            {
                separator: ",",
            }
        ).format()}\nTotal : ${currency(total,
            {
                separator: ",",
            }
        ).format()}\n${paymentDetail}================================</C>\n`



        allContent += `${CENTER_ON}${BOLD_ON}Thank you for choosing Aim Thai${BOLD_OFF}${CENTER_OFF}\n`
        NetPrinter.printBill(allContent)
    }

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents
                onWillFocus={() => {
                    fetchOrderById(_orderId)
                }}
            />
            <Header
                placement="center"
                leftComponent={{
                    icon: "arrow-back",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
                centerComponent={{
                    text: "Payment Successfull",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                containerStyle={{
                    backgroundColor: "#2E7C31",
                }}
            />
            <View style={styles.contentButton}>
                <Button
                    icon={{
                        name: "print",
                        size: 20,
                        color: "white",
                        type: "font-awensome"
                    }}
                    title="Print"
                    containerStyle={styles.buttonPrint}
                    buttonStyle={{
                        backgroundColor: "orange",
                        height: 60
                    }}
                    onPress={() => {
                        Alert.alert(
                            "Confirm",
                            "Are you sure you want to print bill / receipt ?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => { },
                                    style: "cancel"
                                },
                                {
                                    text: "OK", onPress: () => {
                                        if (printerConnected) {
                                            printBill()
                                        } else {
                                            Toast.show({
                                                text: 'The printer is not response, Please re-check your printer status agian.',
                                                type: 'warning',
                                                buttonText: 'Okey'
                                            })
                                        }
                                    }
                                }
                            ]
                        );
                    }}
                />
                <Button
                    icon={{
                        name: "home",
                        size: 20,
                        color: "white",
                        type: "font-awensome"
                    }}
                    title="Back to Order List"
                    containerStyle={styles.buttonHome}
                    buttonStyle={{
                        height: 60
                    }}
                    onPress={() => {
                        clearCurrentOrder()
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contentButton: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', padding: 20 },
    buttonHome: {
        margin: 10,
    },
    buttonPrint: {
        margin: 10,
    }
})

export default withNavigation(FinalScreen)