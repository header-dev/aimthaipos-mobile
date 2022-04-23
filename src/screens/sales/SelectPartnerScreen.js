import React, { useContext } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Avatar, Icon, ListItem, Image, Header } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { Context as PartnerContext } from './../../context/PartnerContext'
import { BACKEND_URL } from './../../constants'
import { navigate } from '../../navigationRef'
import currency from 'currency.js'

const SelectPartnerScreen = ({ navigation }) => {

    const { state: { partners, isLoading, isRejected }, fetchPartner, } = useContext(PartnerContext)
    const _id = navigation.getParam("_id");

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => {
            navigate("CustomerOption", {
                partnerId: item.id,
                orderId: _id
            })
        }}>
            <Image
                source={{ uri: `${BACKEND_URL}/api/ver1/image/partners/${item.logo}` }}
                style={{ width: 100, height: 100 }}
                PlaceholderContent={<ActivityIndicator />}
            />
            <ListItem.Content>
                <ListItem.Title>Name : {item.name}</ListItem.Title>
                <ListItem.Subtitle>Charge Price : {currency(item.chargePrice,{ separator:',' }).format()}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
                fetchPartner("")
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
                    text: `Select Partner`,
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            {isLoading && (
                <ActivityIndicator animating />
            )}
            <FlatList
                keyExtractor={keyExtractor}
                data={partners}
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

export default withNavigation(SelectPartnerScreen)