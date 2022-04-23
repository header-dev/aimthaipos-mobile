import React, { useContext, useState } from 'react'
import { View, Dimensions, FlatList, StyleSheet } from 'react-native'
import { ListItem, Header, SearchBar, Text } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import {
    BarChart,
    PieChart,
} from "react-native-chart-kit";
import { Context as ReportContext } from "./../../context/ReportContext";
import _ from 'lodash'
import currency from 'currency.js'
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import ReportSummaryTable from '../../components/ReportSummaryTable';
import { navigate } from '../../navigationRef';
import { useEffect } from 'react';

const DailySalePartnerScreen = ({ navigation }) => {


    const {
        state: {
            dailysales,
            isLoading,
        },
        fetchDailySaleReport
    } = useContext(ReportContext);

    const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'))

    const searchDate = (data) => {
        setSelectDate(data)
    };

    const renderChart = () => {

        const dailySaleData = _.filter(dailysales, { orderType: 'partner' })

        const recalculate = dailySaleData.map(i => {
            return {
                ...i,
                actualPay: Number(i.actualPay - (i.actualPay * (Number(i.partner.percentage) / 100))),
            }
        })

        const data = _.map(_.groupBy(recalculate, 'partnerId'),
            (o, idx) => {
                return {
                    name: o.map(i => i.partner ? i.partner.name : 'N/A'),
                    totalAmount: parseFloat(parseFloat(_.sumBy(o, 'actualPay')).toFixed(2)),
                    color: 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')',
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

    const renderPieChart = () => {

        const dailySaleData = _.filter(dailysales, { orderType: 'partner' })

        const recalculate = dailySaleData.map(i => {
            return {
                ...i,
                actualPay: Number(i.actualPay - (i.actualPay * (Number(i.partner.percentage) / 100))),
            }
        })

        const dataSum = _.map(_.groupBy(recalculate, 'partnerId'),
            (o, idx) => {
                return parseFloat(parseFloat(_.sumBy(o, 'actualPay')).toFixed(2))
            })

        const dataSumName = _.map(_.groupBy(recalculate, 'partnerId'),
            (o, idx) => {
                const [partname] = o.map(i => i.partner.name)
                return partname
            })

        return (
            <View style={{ margin: 10, alignItems: 'center', flex: 1 }}>
                <BarChart
                    data={{
                        labels: dataSumName,
                        datasets: [
                            {
                                data: dataSum
                            }
                        ]
                    }}
                    width={Dimensions.get('screen').width * 0.47}
                    height={220}
                    yAxisLabel=""
                    yAxisInterval={1} // optional, defaults to 1
                    bezier
                    showValuesOnTopOfBars
                    chartConfig={{
                        backgroundColor: "#D16BA5",
                        backgroundGradientFrom: "#D16BA5",
                        backgroundGradientTo: "#86A8E7",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 10) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 13) => 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + opacity + ')',
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        },
                    }}
                    verticalLabelRotation={-10}
                />
            </View>
        )

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
                <ListItem.Title style={styles.titleItem}>Partner Name</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {item.partner && `${item.partner.name} (${item.partner.percentage}%)`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title style={styles.titleItem}>Partner Charge</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitle}>
                    {item.partner && currency(item.partner.chargePrice, { separator: ',' }).format()}
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
                    {item.orderType === "partner" ?
                        currency(item.actualPay - (item.actualPay * (Number(item.partner.percentage) / 100)), { separator: "," }).format()
                        : currency(item.actualPay, { separator: "," }).format()}
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
                    text: `Daily Sale Partner Report ${selectDate}`,
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
                        {dailysales && renderChart()}
                        {dailysales && renderPieChart()}
                    </View>
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={_.filter(dailysales, { orderType: 'partner' })}
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

export default withNavigation(DailySalePartnerScreen)