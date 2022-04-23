import React from 'react'
import { View } from 'react-native'
import { Col, Grid, Row } from 'react-native-easy-grid'
import { Text } from 'react-native-elements'
import currency from 'currency.js'
import _ from 'lodash'

export default function ReductionReportSummaryTable({
    data,
    partner,
    card
}) {


    const renderPartnerTable = () => {
        return partner.map(i => {

            const partnerNameFilter = _.filter(data, { partner: { name: i.name } })

            const calTotal = partnerNameFilter.map(i => {
                return {
                    actualPay: i.orderType === "partner" ? Number(i.actualPay - (i.actualPay * (Number(i.partner.percentage) / 100))) : 0,
                }
            })

            const sumPartnerPartnerValue = _.sumBy(partnerNameFilter, 'actualPay')
            const sumTotal = _.sumBy(calTotal, 'actualPay')

            return (
                <Row>
                    <Col>
                        <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 30 }} >{i.name}</Text>
                        </View>
                    </Col>
                    <Col>
                        <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 30 }}>{currency(sumPartnerPartnerValue, { separator: ',' }).format()}</Text>
                        </View>
                    </Col>
                    <Col>
                        <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 30 }}>{parseFloat(i.percentage).toFixed(2)} %</Text>
                        </View>
                    </Col>
                    <Col>
                        <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center', backgroundColor: '#FFFF99' }}>
                            <Text style={{ textAlign: 'center', fontSize: 30 }}>{currency(sumTotal, { separator: ',' }).format()}</Text>
                        </View>
                    </Col>
                </Row>
            )
        }
        )

    }

    const renderCardTable = () => {

        const cardFilter = _.filter(data, { paymentType: "card" })

        const calTotal = cardFilter.map(i => {
            return {
                actualPay: i.paymentType === "card" ? Number(i.actualPay - (i.actualPay * (card.providerFee / 100))) : 0,
            }
        })

        const sumCardValue = _.sumBy(cardFilter, 'actualPay')
        const sumTotal = _.sumBy(calTotal, 'actualPay')

        return (
            <Row>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 30 }} >Card</Text>
                    </View>
                </Col>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>{currency(sumCardValue, { separator: ',' }).format()}</Text>
                    </View>
                </Col>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>{card.providerFee} %</Text>
                    </View>
                </Col>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, backgroundColor: '#FFFF99', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>{currency(sumTotal, { separator: ',' }).format()}</Text>
                    </View>
                </Col>
            </Row>
        )

    }

    return (
        <Grid style={{ margin: 50 }} >
            <Row>
                <Col>
                </Col>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, backgroundColor: '#35CD96', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', fontSize: 30 }}>Sale Amount</Text>
                    </View>
                </Col>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, backgroundColor: '#35CD96', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', fontSize: 30 }}>Reduction(%)</Text>
                    </View>
                </Col>
                <Col>
                    <View style={{ width: '100%', height: '100%', borderWidth: 0.5, backgroundColor: '#35CD96', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', fontSize: 30 }}>Total</Text>
                    </View>
                </Col>
            </Row>
            {renderCardTable()}
            {renderPartnerTable()}
        </Grid>
    )
}
