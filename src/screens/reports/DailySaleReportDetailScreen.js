import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Header, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import currency from 'currency.js'

const DailySaleReportDetailScreen = ({ navigation }) => {

    const _orderDetail = navigation.getParam('_orderDetail')

    return (
        <View style={{ flex: 1 }}>
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
                    text: "Daily Sale Report Detail",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "search",
                    color: "#fff",
                    onPress: () => {
                        navigation.navigate('CalendarSearch')
                    },
                }}
            />
            <FlatList
                data={_orderDetail}
                renderItem={({ item }) => (
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Menu Name</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>{item.product.name}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Quantity</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>{item.quantity}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Additional Price</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>
                                {currency(item.addition_price, {
                                    separator: ','
                                }).format()}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Total Amount</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>{currency(item.totalAmount, {
                                separator: ','
                            }).format()}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    titleItem: {
        fontWeight: 'bold'
    },
    subTitle: {
        fontStyle: 'italic'
    },
    loadContent: { justifyContent: 'center', flex: 1 },
    emptyContent: {
        textAlign: 'center',
        fontWeight: 'bold'
    }
})


export default withNavigation(DailySaleReportDetailScreen)