import React from 'react'
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { View, Text } from 'react-native'
import { Header, Icon, ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation';

const ReportScreen = ({ navigation }) => {

    const list = [
        {
            title: "Daily Sale Report",
            type: "font-awesome",
            button: false,
            action: () => {
                navigation.navigate("DailySaleReport");
            },
        },
        {
            title: "Reduction Report",
            type: "font-awesome",
            button: false,
            action: () => {
                navigation.navigate("ReductionReportScreen");
            },
        },
        {
            title: "Daily Sale Partner Report",
            type: "font-awesome",
            button: false,
            action: () => {
                navigation.navigate("DailySalePartnerScreen");
            },
        },
        {
            title: "Summary Sale Transaction Item Report",
            type: "font-awesome",
            button: false,
            action: () => {
                navigation.navigate("SummarySaleTransactionItemScreen");
            },
        },
        {
            title: "Summary Sale Item Report",
            type: "font-awesome",
            button: false,
            action: () => {
                navigation.navigate("SaleItemScreen");
            },
        }
    ];

    const keyExtractor = (item, index) => index.toString();

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={item.action}>
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            {!item.button && <ListItem.Chevron />}
        </ListItem>
    );

    return (
        <View style={{ flex: 1 }}>
            <Header
                placement="center"
                containerStyle={{
                    backgroundColor: "#2E7C31",
                }}
                leftComponent={{
                    icon: "menu",
                    color: "#fff",
                    onPress: () => {
                        navigation.toggleDrawer();
                    },
                }}
                centerComponent={{
                    text: "Report",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <FlatList
                keyExtractor={keyExtractor}
                data={list}
                renderItem={renderItem}
            />
        </View>
    )
}

export default withNavigation(ReportScreen)