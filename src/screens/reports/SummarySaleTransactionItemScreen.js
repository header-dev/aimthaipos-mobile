import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Header, Text } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Context as ReportContext } from "./../../context/ReportContext";
import { Context as ProteinContext } from './../../context/ProteinContext'
import { ScrollView } from 'react-native';
import _ from 'lodash'
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import {
    BarChart,
} from "react-native-chart-kit";
import { Dimensions } from 'react-native';



const SummarySaleTransactionItemScreen = ({ navigation }) => {

    const {
        state: {
            report_datas,
            isLoading,
        },
        fetchSumSaleTransactionItem
    } = useContext(ReportContext);

    const { state: { proteins }, fetchProtein } = useContext(ProteinContext)
    const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'))


    searchDate = data => {
        setSelectDate(data)
    };



    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents
                onWillFocus={() => {
                    fetchSumSaleTransactionItem(selectDate || "")
                    fetchProtein()
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
                    text: `Summary Sale Transaction Item (${selectDate})`,
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
            <View style={{ alignContent: 'center', margin: 10, alignItems: 'center' }}>
                <BarChart
                    data={{
                        labels: proteins.map(i => i.name),
                        datasets: [
                            {
                                data: proteins.map(p => _.sumBy(_.filter(report_datas, (i) => i.protein && i.protein.id === p.id), "total"))
                            }
                        ]
                    }}
                    width={Dimensions.get('screen').width * 0.9}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        // backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 10) => `rgba(255, 255, 255, ${opacity})`,
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
                    verticalLabelRotation={0}
                />
            </View>
            {isLoading ? <ActivityIndicator style={{ margin: 5 }} /> : (
                <Grid style={{ margin: 5 }}>
                    <ScrollView>
                        <Row>
                            <Col></Col>
                            {proteins && proteins.map(p => (
                                <Col>
                                    <View style={[styles.boxCol, { backgroundColor: 'violet' }]}>
                                        <Text style={styles.textCol}>{p.name} ({_.sumBy(_.filter(report_datas, (i) => i.protein && i.protein.id === p.id), "total")})</Text>
                                    </View>
                                </Col>
                            ))}
                        </Row>

                        {report_datas && report_datas.map(i => (
                            <Row>
                                <Col>
                                    <View style={styles.boxCol}>
                                        <Text style={styles.textCol}>{i.product.name}</Text>
                                    </View>
                                </Col>
                                {proteins && proteins.map(p => (
                                    <Col>
                                        <View style={[styles.boxCol, { backgroundColor: i.protein && i.protein.id === p.id ? 'orange' : 'none' }]}>
                                            <Text style={styles.textRow}>{i.protein && i.protein.id === p.id ? i.total : ''}</Text>
                                        </View>
                                    </Col>
                                ))}
                            </Row>
                        ))}
                    </ScrollView>
                </Grid>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    boxCol: { width: '100%', height: 30, borderWidth: 0.4, justifyContent: 'center' },
    textRow: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textCol: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default withNavigation(SummarySaleTransactionItemScreen)