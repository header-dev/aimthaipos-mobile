import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import SaleRequestForm from '../../components/sales/SaleRequestForm';
import { Context as SaleContext } from './../../context/SaleContext';
import { Container, Body } from 'native-base';
import { navigate } from '../../navigationRef';
import { Divider } from 'react-native-paper';
import { isRequest } from '../../utils/DisplayUtil';
import { ActivityIndicator } from 'react-native';

const SaleRequestScreen = ({ navigation }) => {
  const _orderId = navigation.getParam('_orderId');
  const _proteinId = navigation.getParam('_proteinId');
  const _addition_price = navigation.getParam('_addition_price');
  const _menu = navigation.getParam('_menu');
  const _makeTakeAway = navigation.getParam('_makeTakeAway');
  const _partnerPrice = navigation.getParam('_partnerPrice');
  const _quantity = navigation.getParam('_quantity');

  const [isSubmit, setIsSubmit] = useState(false);

  const { createOrderDetail } = useContext(SaleContext);

  return (
    <Container style={{ backgroundColor: '#fff' }}>
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
          text: 'Request Form',
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
        rightComponent={{
          icon: 'close',
          color: '#fff',
          onPress: () => {
            navigate('Sale');
          },
        }}
      />
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text h3>{_menu.name}</Text>
        <Divider />
      </View>
      {isSubmit && <ActivityIndicator style={{ margin: 10 }} />}
      <SaleRequestForm
        values={{
          no_garlic: false,
          no_peanut: false,
          no_onion: false,
          no_beanshot: false,
          no_chilli: false,
          no_mind: false,
          no_spicy: false,
          remark: '',
        }}
        isSubmit={isSubmit}
        onSubmit={(value) => {
          setIsSubmit(true);
          valueRequest = {};
          if (isRequest(value)) {
            valueRequest = {
              orderRequest: value,
            };
          }
          createOrderDetail({
            ...valueRequest,
            ..._menu,
            orderId: _orderId,
            proteinId: _proteinId,
            addition_price: _addition_price,
            quantity: _quantity,
            makeTakeAway: _makeTakeAway,
            partnerPrice: _partnerPrice,
          }).then(() => {
            setIsSubmit(false);
            navigate('Sale');
          });
        }}
      />
    </Container>
  );
};

export default withNavigation(SaleRequestScreen);
