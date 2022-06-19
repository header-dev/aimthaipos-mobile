import React, { useContext, useState, useEffect } from 'react';
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { ListItem, Header, SearchBar, Text, Icon } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { PieChart } from 'react-native-chart-kit';
import { Context as ReportContext } from './../../context/ReportContext';
import { Context as PrinterContext } from './../../context/PrinterContext';
import _ from 'lodash';
import currency from 'currency.js';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import ReportSummaryTable from '../../components/ReportSummaryTable';
import { navigate } from '../../navigationRef';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  ColumnAliment,
  COMMANDS,
  NetPrinter,
  PrinterWidth,
} from 'react-native-thermal-receipt-printer-image-qr';
import { Toast } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

const DailySaleReportScreen = ({ navigation }) => {
  const { getBillPrinter } = useContext(PrinterContext);
  const {
    state: { dailysales, isLoading },
    fetchDailySaleReport,
  } = useContext(ReportContext);

  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [printer, setPrinter] = useState(null);

  useEffect(() => {
    getBillPrinter().then(async (result) => {
      const value = JSON.parse(result);
      if (value) {
        setPrinter(value);
      } else {
        Toast.show({
          text: 'The printer not found, Please re-check your config again.',
          type: 'warning',
        });
      }
    });
    return () => {};
  }, []);

  searchDate = (data) => {
    setSelectDate(data);
  };

  const printReport = async () => {
    try {
      await NetPrinter.init();
      await NetPrinter.connectPrinter(
        printer.ipAddress || '',
        printer.port || 9100
      );
      const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
      const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
      const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
      const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
      const recalculate = dailysales.map((i) => {
        // var actualPayTotal =
        //   _.sumBy(i.orderDetails, 'totalAmount') +
        //   (i.serviceCharge / 100) * _.sumBy(i.orderDetails, 'totalAmount') +
        //   (i.cardCharge / 100) * _.sumBy(i.orderDetails, 'totalAmount') -
        //   i.promotionAmount +
        //   i.tip +
        //   i.diffRoundup;

        var actualPayTotal =
          _.sumBy(i, 'pay') +
          (i.serviceCharge / 100) * _.sumBy(i, 'pay') +
          (i.cardCharge / 100) * _.sumBy(i, 'pay') +
          i.diffRoundup;

        return {
          // actualPay: i.orderType === "partner" ? Number(actualPayTotal - (actualPayTotal * (Number(i.partner.percentage) / 100))) : i.paymentType === "card" ? Number(actualPayTotal - (actualPayTotal * (i.cardCharge / 100))) : actualPayTotal,
          actualPay: actualPayTotal,
          paymentType: i.paymentType,
          orderType: i.orderType,
          partnerName: i.partner ? i.partner.name : '',
        };
      });

      const data = _.map(_.groupBy(recalculate, 'paymentType'), (o, idx) => {
        if (idx === 'cash' || idx === 'card') {
          return [
            `${idx ? idx : 'N/A'}`,
            currency(_.sumBy(o, 'actualPay'), { separator: ',' }).format(),
          ];
        }
      });

      const dineInValue = _.filter(recalculate, { orderType: 'dine-in' });
      const takeAwayValue = _.filter(recalculate, { orderType: 'take-away' });
      const deliveryValue = _.filter(recalculate, { orderType: 'delivery' });

      const cashDineInValue = _.filter(dineInValue, { paymentType: 'cash' });
      const cashTakeAwayValue = _.filter(takeAwayValue, {
        paymentType: 'cash',
      });
      const cashDeliveryValue = _.filter(deliveryValue, {
        paymentType: 'cash',
      });

      const sumCashDineInValue = _.sumBy(cashDineInValue, 'actualPay');
      const sumCashTakeAwayValue = _.sumBy(cashTakeAwayValue, 'actualPay');
      const sumCashDeliveryValue = _.sumBy(cashDeliveryValue, 'actualPay');

      const cardDineInValue = _.filter(dineInValue, { paymentType: 'card' });
      const cardTakeAwayValue = _.filter(takeAwayValue, {
        paymentType: 'card',
      });
      const cardDeliveryValue = _.filter(deliveryValue, {
        paymentType: 'card',
      });
      const sumCardDineInValue = _.sumBy(cardDineInValue, 'actualPay');
      const sumCardTakeAwayValue = _.sumBy(cardTakeAwayValue, 'actualPay');
      const sumCardDeliveryValue = _.sumBy(cardDeliveryValue, 'actualPay');

      const subTotal =
        sumCashDineInValue +
        sumCardDineInValue +
        sumCashTakeAwayValue +
        sumCardTakeAwayValue +
        sumCashDeliveryValue +
        sumCardDeliveryValue;

      const partnerValue = _.filter(recalculate, { orderType: 'partner' });
      const partnerPartnerValue = _.filter(partnerValue, {
        paymentType: 'partner',
      });
      const sumPartnerPartnerValue = _.sumBy(partnerPartnerValue, 'actualPay');

      const dataPartner = _.map(
        _.groupBy(partnerPartnerValue, 'partnerName'),
        (o, idx) => {
          return [
            idx ? idx : 'N/A',
            currency(_.sumBy(o, 'actualPay'), { separator: ',' }).format(),
          ];
        }
      );

      let columnWidth = [15, 15];
      NetPrinter.printText(
        `${CENTER}${BOLD_ON} Summary (${selectDate}) ${BOLD_OFF}`
      );
      NetPrinter.printText(
        `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_58MM}${CENTER}`
      );
      let columnAliment = [ColumnAliment.LEFT, ColumnAliment.CENTER];
      for (let i in data) {
        if (data[i]) {
          NetPrinter.printColumnsText(data[i], columnWidth, columnAliment, [
            '',
            '',
          ]);
        }
      }
      if (sumPartnerPartnerValue) {
        NetPrinter.printColumnsText(
          [
            'Online',
            currency(sumPartnerPartnerValue, { separator: ',' }).format(),
          ],
          columnWidth,
          columnAliment,
          ['', '']
        );
      }
      NetPrinter.printText(`\n`);
      if (subTotal) {
        NetPrinter.printColumnsText(
          ['Sub total', currency(subTotal, { separator: ',' }).format()],
          columnWidth,
          columnAliment,
          ['', '']
        );
      }
      if (subTotal) {
        NetPrinter.printColumnsText(
          [
            'Grand total',
            currency(subTotal + sumPartnerPartnerValue, {
              separator: ',',
            }).format(),
          ],
          columnWidth,
          columnAliment,
          ['', '']
        );
      }

      NetPrinter.printText(`\n`);
      for (let p in dataPartner) {
        if (dataPartner[p]) {
          NetPrinter.printColumnsText(
            dataPartner[p],
            columnWidth,
            columnAliment,
            ['', '']
          );
        }
      }

      NetPrinter.printBill(`\n`, { beep: false });
    } catch (error) {
      alert(error.message);
    }
  };

  const renderChart = () => {
    const recalculate = dailysales.map((i) => {
      // var actualPayTotal =
      //   _.sumBy(i.orderDetails, 'totalAmount') +
      //   (i.serviceCharge / 100) * _.sumBy(i.orderDetails, 'totalAmount') +
      //   (i.cardCharge / 100) * _.sumBy(i.orderDetails, 'totalAmount') -
      //   i.promotionAmount +
      //   i.tip +
      //   i.diffRoundup;
      var actualPayTotal =
        i.pay +
        (i.serviceCharge / 100) * i.pay +
        (i.cardCharge / 100) * i.pay +
        i.diffRoundup;

      return {
        // actualPay: i.orderType === "partner" ? Number(actualPayTotal - (actualPayTotal * (Number(i.partner.percentage) / 100))) : i.paymentType === "card" ? Number(actualPayTotal - (actualPayTotal * (i.cardCharge / 100))) : actualPayTotal,
        actualPay: actualPayTotal,
        paymentType: i.paymentType,
        orderType: i.orderType,
        partnerName: i.partner ? i.partner.name : '',
      };
    });

    const data = _.map(_.groupBy(recalculate, 'paymentType'), (o, idx) => {
      return {
        name: idx ? idx : 'N/A',
        totalAmount: parseFloat(parseFloat(_.sumBy(o, 'actualPay')).toFixed(2)),
        color:
          idx === 'cash'
            ? '#A569BD'
            : idx === 'card'
            ? 'orange'
            : idx === 'take-away'
            ? 'blue'
            : idx === 'partner'
            ? 'green'
            : 'grey',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      };
    });

    if (data) {
      return (
        <PieChart
          data={data}
          width={400}
          height={250}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          accessor={'totalAmount'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          absolute
        />
      );
    } else {
      return null;
    }
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item, index }) => (
    <ListItem
      key={index}
      bottomDivider
      onPress={() => {
        navigate('DailySaleReportDetail', {
          _orderDetail: item.orderDetails,
        });
      }}
    >
      <ListItem.Content>
        <ListItem.Title style={styles.titleItem}>
          #{item.orderNo}
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Content>
        <ListItem.Title style={styles.titleItem}>Order Type</ListItem.Title>
        <ListItem.Subtitle style={styles.subTitle}>
          {item.orderType === 'partner'
            ? `${item.partner.name}`
            : item.orderType}
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
          {/* {currency(
            _.sumBy(item.orderDetails, 'totalAmount') +
              (item.serviceCharge / 100) *
                _.sumBy(item.orderDetails, 'totalAmount') +
              (item.cardCharge / 100) *
                _.sumBy(item.orderDetails, 'totalAmount') -
              item.promotionAmount +
              item.tip +
              item.diffRoundup,
            { separator: ',' }
          ).format()} */}
          {item.pay +
            (item.serviceCharge / 100) * item.pay +
            (item.cardCharge / 100) * item.pay +
            item.diffRoundup}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content>
        <ListItem.Title style={styles.titleItem}>Qty/ Unit</ListItem.Title>
        <ListItem.Subtitle style={styles.subTitle}>
          {_.sumBy(item.orderDetails, 'quantity')}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => {
          fetchDailySaleReport(selectDate || '');
        }}
      />
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: '#2E7C31',
        }}
        leftComponent={{
          icon: 'arrow-back',
          color: '#fff',
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: `Daily Sale Report ${selectDate}`,
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
        rightComponent={
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                printReport();
              }}
            >
              <Icon name="print" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 20 }}
              onPress={() => {
                navigation.navigate('CalendarSearch', {
                  _searchDate: searchDate,
                });
              }}
            >
              <Icon name="search" color="white" />
            </TouchableOpacity>
          </View>
        }
      />
      {isLoading ? (
        <View style={styles.loadContent}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {renderChart()}
            <ReportSummaryTable data={dailysales} />
          </View>
          <FlatList
            keyExtractor={keyExtractor}
            data={dailysales}
            renderItem={(item) => renderItem(item)}
            ListHeaderComponent={() => {
              if (!dailysales.length) {
                return <Text style={styles.emptyContent}>data not found</Text>;
              } else {
                return null;
              }
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleItem: {
    fontWeight: 'bold',
  },
  subTitle: {
    fontStyle: 'italic',
  },
  loadContent: { justifyContent: 'center', flex: 1 },
  emptyContent: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default withNavigation(DailySaleReportScreen);
