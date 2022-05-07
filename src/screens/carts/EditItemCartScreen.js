import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { View, StyleSheet } from 'react-native'
import { Header, Button, Text, Image } from 'react-native-elements'
import InputSpinner from 'react-native-input-spinner'
import { Divider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Context as SaleContext } from './../../context/SaleContext'
import { withNavigation } from 'react-navigation'
import { MENU_IMAGE } from '@env'
import { Toast } from 'native-base'
import { Alert } from 'react-native'
import { navigate } from '../../navigationRef'

const EditItemCartScreen = ({ navigation }) => {

    const _orderDetail = navigation.getParam("_orderDetail")
    const _orderId = navigation.getParam('_orderId')
    const _totalDetail = navigation.getParam('_totalDetail')

    const [quantity, setQuantity] = useState(_orderDetail.quantity);

    const { updateOrderDetail, deleteOrderDetail } = useContext(SaleContext);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                placement="center"
                containerStyle={{
                    backgroundColor: "#2E7C31",
                }}
                leftComponent={{
                    icon: "arrow-back",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack()
                    },
                }}
                centerComponent={{
                    text: 'Edit Item',
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "sale",
                    type: "material-community",
                    color: "#fff",
                    onPress: () => {
                        navigate("DiscountItem", {
                            _orderDetail: _orderDetail
                        })
                    },
                }}
            />
            <View style={styles.sectionInput}>
                <Image
                    style={{ width: 200, height: 200 }}
                    resizeMode="stretch"
                    source={{ uri: `${MENU_IMAGE}${_orderDetail.product.photo}` }}
                    PlaceholderContent={<ActivityIndicator />}
                />
            </View>
            <View style={styles.sectionInput}>
                <Text h2>{_orderDetail.product.name}</Text>
            </View>
            <Divider />
            <View style={styles.sectionInput}>
                <InputSpinner
                    max={100}
                    min={0}
                    step={1}
                    width={300}
                    colorMax={"#f04048"}
                    colorMin={"#40c5f4"}
                    value={quantity}
                    onChange={(num) => {
                        setQuantity(num)
                    }}
                />
            </View>
            <View style={styles.sectionButton}>
                <Button
                    title={quantity === 0 ? "Remove" : "Update"}
                    buttonStyle={[styles.buttonUpdate, {
                        backgroundColor: quantity === 0 ? "red" : "blue"
                    }]}
                    onPress={() => {
                        if (quantity > 0) {
                            updateOrderDetail(_orderDetail.id, {
                                quantity: quantity
                            }, _orderId).then(() => {
                                Toast.show({
                                    text:
                                        "The item has been updated.",
                                    buttonText: "Okay",
                                    type: "success",
                                    onClose: () => {
                                        navigation.goBack()
                                    }
                                });
                            })

                        } else {
                            Alert.alert(
                                "Remove Item",
                                "Are you sure you want to remove this item ?",
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => { },
                                        style: "cancel",
                                    },
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            deleteOrderDetail(_orderDetail.id).then(() => {
                                                Toast.show({
                                                    text:
                                                        "The item has been removed.",
                                                    buttonText: "Okay",
                                                    type: "success",
                                                    onClose: () => {
                                                        if (_totalDetail === 1) {
                                                            navigate("Sale")
                                                        } else {
                                                            navigation.goBack()
                                                        }
                                                    }
                                                });
                                            });
                                        },
                                    },
                                ],
                                { cancelable: false }
                            );
                        }

                    }}
                />
                {_orderDetail.product.categoryId !== 11 && <Button
                    title={_orderDetail.makeTakeAway ? "Cancel Take Away" : "Take Away"}
                    buttonStyle={[styles.buttonUpdate, {
                        backgroundColor: _orderDetail.makeTakeAway ? "#EE82EE" : "orange"
                    }]}
                    onPress={() => {
                        updateOrderDetail(
                            _orderDetail.id,
                            {
                                makeTakeAway: !_orderDetail.makeTakeAway,
                            },
                            _orderId
                        ).then(() => {
                            Toast.show({
                                text:
                                    "The item has been take away maked.",
                                buttonText: "Okay",
                                type: "success",
                                onClose: () => {
                                    navigation.goBack()
                                }
                            });
                        })
                    }}
                />}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonUpdate: {
        width: '100%',
        margin: 10
    },
    sectionButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20,
    },
    sectionInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
    }
})

export default withNavigation(EditItemCartScreen)