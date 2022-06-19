import React from 'react';
import { View } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Text } from 'react-native-elements';
import currency from 'currency.js';
import _ from 'lodash';

export default function ReportSummaryTable({ data }) {
  const recalculate = data.map((i) => {
    // var actualPayTotal = _.sumBy(i.orderDetails, "totalAmount") +
    // (i.serviceCharge / 100) *
    // _.sumBy(i.orderDetails, "totalAmount") +
    // ((i.cardCharge / 100) *
    //     _.sumBy(i.orderDetails, "totalAmount"))
    // -
    // i.promotionAmount
    // + i.tip + i.diffRoundup

    var actualPayTotal =
      i.pay +
      (i.serviceCharge / 100) * i.pay +
      (i.cardCharge / 100) * i.pay +
      i.diffRoundup;

    return {
      actualPay: actualPayTotal,
      // actualPay: _.sumBy(i.orderDetails, "totalAmount") +
      //     (i.serviceCharge / 100) *
      //     _.sumBy(i.orderDetails, "totalAmount") +
      //     ((i.cardCharge / 100) *
      //         _.sumBy(i.orderDetails, "totalAmount"))
      //     -
      //     i.promotionAmount
      //     + i.tip + i.diffRoundup,
      // actualPay: i.orderType === "partner" ? Number(actualPayTotal - (actualPayTotal * (Number(i.partner.percentage) / 100))) : i.paymentType === "card" ? Number(actualPayTotal - (actualPayTotal * (i.cardCharge / 100))) : actualPayTotal,
      paymentType: i.paymentType,
      orderType: i.orderType,
    };
  });

  const dineInValue = _.filter(recalculate, { orderType: 'dine-in' });
  const takeAwayValue = _.filter(recalculate, { orderType: 'take-away' });
  const deliveryValue = _.filter(recalculate, { orderType: 'delivery' });
  const partnerValue = _.filter(recalculate, { orderType: 'partner' });

  const cashDineInValue = _.filter(dineInValue, { paymentType: 'cash' });
  const cashTakeAwayValue = _.filter(takeAwayValue, { paymentType: 'cash' });
  const cashDeliveryValue = _.filter(deliveryValue, { paymentType: 'cash' });

  const payIdDineInValue = _.filter(dineInValue, { paymentType: 'pay-id' });
  const payIdTakeAwayValue = _.filter(takeAwayValue, { paymentType: 'pay-id' });
  const payIdDeliveryValue = _.filter(deliveryValue, { paymentType: 'pay-id' });

  const cardDineInValue = _.filter(dineInValue, { paymentType: 'card' });
  const cardTakeAwayValue = _.filter(takeAwayValue, { paymentType: 'card' });
  const cardDeliveryValue = _.filter(deliveryValue, { paymentType: 'card' });

  const takeAwayDineInValue = _.filter(dineInValue, {
    paymentType: 'take-away',
  });
  const takeAwayTakeAwayValue = _.filter(takeAwayValue, {
    paymentType: 'take-away',
  });
  const takeAwayDeliveryValue = _.filter(deliveryValue, {
    paymentType: 'take-away',
  });

  const partnerPartnerValue = _.filter(partnerValue, {
    paymentType: 'partner',
  });
  const sumCashDineInValue = _.sumBy(cashDineInValue, 'actualPay');

  const sumPayIdDineInValue = _.sumBy(payIdDineInValue, 'actualPay');
  const sumCardDineInValue = _.sumBy(cardDineInValue, 'actualPay');
  const sumTakeAwayDineInValue = _.sumBy(takeAwayDineInValue, 'actualPay');

  const sumCashTakeAwayValue = _.sumBy(cashTakeAwayValue, 'actualPay');
  const sumCardTakeAwayValue = _.sumBy(cardTakeAwayValue, 'actualPay');
  const sumPayIdTakeAwayValue = _.sumBy(payIdTakeAwayValue, 'actualPay');
  const sumTakeAwayTakeAwayValue = _.sumBy(takeAwayTakeAwayValue, 'actualPay');

  const sumCashDeliveryValue = _.sumBy(cashDeliveryValue, 'actualPay');
  const sumCardDeliveryValue = _.sumBy(cardDeliveryValue, 'actualPay');
  const sumPayIdDeliveryValue = _.sumBy(payIdDeliveryValue, 'actualPay');
  const sumTakeAwayDeliveryValue = _.sumBy(takeAwayDeliveryValue, 'actualPay');

  const sumPartnerPartnerValue = _.sumBy(partnerPartnerValue, 'actualPay');

  const totalDineIn =
    sumCashDineInValue +
    sumPayIdDineInValue +
    sumCardDineInValue +
    sumTakeAwayDineInValue;
  const totalTakeAway =
    sumCashTakeAwayValue +
    sumCardTakeAwayValue +
    sumPayIdTakeAwayValue +
    sumTakeAwayTakeAwayValue;
  const totalDelivery =
    sumCashDeliveryValue +
    sumCardDeliveryValue +
    sumPayIdDeliveryValue +
    sumTakeAwayDeliveryValue;

  const totalPartner = sumPartnerPartnerValue;

  return (
    <Grid style={{ margin: 10 }}>
      <Row>
        <Col></Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'red',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}
            >
              Dine-In
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'green',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}
            >
              Take Away
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'orange',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}
            >
              Delivery
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'cyan',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}
            >
              Partner
            </Text>
          </View>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Cash
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumCashDineInValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumCashTakeAwayValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumCashDeliveryValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(
                sumCashDineInValue +
                  sumCashTakeAwayValue +
                  sumCashDeliveryValue,
                { separator: ',' }
              ).format()}
            </Text>
          </View>
        </Col>
      </Row>
      <Row>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Card
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumCardDineInValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumCardTakeAwayValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumCardDeliveryValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(
                sumCardDineInValue +
                  sumCardTakeAwayValue +
                  sumCardDeliveryValue,
                { separator: ',' }
              ).format()}
            </Text>
          </View>
        </Col>
      </Row>
      <Row>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Pay ID
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumPayIdDineInValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumPayIdTakeAwayValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumPayIdDeliveryValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(
                sumPayIdDineInValue +
                  sumPayIdTakeAwayValue +
                  sumPayIdDeliveryValue,
                { separator: ',' }
              ).format()}
            </Text>
          </View>
        </Col>
      </Row>
      <Row>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Take Away
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumTakeAwayDineInValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumTakeAwayTakeAwayValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumTakeAwayDeliveryValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(
                sumTakeAwayDineInValue +
                  sumTakeAwayTakeAwayValue +
                  sumTakeAwayDeliveryValue,
                { separator: ',' }
              ).format()}
            </Text>
          </View>
        </Col>
      </Row>
      <Row>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Partner
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(0, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(sumPartnerPartnerValue, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(
                sumTakeAwayDineInValue +
                  sumTakeAwayTakeAwayValue +
                  sumTakeAwayDeliveryValue,
                { separator: ',' }
              ).format()}
            </Text>
          </View>
        </Col>
      </Row>
      <Row>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}
            >
              Total
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(totalDineIn, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(totalTakeAway, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(totalDelivery, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(totalPartner, { separator: ',' }).format()}
            </Text>
          </View>
        </Col>
        <Col>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 0.5,
              backgroundColor: 'yellow',
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              {currency(
                totalDineIn + totalTakeAway + totalPartner + totalDelivery,
                { separator: ',' }
              ).format()}
            </Text>
          </View>
        </Col>
      </Row>
    </Grid>
  );
}
