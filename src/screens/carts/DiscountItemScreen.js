import { Toast } from 'native-base'
import React, { useContext } from 'react'
import { View } from 'react-native'
import { Header,Text } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
import DiscountForm from '../../components/carts/DiscountForm'
import { Context as SaleContext } from './../../context/SaleContext'

const DiscountItemScreen = ({ navigation }) => {

    const _orderDetail = navigation.getParam('_orderDetail')

    const { addDiscount } = useContext(SaleContext)

    return (
        <SafeAreaView style={{
            flex: 1
        }}>
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
                    text: 'Discount Item',
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <View style={{
                flex:1,
                justifyContent:'center',
            }}>
                <Text h2 style={{ alignSelf:'center', marginTop:20 }}>{_orderDetail.product.name}</Text>
                <DiscountForm
                    initialValue={{
                        discount: _orderDetail.discount,
                        price: _orderDetail.price,
                        id: _orderDetail.id,
                    }}
                    foodTitle={_orderDetail.product.name}
                    onSubmit={(value) => {
                        addDiscount(value.id, value).then(() => {
                            Toast.show({
                                text: "Apply the discount has successful.",
                                buttonText: "Okay",
                                type: "success",
                                onClose: () => {
                                    navigation.goBack()
                                }
                            });
                        }).catch(err => [
                            Toast.show({
                                text: err.message,
                                buttonText: "Okay",
                                type: "danger",
                            })
                        ])
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default withNavigation(DiscountItemScreen)