import React, { useContext } from 'react'
import { FlatList } from 'react-native'
import { View } from 'react-native'
import { Header, ListItem, Text } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context as ProteinContext } from './../../context/ProteinContext'
import { Context as SaleContext } from "./../../context/SaleContext";
import { ActivityIndicator } from 'react-native'
import currencyJs from 'currency.js'
import { Alert } from 'react-native'
import { navigate } from '../../navigationRef'

const SelectProteinScreen = ({ navigation }) => {

    const menu = navigation.getParam('menu')
    const _orderId = navigation.getParam('_orderId')
    const _makeTakeAway = navigation.getParam('_makeTakeAway')
    const _partnerPrice = navigation.getParam('_partnerPrice')
    const _quantity = navigation.getParam('_quantity')

    const {
        state: { proteins, isLoading, isRejected },
        fetchProtein,
    } = useContext(ProteinContext);

    const keyExtractor = (item, index) => index.toString();

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => {
            Alert.alert(
                "Confirmation",
                "Are you sure you want to select this protein ?",
                [
                    {
                        text: "Cancel",
                        onPress: () => { },
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            const { id, addition_price } = item
                            navigate("SaleRequest", {
                                _menu: menu,
                                _proteinId: id,
                                _addition_price: addition_price,
                                _orderId: _orderId,
                                _makeTakeAway: _makeTakeAway,
                                _partnerPrice: _partnerPrice,
                                _quantity: _quantity
                            });
                        },
                    },
                ],
                { cancelable: false }
            );
        }}>
            <MaterialCommunityIcons name="food-steak" size={50} color="#517fa4" />
            <ListItem.Content>
                <ListItem.Title>Protein Name : {item.name}</ListItem.Title>
                <ListItem.Subtitle>Addition Price : {currencyJs(item.addition_price, {
                    separator: ','
                }).format()}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );


    return (
        <SafeAreaView style={{
            flex: 1
        }}>
            <NavigationEvents
                onWillFocus={() => {
                    fetchProtein("")
                }}
            />
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
                    text: `Select Protein`,
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "close",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
            />
            {isLoading && <ActivityIndicator style={{ margin: 10 }} animating />}
            <FlatList
                keyExtractor={keyExtractor}
                data={proteins}
                renderItem={(item) => renderItem(item)}
            />
        </SafeAreaView>
    )
}

export default withNavigation(SelectProteinScreen)