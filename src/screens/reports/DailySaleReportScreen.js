import React, { useContext, useState, useEffect } from 'react'
import { View, Dimensions, FlatList, StyleSheet } from 'react-native'
import { ListItem, Header, SearchBar, Text, Icon } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import {
    PieChart,
} from "react-native-chart-kit";
import { Context as ReportContext } from "./../../context/ReportContext";
import { Context as PrinterContext } from './../../context/PrinterContext'
import _ from 'lodash'
import currency from 'currency.js'
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import ReportSummaryTable from '../../components/ReportSummaryTable';
import { navigate } from '../../navigationRef';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColumnAliment, COMMANDS, NetPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import { Toast } from 'native-base';

const DailySaleReportScreen = ({ navigation }) => {

    const { getBillPrinter } = useContext(PrinterContext)
    const {
        state: {
            dailysales,
            isLoading,
        },
        fetchDailySaleReport
    } = useContext(ReportContext);

    const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'))
    const [printer, setPrinter] = useState(null)

    useEffect(() => {
        getBillPrinter().then(async result => {
            const value = JSON.parse(result);
            if (value) {
                setPrinter(value)
            } else {
                Toast.show({
                    text: 'The printer not found, Please re-check your config again.',
                    type: 'warning'
                })
            }
        })
        return () => { }
    }, [])

    searchDate = data => {
        setSelectDate(data)
    };

    const printReport = async () => {
        await NetPrinter.init()
        await NetPrinter.connectPrinter(printer.ipAddress || "", printer.port || 9100)
        const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
        const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
        // let orderList = [
        //     ["1. Skirt Palas Labuh Muslimah Fashion", "x2", "500$"],
        //     ["2. BLOUSE ROPOL VIRAL MUSLIMAH FASHION", "x4222", "500$"],
        //     ["3. Women Crew Neck Button Down Ruffle Collar Loose Blouse", "x1", "30000000000000$"],
        //     ["4. Retro Buttons Up Full Sleeve Loose", "x10", "200$"],
        //     ["5. Retro Buttons Up", "x10", "200$"],
        // ];

        const recalculate = dailysales.map(i => {

            var actualPayTotal = _.sumBy(i.orderDetails, "totalAmount") +
                (i.serviceCharge / 100) *
                _.sumBy(i.orderDetails, "totalAmount") +
                ((i.cardCharge / 100) *
                    _.sumBy(i.orderDetails, "totalAmount"))
                -
                i.promotionAmount
                + i.tip + i.diffRoundup

            return {
                actualPay: i.orderType === "partner" ? Number(actualPayTotal - (actualPayTotal * (Number(i.partner.percentage) / 100))) : i.paymentType === "card" ? Number(actualPayTotal - (actualPayTotal * (i.cardCharge / 100))) : actualPayTotal,
                paymentType: i.paymentType,
            }
        })

        let subTotal = 0
        const data = _.map(_.groupBy(recalculate, 'paymentType'),
            (o, idx) => {
                if (idx === "cash" || idx === "card") {

                    // subTotal += _.sumBy(o, 'actualPay')

                    return [
                        idx ? idx : "N/A",
                        currency(_.sumBy(o, 'actualPay'), { separator: "," }).format()
                    ]
                }
            })

        let columnAliment = [ColumnAliment.LEFT, ColumnAliment.CENTER];
        let columnWidth = [15, 15]
        // await NetPrinter.printText(`${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT}Summary (${selectDate})\n`);
        await NetPrinter.printColumnsText(["Name", "Price"], columnWidth, columnAliment, [`${BOLD_ON}`, '', '']);
        for (let i in data) {
            await NetPrinter.printColumnsText(data[i], columnWidth, columnAliment, [`${BOLD_OFF}`, '']);
        }
        await NetPrinter.printBill(`${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT}Thank you\n`);
    }

    const renderChart = () => {

        const recalculate = dailysales.map(i => {

            var actualPayTotal = _.sumBy(i.orderDetails, "totalAmount") +
                (i.serviceCharge / 100) *
                _.sumBy(i.orderDetails, "totalAmount") +
                ((i.cardCharge / 100) *
                    _.sumBy(i.orderDetails, "totalAmount"))
                -
                i.promotionAmount
                + i.tip + i.diffRoundup

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
                    {currency(_.sumBy(item.orderDetails, "totalAmount") +
                        (item.serviceCharge / 100) *
                        _.sumBy(item.orderDetails, "totalAmount") +
                        ((item.cardCharge / 100) *
                            _.sumBy(item.orderDetails, "totalAmount"))
                        -
                        item.promotionAmount
                        + item.tip + item.diffRoundup, { separator: "," }).format()}
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
                rightComponent={
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 5,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                printReport()
                            }}
                        >
                            <Icon name="print" color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => {
                                navigation.navigate('CalendarSearch', {
                                    _searchDate: searchDate
                                })
                            }}
                        >
                            <Icon name="search" color="white" />
                        </TouchableOpacity>
                    </View>
                }
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