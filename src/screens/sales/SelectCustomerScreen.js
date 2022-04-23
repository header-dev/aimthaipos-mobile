import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Icon, ListItem, Image, Header, SearchBar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { Context as SaleContext } from "./../../context/SaleContext";
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import useDeletePartnerHook from './../../hooks/useDeletePartnerHook'
import { Alert } from 'react-native'
import { BACKEND_URL } from './../../constants'
import { navigate } from '../../navigationRef'
import CustomerModal from '../../components/sales/CustomerModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import backendApi from "./../../api/backend";

const SelectCustomerScreen = ({ navigation }) => {

    const { state: { isCustomerLoading, customers }, updateOrder, fetchCustomer } = useContext(SaleContext)
    const _id = navigation.getParam("_id");

    const [customer, setCustomer] = useState("")

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => {
            updateOrder(_id, {
                customerId: item.id
            })
                .then(() => {
                    return backendApi.get(`/sale/order/${_id}`);
                })
                .then(async (result) => {
                    await AsyncStorage.setItem("currentOrder", JSON.stringify(result.data));
                    navigate("rootSaleFlow");
                })
        }}>
            <ListItem.Content>
                <ListItem.Title h4>Name : {item.name}</ListItem.Title>
                <ListItem.Subtitle>Tel. : {item.tel}</ListItem.Subtitle>
                <ListItem.Subtitle>Mobile : {item.mobile}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
                fetchCustomer(customer)
            }} />
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
                    text: `Select Customer`,
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "#fff",
                    onPress: () => {
                        navigate("CreateCustomer")
                    },
                }}
            />
            <SearchBar
                placeholder="Find Name..."
                lightTheme
                round
                onChangeText={(search) => {
                    fetchCustomer(search)
                    setCustomer(search)
                }}
                value={customer}
            />
            {isCustomerLoading && (
                <ActivityIndicator animating />
            )}
            <FlatList
                refreshing={isCustomerLoading}
                keyExtractor={keyExtractor}
                data={customers}
                renderItem={(item) => renderItem(item)}
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

export default withNavigation(SelectCustomerScreen)