import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Header, Text, ListItem, Button, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { navigate } from '../../navigationRef';
import currency from 'currency.js';
import { CalculatorInput, Calculator } from 'react-native-calculator';
import { priceNumberFormat, roundToStep } from '../../utils/NumberUtil';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import { Context as SaleContext } from './../../context/SaleContext';
import { Context as PrinterContext } from './../../context/PrinterContext';
import { Context as AuthContext } from './../../context/AuthContext';
import { Context as ShopContext } from './../../context/ShopContext';
import { Context as SettingContext } from './../../context/SettingContext';
import PaymentForm from '../../components/carts/PaymentForm';
import {
  COMMANDS,
  NetPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';
import moment from 'moment';
import { Toast } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { AntDesign } from '@expo/vector-icons';

const CENTER_ON = '\x1b\x61\x01';
const CENTER_OFF = '\x1b\x61\x00';

import * as Yup from 'yup';
import {
  BOLD_OFF,
  BOLD_ON,
  TXT_ALIGN_CT,
  TXT_DOUBLE,
  TXT_DOUBLE_OFF,
  TXT_2HEIGHT,
  TXT_2HEIGHT_OFF,
} from '../../constants';
import { Alert } from 'react-native';
import { Divider } from 'react-native-paper';

const CheckoutScreen = ({ navigation }) => {
  const {
    state: { order, isLoadingOrderDetail, currentOrder },
    fetchOrderById,
    clearCurrentOrder,
    updateOrder,
  } = useContext(SaleContext);
  const {
    state: { card, isCardLoading, isCardRejected },
    fetchCard,
  } = useContext(SettingContext);
  const {
    state: { shop },
    fetchShop,
  } = useContext(ShopContext);

  const { getBillPrinter } = useContext(PrinterContext);
  const [printer, setPrinter] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);

  const {
    state: { user },
    getUser,
  } = useContext(AuthContext);

  const _order = navigation.getParam('_order');
  const _headerCaption = navigation.getParam('_headerCaption');
  const _tableNo = navigation.getParam('_tableNo');

  useEffect(() => {
    getBillPrinter().then(async (result) => {
      const value = JSON.parse(result);
      if (value) {
        await NetPrinter.init();
        setPrinter(value);
        setPrinterConnected(true);
      } else {
        Toast.show({
          text: 'The printer not found, Please re-check your config again.',
          type: 'warning',
        });
      }
    });
    return () => {};
  }, []);

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item, index }) => (
    <ListItem key={index} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product.name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Content>
        <ListItem.Title>{item.quantity}x</ListItem.Title>
        <ListItem.Subtitle>
          {currency(item.priceAdditionPrice, { separator: ',' }).format()}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content>
        <ListItem.Title>
          {currency(item.totalAmount, { separator: ',' }).format()}
        </ListItem.Title>
        <ListItem.Subtitle>
          -{currency(item.discount, { separator: ',' }).format()}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const menuItem = (item, price) =>
    item + price.padStart(32 - item.length, '.');

  const printBill = async () => {
    try {
      await NetPrinter.connectPrinter(
        printer.ipAddress || '',
        printer.port || 9100
      );
      const totalAmount = _.sumBy(order.orderDetails, 'totalAmount');
      const serviceCharge = (order.serviceCharge / 100) * totalAmount;
      const cardCharge = (order.cardCharge / 100) * totalAmount;
      const total =
        totalAmount +
        serviceCharge -
        order.promotionAmount +
        cardCharge +
        order.tip;
      const totalPrice = total + order.diffRoundup;

      let allContent = ``;
      allContent += `${CENTER_ON}${BOLD_ON}BILL${BOLD_OFF}${CENTER_OFF}\n================================\n`;
      allContent += `${moment().format('DD/MM/YYYY HH:mm')}\nNo.${
        order.orderNo
      }\n`;

      let contentType = ``;
      if (order.orderType === 'take-away') {
        contentType = `Take Away`;
      } else if (order.orderType === 'delivery') {
        contentType = `Delivery`;
      } else if (order.orderType === 'partner') {
        contentType = `Customer: ${order.remark}\n`;
        contentType += `Partner: ${order.partner.name}`;
      } else {
        contentType = `Table: ${_tableNo}`;
      }

      allContent += `Service : ${user ? user.username : ''}\n${contentType}\n`;
      allContent += `================================\n${CENTER_ON}${BOLD_ON}Description${BOLD_OFF}${CENTER_OFF}\n================================\n`;
      let contentProduct = ``;
      let contentPartner = ``;
      if (order.orderType === 'partner') {
        contentPartner = `(${parseFloat(order.partner.chargePrice).toFixed(
          2
        )})`;
      }
      order.orderDetails.map((i) => {
        contentProduct += `${menuItem(
          i.product.name.substring(0, 7),
          `${i.quantity} x ${currency(i.priceAdditionPrice, {
            separator: ',',
          }).format()}${contentPartner} = ${currency(i.totalAmount, {
            separator: ',',
          }).format()}`
        )}\n`;
      });
      allContent += contentProduct;
      let paymentDetail = ``;
      if (order.paymentType === 'cash') {
        paymentDetail = `Cash : ${currency(order.payReceive, {
          separator: ',',
        }).format()}\nChange : ${currency(order.payChange, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'card') {
        paymentDetail = `Card : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'pay-id') {
        paymentDetail = `Pay ID : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'take-away') {
        paymentDetail = `Take Away : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'partner') {
        paymentDetail = `${order.partner.name} : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      }

      allContent += `<C>================================\nPromo Discount: -${currency(
        order.promotionAmount,
        {
          separator: ',',
        }
      ).format()}\nService: ${order.serviceCharge}(%)\nCard Charge: ${
        order.cardCharge
      }(%)\nAdjustment : ${currency(order.tip, {
        separator: ',',
      }).format()}\nSub-Total : ${currency(total, {
        separator: ',',
      }).format()}\nRounding: ${
        order.diffRoundup ? order.diffRoundup : 0.0
      }\nTotal Price:${currency(totalPrice, {
        separator: ',',
      }).format()}\n================================\n${paymentDetail}================================</C>\n`;
      allContent += `${CENTER_ON}${BOLD_ON}Thank you for choosing Aim Thai${BOLD_OFF}${CENTER_OFF}\n`;
      if (order.paymentType === 'cash') {
        allContent += `${COMMANDS.CASH_DRAWER.CD_KICK_2}`;
      }
      await NetPrinter.printBill(allContent, {
        cut: true,
      });
    } catch (error) {
      Toast.show({
        text: error.message,
        type: 'warning',
      });
    }
  };

  const openCashDrawer = async () => {
    try {
      await NetPrinter.connectPrinter(
        printer.ipAddress || '',
        printer.port || 9100
      );
      await NetPrinter.printBill(`${COMMANDS.CASH_DRAWER.CD_KICK_2}`);
    } catch (error) {
      Toast.show({
        text: error.message,
        type: 'warning',
      });
    }
  };

  const printTax = async () => {
    try {
      await NetPrinter.connectPrinter(
        printer.ipAddress || '',
        printer.port || 9100
      );
      const totalAmount = _.sumBy(order.orderDetails, 'totalAmount');
      const serviceCharge = (order.serviceCharge / 100) * totalAmount;
      const cardCharge = (order.cardCharge / 100) * totalAmount;
      const total =
        totalAmount +
        serviceCharge -
        order.promotionAmount +
        cardCharge +
        order.tip;
      const totalPrice = total + order.diffRoundup;
      let allContent = ``;
      allContent += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${BOLD_ON}${shop.name}${BOLD_OFF}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
      allContent += `${TXT_ALIGN_CT}${shop.address1}${TXT_ALIGN_CT}\n`;
      allContent += `${TXT_ALIGN_CT}${shop.address2},${shop.state},${shop.postcode}${TXT_ALIGN_CT}\n`;
      allContent += `${TXT_ALIGN_CT}PHONE:${shop.tel}${TXT_ALIGN_CT}\n`;
      allContent += `${TXT_ALIGN_CT}***TAX INVOICE***${TXT_ALIGN_CT}\n`;
      allContent += `${TXT_ALIGN_CT}ABN:${shop.tax_id}${TXT_ALIGN_CT}\n`;
      allContent += `${TXT_ALIGN_CT}ALL PRICES INCLUDE GST${TXT_ALIGN_CT}\n`;
      allContent += `================================\n`;
      allContent += `${moment().format('DD/MM/YYYY HH:mm')}\nNo.${
        order.orderNo
      }\n`;
      let contentType = ``;
      if (order.orderType === 'take-away') {
        contentType = `Take Away`;
      } else if (order.orderType === 'delivery') {
        contentType = `Delivery`;
      } else if (order.orderType === 'partner') {
        contentType = `Customer: ${order.remark}\n`;
        contentType += `Partner: ${order.partner.name}`;
      } else {
        contentType = `Table: ${_tableNo}`;
      }

      allContent += `Service : ${user ? user.username : ''}\n${contentType}\n`;
      allContent += `================================\n${CENTER_ON}${BOLD_ON}Description${BOLD_OFF}${CENTER_OFF}\n================================\n`;
      let contentProduct = ``;
      let contentPartner = ``;
      if (order.orderType === 'partner') {
        contentPartner = `(${parseFloat(order.partner.chargePrice).toFixed(
          2
        )})`;
      }

      order.orderDetails.map((i) => {
        contentProduct += `${menuItem(
          i.product.name.substring(0, 7),
          `${i.quantity} x ${currency(i.priceAdditionPrice, {
            separator: ',',
          }).format()}${contentPartner} = ${currency(i.totalAmount, {
            separator: ',',
          }).format()}`
        )}\n`;
      });
      allContent += contentProduct;
      let paymentDetail = ``;
      if (order.paymentType === 'cash') {
        paymentDetail = `Cash : ${currency(order.payReceive, {
          separator: ',',
        }).format()}\nChange : ${currency(order.payChange, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'card') {
        paymentDetail = `Card : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'pay-id') {
        paymentDetail = `Pay ID : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'take-away') {
        paymentDetail = `Take Away : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      } else if (order.paymentType === 'partner') {
        paymentDetail = `${order.partner.name} : ${currency(total, {
          separator: ',',
        }).format()}\n`;
      }
      let cardChargeContent = `Card Charge: ${order.cardCharge}(%)\n`;
      allContent += `<C>================================\nPromo Discount: -${currency(
        order.promotionAmount,
        {
          separator: ',',
        }
      ).format()}\nService: ${
        order.serviceCharge
      }(%)\n${cardChargeContent}Adjustment : ${currency(order.tip, {
        separator: ',',
      }).format()}\nSub-Total : ${currency(total, {
        separator: ',',
      }).format()}\nRounding: ${order.diffRoundup}\nTotal Price:${currency(
        totalPrice,
        {
          separator: ',',
        }
      ).format()}\n================================\n${paymentDetail}================================</C>\n`;
      allContent += `${CENTER_ON}${BOLD_ON}Thank you for choosing Aim Thai${BOLD_OFF}${CENTER_OFF}\n`;
      await NetPrinter.printBill(allContent, {
        cut: true,
      });
    } catch (error) {
      Toast.show({
        text: error.message,
        type: 'warning',
      });
    }
  };

  let submitPaymentForm = null;

  const handleSubmitMyForm = (e, status) => {
    if (submitPaymentForm) {
      submitPaymentForm(e, status);
    }
  };

  const bindSubmitForm = (submitForm) => {
    submitPaymentForm = submitForm;
  };

  const handleSubmitForm = (values) => {
    if (values.returnAmount >= 0) {
      const totalAmount =
        _.sumBy(order.orderDetails, 'totalAmount') +
        (order.serviceCharge / 100) *
          _.sumBy(order.orderDetails, 'totalAmount') -
        order.promotionAmount +
        order.tip;

      /*navigate("Payment", {
        _amountDue:
          totalAmount,
        _order: order,
        _actualPayment: values
      });*/
    } else {
      Toast.show({
        text: 'Please re-check your change. Should be more then current value.',
        type: 'warning',
        buttonText: 'Ok',
      });
    }
  };

  const paymentStamp = (type) => {
    var orderValue = Object.assign({}, order);

    delete orderValue.tableTransactions;
    delete orderValue.orderDetails;
    delete orderValue.actualPay;

    let orginalTotal =
      _.sumBy(order.orderDetails, 'totalAmount') +
      (order.serviceCharge / 100) * _.sumBy(order.orderDetails, 'totalAmount') -
      order.promotionAmount +
      order.tip;
    let diffRoundup = 0.0;

    if (type === 'cash') {
      let afRoundup = roundToStep(orginalTotal, 0.1);
      diffRoundup = afRoundup - orginalTotal;
    }

    updateOrder(_order.id, {
      ...orderValue,
      paymentType: type,
      diffRoundup: diffRoundup,
      pay: orginalTotal,
      cardCharge: type === 'card' ? card.fee : 0.0,
      payChange: type !== 'cash' && 0.0,
      payReceive: type !== 'cash' && 0.0,
    }).then(() => {
      fetchOrderById(_order.id);
    });
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
      <NavigationEvents
        onWillFocus={() => {
          fetchShop();
          fetchOrderById(_order.id);
          getUser();
          fetchCard();
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
          text: _headerCaption,
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
        rightComponent={() => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigate('Calculator');
              }}
            >
              <AntDesign name="calculator" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => {
                clearCurrentOrder();
              }}
            >
              <AntDesign name="home" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.contentItem}>
          {isLoadingOrderDetail && (
            <ActivityIndicator size="small" style={{ margin: 5 }} />
          )}
          <FlatList
            keyExtractor={keyExtractor}
            data={order.orderDetails}
            renderItem={(item) => renderItem(item)}
            ListFooterComponent={() => (
              <View style={styles.footerList}>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Sub-Total</Text>
                  <Text>
                    {currency(
                      parseFloat(_.sumBy(order.orderDetails, 'amount')),
                      {
                        separator: ',',
                      }
                    ).format()}
                  </Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Promo/Discount</Text>
                  <Text>
                    -{' '}
                    {currency(order.promotionAmount, {
                      separator: ',',
                    }).format()}{' '}
                    ({order && order.promotion ? order.promotion.name : 0})
                  </Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Adjustment</Text>
                  <Text>
                    {currency(order.tip, {
                      separator: ',',
                    }).format()}
                  </Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Service</Text>
                  <Text>{order.serviceCharge} (%)</Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Card</Text>
                  <Text>{order.cardCharge} (%)</Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Total</Text>
                  <Text>
                    {currency(
                      _.sumBy(order.orderDetails, 'totalAmount') +
                        (order.serviceCharge / 100) *
                          _.sumBy(order.orderDetails, 'totalAmount') +
                        (order.cardCharge / 100) *
                          _.sumBy(order.orderDetails, 'totalAmount') -
                        order.promotionAmount +
                        order.tip,
                      {
                        separator: ',',
                      }
                    ).format()}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.contentCalculator}>
          <View
            style={{
              flex: 0.5,
            }}
          >
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text h3>
                Amount due :{' '}
                {currency(
                  _.sumBy(order.orderDetails, 'totalAmount') +
                    (order.serviceCharge / 100) *
                      _.sumBy(order.orderDetails, 'totalAmount') +
                    (order.cardCharge / 100) *
                      _.sumBy(order.orderDetails, 'totalAmount') -
                    order.promotionAmount +
                    order.tip +
                    order.diffRoundup,
                  {
                    separator: ',',
                  }
                ).format()}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}
              >
                Payment Type : {order.paymentType}
              </Text>
            </View>
            <PaymentForm
              initialValue={{
                payReceive: 0.0,
                returnAmount: 0.0,
                amountDue:
                  _.sumBy(order.orderDetails, 'totalAmount') +
                  (order.serviceCharge / 100) *
                    _.sumBy(order.orderDetails, 'totalAmount') +
                  (order.cardCharge / 100) *
                    _.sumBy(order.orderDetails, 'totalAmount') -
                  order.promotionAmount +
                  order.tip +
                  order.diffRoundup,
              }}
              // onSubmit={handleSubmitForm}
              onSubmit={(value) => {
                if (order.paymentType === 'cash') {
                  updateOrder(order.id, {
                    payChange: value.returnAmount,
                    payReceive: value.payReceive,
                  }).then(() => {
                    fetchOrderById(order.id);
                  });
                }
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {order.orderType !== 'partner' ? (
                <>
                  <Button
                    title={'Cash'}
                    type="outline"
                    titleStyle={{
                      color: 'black',
                    }}
                    buttonStyle={[
                      styles.buttonPayment,
                      {
                        backgroundColor:
                          order.paymentType === 'cash' ? 'grey' : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      paymentStamp('cash');
                    }}
                  />
                  <Button
                    title={`Card (Fee ${card.fee} %)`}
                    type="outline"
                    titleStyle={{
                      color: 'black',
                    }}
                    buttonStyle={[
                      styles.buttonPayment,
                      {
                        backgroundColor:
                          order.paymentType === 'card' ? 'grey' : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      paymentStamp('card');
                    }}
                  />
                </>
              ) : (
                <Button
                  title={'Partner'}
                  type="outline"
                  titleStyle={{
                    color: 'black',
                  }}
                  buttonStyle={[
                    styles.buttonPayment,
                    {
                      backgroundColor:
                        order.paymentType === 'partner'
                          ? 'grey'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    paymentStamp('partner');
                  }}
                />
              )}
            </View>
            <Divider
              style={{
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <Button
                onPress={() => {
                  navigate('Promotion', {
                    _orderId: order.id,
                    _amount:
                      order && _.sumBy(order.orderDetails, 'totalAmount'),
                  });
                }}
                buttonStyle={[
                  styles.buttonPayment,
                  {
                    backgroundColor: '#F8488D',
                  },
                ]}
                titleStyle={{
                  color: 'black',
                }}
                title={'Promotion'}
              />
              <Button
                title={'Adjustment'}
                buttonStyle={[
                  styles.buttonPayment,
                  {
                    backgroundColor: '#A569BD',
                  },
                ]}
                titleStyle={{
                  color: 'white',
                }}
                onPress={() => {
                  navigate('Tip', {
                    _order: order,
                  });
                }}
              />
              <Button
                title={`Print Tax Invoice`}
                buttonStyle={[
                  styles.buttonPayment,
                  {
                    backgroundColor: '#98FB98',
                  },
                ]}
                titleStyle={{
                  color: 'black',
                }}
                onPress={() => {
                  if (printer) {
                    if (printerConnected) {
                      printTax();
                    } else {
                      Toast.show({
                        text: 'The printer is not response, Please re-check your printer status agian.',
                        type: 'warning',
                        buttonText: 'Okey',
                      });
                    }
                  } else {
                    Toast.show({
                      text: 'Please check to configuration to bill / receipt printer before.',
                      buttonText: 'Okay',
                      type: 'warning',
                    });
                  }
                }}
              />
              <Button
                title={`Print Bill`}
                buttonStyle={[
                  styles.buttonPayment,
                  {
                    backgroundColor: 'orange',
                  },
                ]}
                titleStyle={{
                  color: 'black',
                }}
                onPress={() => {
                  if (printer) {
                    if (printerConnected) {
                      printBill();
                    } else {
                      Toast.show({
                        text: 'The printer is not response, Please re-check your printer status agian.',
                        type: 'warning',
                        buttonText: 'Okey',
                      });
                    }
                  } else {
                    Toast.show({
                      text: 'Please check to configuration to bill / receipt printer before.',
                      buttonText: 'Okay',
                      type: 'warning',
                    });
                  }
                }}
              />
              <Button
                title={'Close Order'}
                buttonStyle={[
                  styles.buttonPayment,
                  {
                    backgroundColor: 'green',
                  },
                ]}
                titleStyle={{
                  color: 'black',
                }}
                onPress={() => {
                  try {
                    if (
                      order.paymentType === 'cash' &&
                      order.payChange <= 0 &&
                      order.payReceive <= 0
                    ) {
                      throw '';
                    }

                    Alert.alert(
                      'Close Order',
                      'Do you confirm to close order?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            updateOrder(_order.id, {
                              orderStatus: 'closed',
                            }).then(async () => {
                              clearCurrentOrder();
                              if (order.paymentType === 'cash') {
                                await openCashDrawer();
                              }
                            });
                          },
                        },
                      ]
                    );
                  } catch (error) {
                    Alert.alert(
                      'Invalid Input',
                      'This Bill has applied the CASH payment, Please input the payment receive.',
                      []
                    );
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonPayment: {
    margin: 4,
    minWidth: 120,
  },
  printButton: {
    backgroundColor: 'orange',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: 'white',
  },
  paymentButton: {
    backgroundColor: 'blue',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  contentItem: {
    backgroundColor: 'grey',
    height: '100%',
    flex: 3,
  },
  contentCalculator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: 2,
    display: 'flex',
    padding: 10,
  },
  textLabel: {
    fontWeight: 'bold',
  },
  footerList: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
  },
});

export default withNavigation(CheckoutScreen);
