import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Header, ListItem, Text } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Context as ReportContext } from "./../../context/ReportContext";
import { Context as MenuContext } from './../../context/MenuContext'
import { ScrollView } from 'react-native';
import _ from 'lodash'
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import {
    BarChart, PieChart
} from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import DatePickerModal from '../../components/DatePickerModal';
import { FlatList } from 'react-native';



const SummarySaleItemReportScreen = ({ navigation }) => {

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43]
            }
        ]
    };

    const {
        state: {
            report_sum_item_datas,
            isLoading,
        },
        fetchSumItem
    } = useContext(ReportContext);
    const {
        state: { menus, isRejected },
        fetchMenu,
    } = useContext(MenuContext);

    const [showDatePicker, setShowDatePicker] = useState(false)

    const [selectStartDate, setSelectStartDate] = useState(moment().format('YYYY-MM-DD'))
    const [selectEndDate, setSelectEndDate] = useState(moment().format('YYYY-MM-DD'))


    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents
                onWillFocus={() => {
                    fetchSumItem(selectStartDate, selectEndDate)
                    // fetchMenu("")
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
                    text: `Summary Sale Item (${selectStartDate} - ${selectEndDate})`,
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "search",
                    color: "#fff",
                    onPress: () => {
                        setShowDatePicker(true)
                    },
                }}
            />
            <View style={{ alignContent: 'center', margin: 10, alignItems: 'center' }}>
                <ScrollView horizontal>
                {report_sum_item_datas.length > 0 && <BarChart
                    data={{
                        labels: report_sum_item_datas.map(i => i.product.name),
                        datasets: [
                            {
                                data: report_sum_item_datas.map(i => i.total)
                            }
                        ]
                    }}
                    width={Dimensions.get('screen').width * 1.8}
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
                        labelColor: (opacity = 13) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        },
                    }}
                    verticalLabelRotation={-10}
                />}
                </ScrollView>
            </View>
            {isLoading && <ActivityIndicator style={{ margin: 5 }} />}
            <FlatList
                data={report_sum_item_datas}
                renderItem={({ item }) => (
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Menu Name</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>{item.product.name}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Total Quantity</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>{item.total}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleItem}>Order Date</ListItem.Title>
                            <ListItem.Subtitle style={styles.subTitle}>{moment(item.order.orderDate).format('DD-MM-YYYY')}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                )}
            />
            <DatePickerModal
                showModal={showDatePicker}
                onClose={() => {
                    setShowDatePicker(false)
                }}
                onSubmit={(start, end) => {
                    setSelectStartDate(moment(start).format('YYYY-MM-DD'))
                    setSelectEndDate(moment(end).format('YYYY-MM-DD'))
                    fetchSumItem(moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'))
                    setShowDatePicker(false)
                }}
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

export default withNavigation(SummarySaleItemReportScreen)