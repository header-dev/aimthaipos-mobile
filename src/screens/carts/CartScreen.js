import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Alert, FlatList } from 'react-native';
import { ButtonGroup, Header, ListItem, Text } from 'react-native-elements';
import { Toast, Button } from 'native-base';
import { navigate } from '../../navigationRef';
import { Context as SaleContext } from './../../context/SaleContext';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { ActivityIndicator } from 'react-native';
import { priceNumberFormat } from '../../utils/NumberUtil';
import _ from 'lodash';
import currency from 'currency.js';
import { NetPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import moment from 'moment';
import { Context as AuthContext } from './../../context/AuthContext';
import { Context as PrinterContext } from './../../context/PrinterContext';
import {
  BOLD_ON,
  BOLD_OFF,
  TXT_2HEIGHT,
  TXT_2HEIGHT_OFF,
  TXT_ALIGN_CT,
  TXT_2WIDTH,
  TXT_2WIDTH_OFF,
  TXT_DOUBLE,
  TXT_DOUBLE_OFF,
  TXT_ALIGN_LT,
  TXT_ALIGN_LT_OFF,
  TXT_ALIGN_RT,
  TXT_ALIGN_RT_OFF,
} from '../../constants';
import { ScrollView } from 'react-native';

const CartScreen = ({ navigation }) => {
  const {
    state: { order, isLoadingOrderDetail, currentOrder },
    fetchOrderById,
    fetchCurrentOrder,
    updateOrder,
  } = useContext(SaleContext);

  const [printer, setPrinter] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);

  const [headerTitle, setHeaderTitle] = useState(``);
  const _orderId = navigation.getParam('_orderId');
  const _headerCaption = navigation.getParam('_headerCaption');
  const _tableNo = navigation.getParam('_tableNo');

  const { getKitchenPrinter } = useContext(PrinterContext);

  const {
    state: { user },
    getUser,
  } = useContext(AuthContext);

  useEffect(() => {
    getKitchenPrinter().then(async (result) => {
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
    if (currentOrder) {
      let orderNo = currentOrder.orderNo;
      let table =
        currentOrder.orderType === 'dine-in' && currentOrder.tableTransactions
          ? ` - Table : ${currentOrder.tableTransactions
              .map((e) => e.table.table_name)
              .join(',')}`
          : ``;

      setHeaderTitle(`${orderNo} ${table}`);
    }
    return () => {};
  }, [currentOrder]);

  const renderSetMenu = (item) => {
    let menu = item.map((m) => {
      let p = `${m.product?.name}`;

      if (m.protein) {
        p += `-(${m.protein?.name})`;
      }

      return p;
    });

    return _.join(menu, ', ');
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        key={item.id}
        // disabled={item.makePrinted}
        onPress={() => {
          navigate('EditItemCart', {
            _orderDetail: item,
            _orderId: _orderId,
            _totalDetail: order.orderDetails.length,
          });
        }}
      >
        <ListItem.Content>
          <View style={{ flexDirection: 'row' }}>
            <ListItem.Title h4>
              {item.product.name}{' '}
              {item.makeTakeAway || order.orderType === 'take-away'
                ? '(TA)'
                : ''}{' '}
              x {item.quantity}
            </ListItem.Title>
          </View>
          <ListItem.Subtitle style={{ fontStyle: 'italic' }}>
            Price : $ {priceNumberFormat(item.priceAdditionPrice)}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ fontStyle: 'italic' }}>
            Discount : - {item.discount}
          </ListItem.Subtitle>
          {item.makePrinted && (
            <ListItem.Subtitle style={{ color: 'green' }}>
              Print Status : Printed{' '}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        {item.protein && (
          <ListItem.Content style={{ flexWrap: 'wrap', height: 100 }}>
            <ListItem.Title h4>Protien</ListItem.Title>
            <ListItem.Subtitle style={{ fontStyle: 'italic' }}>
              {item.protein.name}
            </ListItem.Subtitle>
          </ListItem.Content>
        )}
        <ListItem.Content style={{ flexWrap: 'wrap', height: 100 }}>
          {item.orderRequest && <ListItem.Title>Note</ListItem.Title>}
          {item.orderRequest && item.orderRequest.no_garlic && (
            <ListItem.Title style={styles.colorTextRequest}>
              No Garlic
            </ListItem.Title>
          )}
          {item.orderRequest && item.orderRequest.no_peanut && (
            <ListItem.Title style={styles.colorTextRequest}>
              No Peanut
            </ListItem.Title>
          )}
          {item.orderRequest && item.orderRequest.no_onion && (
            <ListItem.Title style={styles.colorTextRequest}>
              No Onion
            </ListItem.Title>
          )}
          {item.orderRequest && item.orderRequest.no_beanshot && (
            <ListItem.Title style={styles.colorTextRequest}>
              No Beanshot
            </ListItem.Title>
          )}
          {item.orderRequest && item.orderRequest.no_chilli && (
            <ListItem.Title style={styles.colorTextRequest}>
              No Chilli
            </ListItem.Title>
          )}
          {item.orderRequest && item.orderRequest.no_mind && (
            <ListItem.Title style={styles.colorTextRequest}>
              Mild
            </ListItem.Title>
          )}
          {item.orderRequest && item.orderRequest.no_spicy && (
            <ListItem.Title style={styles.colorTextRequest}>
              Spicy
            </ListItem.Title>
          )}
        </ListItem.Content>
        <ListItem.Content style={{ flexWrap: 'wrap', flex: 1 }}>
          <ListItem.Title>SET MENU</ListItem.Title>
          <ListItem.Subtitle style={{ color: 'blue' }}>
            {renderSetMenu(item.setmenus)}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content style={{ flexWrap: 'wrap', flex: 1 }}>
          {item.orderRequest && (
            <ListItem.Title>{item.orderRequest.remark}</ListItem.Title>
          )}
        </ListItem.Content>
        <View style={styles.boxTotalPrice}>
          <Text style={{ color: 'white', fontSize: 20 }}>
            {currency(item.totalAmount, { separator: ',' }).format()}
          </Text>
        </View>
      </ListItem>
    );
  };

  const renderTotal = () => {
    const totalAmount = _.sumBy(order.orderDetails, 'totalAmount');
    let serCharge = (order.serviceCharge / 100) * totalAmount;
    let total = parseFloat(totalAmount + serCharge - order.promotionAmount);
    return currency(total, { separator: ',' }).format();
  };

  const menuItem = (item, protein) =>
    item + protein.padStart(25 - item.length, '.');

  const printOrder = () => {
    // const orderDetail = _.filter(order.orderDetails, ['makePrinted', false]);
    const orderDetail = order.orderDetails;
    if (orderDetail.length > 0) {
      Alert.alert('Confirm', 'Are you sure you want to order ?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await NetPrinter.connectPrinter(
              printer.ipAddress || '',
              printer.port || 9100
            );
            updateOrder(order.id, {
              orderStatus: 'ordered',
            })
              .then(async () => {
                const jobDate = moment().format('DD/MM/YYYY HH:mm:ss');
                const orderPrint = _.orderBy(
                  orderDetail,
                  (item) => item.product.category.dataLevel,
                  ['asc']
                );
                let allContent = ``;
                let allContent2 = ``;
                let headerContent = `${TXT_ALIGN_CT}${TXT_2HEIGHT}${BOLD_ON}JOB LIST${BOLD_OFF}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                headerContent += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${jobDate}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                headerContent += `${TXT_ALIGN_CT}--------------------------------${TXT_ALIGN_CT}\n`;
                let contentType = ``;
                if (order.orderType === 'take-away') {
                  contentType = `Take Away`;
                } else if (order.orderType === 'partner') {
                  contentType = `Partner : ${order.partner.name}`;
                } else if (order.orderType === 'delivery') {
                  contentType = `Delivery`;
                } else {
                  contentType = `Table No # ${_tableNo}`;
                }
                headerContent += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${
                  currentOrder && currentOrder.orderNo
                }      ${contentType}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                headerContent += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${
                  user && user.username
                }${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                headerContent += `${TXT_ALIGN_CT}--------------------------------${TXT_ALIGN_CT}\n`;
                let contentProduct = ``;
                _.orderBy(orderPrint, 'category.dataLevel').map((i) => {
                  let setmenus = ``;
                  if (i.setmenus) {
                    // setmenus = renderSetMenu(i.setmenus);
                    i.setmenus.map((sm) => {
                      setmenus += `${TXT_ALIGN_LT}${TXT_DOUBLE}${
                        menuItem(
                          sm.product?.name,
                          sm.protein ? sm.protein?.name : ''
                        ) + '\n'
                      }${TXT_DOUBLE_OFF}${TXT_ALIGN_CT}`;
                    });
                  }

                  let request = ``;
                  if (i.orderRequest) {
                    let req = [
                      i.orderRequest.no_garli ? 'No GarLic' : null,
                      i.orderRequest.no_peanut ? 'No Peanut' : null,
                      i.orderRequest.no_onion ? 'No Onion' : null,
                      i.orderRequest.no_beanshot ? 'No Beanshot' : null,
                      i.orderRequest.no_chilli ? 'No Chilli' : null,
                      i.orderRequest.no_mind ? 'Mild' : null,
                      i.orderRequest.no_spicy ? 'Spicy' : null,
                    ];
                    let remark = ``;
                    if (i.orderRequest.remark) {
                      remark = `${i.orderRequest.remark}`;
                    }
                    request = `${TXT_ALIGN_CT}${TXT_DOUBLE}${
                      req.length ? '-' + req.filter(Boolean).join(',') : ''
                    }${TXT_DOUBLE_OFF}${TXT_ALIGN_CT}${
                      remark
                        ? '\n' +
                          TXT_ALIGN_CT +
                          TXT_DOUBLE +
                          remark +
                          TXT_DOUBLE_OFF +
                          TXT_ALIGN_CT
                        : ''
                    }\n`;
                  }
                  let wordTakeAway = ``;
                  if (
                    i.makeTakeAway ||
                    order.orderType === 'take-away' ||
                    order.orderType === 'partner'
                  ) {
                    wordTakeAway = '(TA)';
                  }
                  contentProduct += `${TXT_ALIGN_LT}${TXT_DOUBLE}${
                    i.quantity
                  } - ${menuItem(
                    wordTakeAway + i.product.name,
                    i.protein ? i.protein.name : ''
                  )}${TXT_DOUBLE_OFF}${TXT_ALIGN_CT}
                  ${
                    setmenus
                      ? '\n' +
                        TXT_ALIGN_LT +
                        TXT_DOUBLE +
                        'Set Menu : ' +
                        TXT_ALIGN_LT +
                        '\n' +
                        setmenus +
                        TXT_DOUBLE_OFF
                      : '\n'
                  }
                  ${request ? '\n' + request : '\n'}`;
                });
                allContent = `${headerContent}${contentProduct}`;
                allContent += `--------------------------------\n`;
                await NetPrinter.printBill(allContent);
                allContent2 += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${BOLD_ON}*****COPY*****${BOLD_OFF}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n--------------------------------\n`;
                let contentType2 = ``;
                if (order.orderType === 'take-away') {
                  contentType2 = `Take Away`;
                } else if (order.orderType === 'partner') {
                  contentType = `Partner : ${order.partner.name}`;
                } else if (order.orderType === 'delivery') {
                  contentType2 = `Delivery`;
                } else {
                  contentType2 = `Table No # ${_tableNo}`;
                }
                allContent2 += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${jobDate}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n${TXT_ALIGN_CT}${TXT_2HEIGHT}${
                  currentOrder && currentOrder.orderNo
                }      ${contentType}${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                allContent2 += `${TXT_ALIGN_CT}${TXT_2HEIGHT}${
                  user && user.username
                }${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                allContent2 += `${TXT_ALIGN_CT}${TXT_2HEIGHT}--------------------------------${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                allContent2 += contentProduct;
                allContent2 += `${TXT_ALIGN_CT}${TXT_2HEIGHT}--------------------------------${TXT_2HEIGHT_OFF}${TXT_ALIGN_CT}\n`;
                await NetPrinter.printBill(allContent2);
              })
              .then(() => {
                fetchOrderById(_orderId);
              });
            Toast.show({
              text: 'Order to kitchen or cocktail bar has successfully.',
              buttonText: 'Okay',
              type: 'success',
            });
          },
        },
      ]);
    } else {
      Toast.show({
        text: 'The order has already order.',
        buttonText: 'Okay',
        type: 'warning',
      });
    }
  };

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => {
          getUser();
          fetchCurrentOrder();
          fetchOrderById(_orderId);
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
            navigate('Sale');
          },
        }}
        centerComponent={{
          text: headerTitle,
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
      />
      <View style={styles.sectionMenu}>
        <ScrollView horizontal>
          <Button
            rounded
            block
            onPress={() => {
              if (printerConnected) {
                printOrder();
              } else {
                Toast.show({
                  text: 'The printer is not response, Please re-check your printer status agian.',
                  type: 'warning',
                  buttonText: 'Okey',
                });
              }
            }}
            style={styles.buttonMenu}
          >
            <Text style={styles.textButton}>ORDER</Text>
          </Button>
          <Button
            rounded
            block
            onPress={() => {
              updateOrder(order.id, {
                serviceCharge: order.serviceCharge > 0 ? 0.0 : 10.0,
              }).then(() => {
                fetchOrderById(_orderId);
                Toast.show({
                  text:
                    order.serviceCharge > 0
                      ? 'The service charge has cancelled.'
                      : 'The service charge has added.',
                  buttonText: 'Okay',
                  type: 'success',
                });
              });
            }}
            style={styles.buttonMenu}
          >
            {order.serviceCharge > 0 ? (
              <Text style={styles.textButton}>SERVICE CHARGE (NONE)</Text>
            ) : (
              <Text style={styles.textButton}>SERVICE CHARGE (ACTIVE)</Text>
            )}
          </Button>
          <Button
            rounded
            block
            onPress={() => {
              navigate('Checkout', {
                _orderId: _orderId,
                _orderDetails: order.orderDetails,
                _order: order,
                _headerCaption: _headerCaption,
                _tableNo: _tableNo,
              });
            }}
            style={styles.buttonMenu}
          >
            <Text style={styles.textButton}>CHECKOUT</Text>
          </Button>
          <Button
            rounded
            block
            onPress={() => {
              navigate('Promotion', {
                _orderId: _orderId,
                _amount: order && _.sumBy(order.orderDetails, 'totalAmount'),
              });
            }}
            style={styles.buttonMenu}
          >
            <Text style={styles.textButton}>PROMO/DISCOUNT</Text>
          </Button>
          <Button
            rounded
            block
            onPress={() => {
              navigate('MergeTable', {
                _orderId: _orderId,
              });
            }}
            style={styles.buttonMenu}
          >
            <Text style={styles.textButton}>MERGE TABLE</Text>
          </Button>
        </ScrollView>
      </View>
      <View
        style={{
          margin: 5,
          height: '100%',
        }}
      >
        <>
          <View style={styles.headerRow}>
            <View
              style={{
                padding: 5,
                margin: 2,
              }}
            >
              <View style={styles.textTotal}>
                <Text style={styles.textLabel}>Sub-Total : </Text>
                <Text>
                  {order &&
                    currency(_.sumBy(order.orderDetails, 'totalAmount'), {
                      separator: ',',
                    }).format()}
                </Text>
              </View>
              <View style={styles.textTotal}>
                <Text style={styles.textLabel}>Promo / Discount : </Text>
                <Text>
                  -{' '}
                  {order &&
                    currency(order.promotionAmount, {
                      separator: ',',
                    }).format()}{' '}
                  ({order && order.promotion && order.promotion.name})
                </Text>
              </View>
              <View style={styles.textTotal}>
                <Text style={styles.textLabel}>Service Charge : </Text>
                <Text>{order.serviceCharge} (%)</Text>
              </View>
              <View style={styles.textTotal}>
                <Text style={styles.textLabel}>Total : </Text>
                <Text>{order && renderTotal()}</Text>
              </View>
            </View>
            {order && order.customer && (
              <View
                style={{
                  backgroundColor: 'grey',
                  padding: 10,
                  margin: 5,
                  width: 'auto',
                }}
              >
                <Text style={styles.textLabel}>Customer</Text>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Street : </Text>
                  <Text>{order.customer.name}</Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>City : </Text>
                  <Text>{order.customer.city}</Text>
                  <Text style={styles.textLabel}>State : </Text>
                  <Text>{order.customer.state}</Text>
                </View>
                <View style={styles.textTotal}>
                  <Text style={styles.textLabel}>Postal Code : </Text>
                  <Text>{order.customer.postalcode}</Text>
                </View>
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            {isLoadingOrderDetail ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={
                  order &&
                  _.orderBy(
                    order.orderDetails,
                    (item) => item.product.category.dataLevel,
                    ['asc']
                  )
                }
                renderItem={(item) => renderItem(item)}
                contentContainerStyle={{ paddingBottom: 120 }}
              />
            )}
          </View>
        </>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionMenu: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 5,
  },
  buttonMenu: {
    elevation: 0,
    shadowOpacity: 0,
    borderColor: 'green',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    minWidth: 140,
  },
  headerRow: { justifyContent: 'space-between', flexDirection: 'row' },
  textLabel: {
    fontWeight: 'bold',
  },
  badgeQty: { padding: 10 },
  textQty: {
    fontSize: 20,
    color: 'white',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSwipe: {
    flex: 1,
    padding: 5,
    width: 80,
    backgroundColor: 'blue',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  contentInset: { top: 0, bottom: 120, left: 0, right: 0 },
  swipeRow: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textTotal: { flexDirection: 'row', padding: 2 },
  colorTextRequest: { color: 'red' },
  boxTotalPrice: {
    backgroundColor: 'grey',
    minWidth: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_auth: {
    minWidth: 150,
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 1,
    marginBottom: 8,
    height: 53,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  textButton: {
    color: 'green',
  },
  buttonDiscount: {
    minWidth: 150,
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    marginBottom: 8,
    height: 53,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  textButtonDiscount: {
    color: 'orange',
  },
});

export default withNavigation(CartScreen);
