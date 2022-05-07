import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Button, Card, Header, Icon, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationEvents, withNavigation } from 'react-navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrinterSettingScreen = ({ navigation }) => {

    const [kitchenPrinter, setKitchenPrinter] = useState({
        name: "",
        ipAddress: "",
        port: 9100,
    })
    const [receiptPrinter, setReceiptPrinter] = useState({
        name: "",
        ipAddress: "",
        port: 9100,
    })

    const list = [
        {
            title: "Receipt Printer",
            subTitle: receiptPrinter,
            icon: "printer",
            type: "material-community",
            button: false,
            action: () => {
                navigation.navigate("PrinterBillEdit");
            },
        },
        {
            title: "Kitchen Printer",
            subTitle: kitchenPrinter,
            icon: "printer",
            type: "material-community",
            button: false,
            action: () => {
                navigation.navigate("PrinterKitchenEdit");
            },
        }
    ];

    const retrieveData = async () => {
        try {
            let kitchenPrinter = await AsyncStorage.getItem('kitchen_printer');
            let receiptPrinter = await AsyncStorage.getItem('bill_printer');
            if (kitchenPrinter) {
                setKitchenPrinter(JSON.parse(kitchenPrinter))
            }
            if (receiptPrinter) {
                setReceiptPrinter(JSON.parse(receiptPrinter))
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={item.action}>
            <Icon name={item.icon} type={item.type} />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight:'bold' }}>{item.title}</ListItem.Title>
                {item.subTitle && <ListItem.Subtitle style={{ color: 'grey' }}>IP Address : {item.subTitle.ipAddress}, Port : {item.subTitle.port}</ListItem.Subtitle>}
            </ListItem.Content>
            {!item.button && <ListItem.Chevron />}
        </ListItem>
    );

    const keyExtractor = (item, index) => index.toString();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationEvents 
                onWillFocus={() => {
                    retrieveData()
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
                    text: "Printer",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <View style={styles.container}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={list}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
        // <SafeAreaView style={{ flex: 1 }}>
        //     <Header
        //         placement="center"
        //         containerStyle={{
        //             backgroundColor: "#2E7C31",
        //         }}
        //         leftComponent={{
        //             icon: "arrow-back",
        //             color: "#fff",
        //             onPress: () => {
        //                 navigation.goBack();
        //             },
        //         }}
        //         centerComponent={{
        //             text: "Settings Printer",
        //             style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        //         }}
        //     />
        //     <Card>
        //         <Card.Title>Receipt Printer</Card.Title>
        //         <Card.Divider />
        //         <Button
        //             icon={<Icon name='settings' color='#ffffff' />}
        //             buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
        //             onPress={() => {
        //                 navigation.navigate('PrinterBillEdit')
        //             }}
        //             title='Configuration' />
        //     </Card>
        //     <Card>
        //         <Card.Title>Kitchen Printer</Card.Title>
        //         <Card.Divider />
        //         <Button
        //             icon={<Icon name='settings' color='#ffffff' />}
        //             buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
        //             onPress={() => {
        //                 navigation.navigate('PrinterKitchenEdit')
        //             }}
        //             title='Configuration' />
        //     </Card>
        // </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default withNavigation(PrinterSettingScreen)