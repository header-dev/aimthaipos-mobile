import React, { useContext, useState } from 'react'
import { View, Dimensions, FlatList, StyleSheet } from 'react-native'
import { ListItem, Header, SearchBar, Text } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import {
    PieChart,
} from "react-native-chart-kit";
import { Context as ReportContext } from "./../../context/ReportContext";
import _ from 'lodash'
import currency from 'currency.js'
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import ReportSummaryTable from '../../components/ReportSummaryTable';
import { navigate } from '../../navigationRef';

const DailySaleReportScreen = ({ navigation }) => {

    const {
        state: {
            dailysales,
            isLoading,
        },
        fetchDailySaleReport
    } = useContext(ReportContext);

    const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'))


    searchDate = data => {
        setSelectDate(data)
    };

    const renderChart = () => {

        const recalculate = dailysales.map(i => {

            var actualPayTotal = _.sumBy(i.orderDetails, "totalAmount") +
                (i.serviceCharge / 100) *
                _.sumBy(i.orderDetails, "totalAmount") +
                ((i.cardCharge / 100) *
                    _.sumBy(i.orderDetails, "totalAmount"))
                -
                i.promotionAmount
                + i.tip

            return {
                actualPay: i.orderType === "partner" ? Number(actualPayTotal - (actualPayTotal * (Number(i.partner.percentage) / 100))) : i.paymentType === "card" ? Number(actualPayTotal - (actualPayTotal * (i.cardCharge / 100))) : actualPayTotal,
                paymentType: i.paymentType,
            }
        })

        const data = _.map(_.groupBy(recalculate, 'paymentType'),
            (o, idx) => {


                return {
                    name: idx ? idx : "N/A",
                    totalAmount: parseFloat(parseFloat(_.sumBy(o, 'actualPay')).toFixed(2)),
                    color: idx === "cash" ? "#A569BD" : idx === "card" ? "orange" : idx === "take-away" ? "blue" : idx === "partner" ? "green" : "grey",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                }
            })

        if (data) {
            return (
                <PieChart
                    data={data}
                    width={400}
                    height={250}
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    accessor={"totalAmount"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    absolute
                />
            )
        } else {
            return null
        }

    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item, index }) => (
        <ListItem key={index} bottomDivider onPress={() => {
            navigate("DailySaleReportDetail", {
                _orderDetail: item.orderDetails
            })
        }}>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>#{item.orderNo}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>Order Type</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {item.orderType === "partner" ? `${item.partner.name}` : item.orderType}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>Payment Type</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {item.paymentType}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>Date</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {moment(item.orderDate).format('DD/MM/YYYY HH:mm:ss')}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>Sale Amount</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {/* {currency(item.actualPay, { separator: "," }).format()} */}
                    {currency(_.sumBy(item.orderDetails, "totalAmount") +
                        (item.serviceCharge / 100) *
                        _.sumBy(item.orderDetails, "totalAmount") +
                        ((item.cardCharge / 100) *
                            _.sumBy(item.orderDetails, "totalAmount"))
                        -
                        item.promotionAmount
                        + item.tip, { separator: "," }).format()}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>Qty/ Unit</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {_.sumBy(item.orderDetails, 'quantity')}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents
                onWillFocus={() => {
                    fetchDailySaleReport(selectDate || "")
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
                    text: `Daily Sale Report ${selectDate}`,
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "search",
                    color: "#fff",
                    onPress: () => {
                        navigation.navigate('CalendarSearch', {
                            _searchDate: searchDate
                        })
                    },
                }}
            />
            {isLoading ? (
                <View style={styles.loadContent}>
                    <ActivityIndicator
                        size="large"
                    />
                </View>
            ) : (
                <>
                    <View style={{ flexDirection: 'row' }}>
                        {renderChart()}
                        <ReportSummaryTable data={dailysales} />
                    </View>
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={dailysales}
                        renderItem={(item) => renderItem(item)}
                        ListHeaderComponent={() => {
                            if (!dailysales.length) {
                                return (
                                    <Text style={styles.emptyContent}>data not found</Text>
                                )
                            } else {
                                return null
                            }
                        }}
                    />
                </>
            )}
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

export default withNavigation(DailySaleReportScreen)