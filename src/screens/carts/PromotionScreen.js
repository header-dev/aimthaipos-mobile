import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Icon, ListItem, Image, Header } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { Context as PromotionContext } from './../../context/PromotionContext'
import { Context as SaleContext } from './../../context/SaleContext'
import { navigate } from '../../navigationRef'
import { Entypo, AntDesign, Foundation } from '@expo/vector-icons';
import { Alert } from 'react-native'

const PromotionScreen = ({ navigation }) => {

    const { state: { promotions, isLoading, isRejected }, fetchPromotion } = useContext(PromotionContext)
    const { updateOrder } = useContext(SaleContext)

    const _orderId = navigation.getParam('_orderId')
    const _amount = navigation.getParam('_amount')

    const clearPromotion = () => {
        updateOrder(_orderId, {
            promotionAmount: 0
        }).then(() => {
            navigation.goBack()
        })
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem key={item.id} bottomDivider onPress={() => {
            updateOrder(_orderId, {
                promotionAmount: item.promotionType === "percentage" ? (_amount / 100) * item.discount_percentage : item.discount_price,
                promotionId: item.id
            }).then(() => {
                navigation.goBack()
            })
        }}>
            <Foundation name="burst-sale" size={50} color='#517fa4' />
            <ListItem.Content>
                <ListItem.Title>Promotion Name : {item.name}</ListItem.Title>
                {item.promotionType === "percentage" ?
                    <ListItem.Subtitle>Discount (%): {item.discount_percentage} %</ListItem.Subtitle>
                    : <ListItem.Subtitle>Price : {item.discount_price} $</ListItem.Subtitle>
                }
            </ListItem.Content>
        </ListItem>
    )

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
                fetchPromotion("")
            }} />
            <Header
                placement="center"
                containerStyle={{
                    backgroundColor: "#2E7C31"
                }}
                leftComponent={{
                    icon: "arrow-back",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack()
                    },
                }}
                centerComponent={{
                    text: 'Promotion / Discount',
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "cancel",
                    color: "#fff",
                    onPress: () => {
                        clearPromotion()
                    },
                }}
            />
            {isLoading && (
                <ActivityIndicator style={{ margin: 10 }} animating />
            )}
            <FlatList
                keyExtractor={keyExtractor}
                data={promotions}
                renderItem={(item) => renderItem(item)}
                removeClippedSubviews={true} // Unmount components when outside of window
                // initialNumToRender={2} // Reduce initial render amount
                // maxToRenderPerBatch={1} // Reduce number in each render batch
                // updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    loading: {
        marginTop: 10
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },
});

export default withNavigation(PromotionScreen)