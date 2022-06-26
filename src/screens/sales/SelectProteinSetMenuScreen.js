import React, { useContext } from 'react';
import { FlatList } from 'react-native';

import { Header, ListItem, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Context as ProteinContext } from './../../context/ProteinContext';
import { Context as SaleContext } from './../../context/SaleContext';

import { ActivityIndicator } from 'react-native';
import currencyJs from 'currency.js';
import { Alert } from 'react-native';
import { navigate } from '../../navigationRef';

const SelectProteinSetMenuScreen = ({ navigation }) => {
  const main_menu_id = navigation.getParam('main_menu_id');
  const productId = navigation.getParam('item');
  const selectItem = navigation.getParam('selectItem');
  const allSubMenu = navigation.getParam('allSubMenu');

  const {
    state: { proteins, isLoading, isRejected },
    fetchProtein,
  } = useContext(ProteinContext);

  const { addSetMenu, removeSetMenu } = useContext(SaleContext);

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => {
        navigation.state.params.onGoBack(item, selectItem, allSubMenu);
        navigation.goBack();
      }}
    >
      <MaterialCommunityIcons name="food-steak" size={50} color="#517fa4" />
      <ListItem.Content>
        <ListItem.Title>Protein Name : {item.name}</ListItem.Title>
        <ListItem.Subtitle>
          Addition Price :{' '}
          {currencyJs(item.addition_price, {
            separator: ',',
          }).format()}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <NavigationEvents
        onWillFocus={() => {
          fetchProtein('');
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
          text: `Select Protein`,
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
        rightComponent={{
          icon: 'close',
          color: '#fff',
          onPress: () => {
            navigation.goBack();
          },
        }}
      />
      {isLoading && <ActivityIndicator style={{ margin: 10 }} animating />}
      <FlatList
        keyExtractor={keyExtractor}
        data={proteins}
        renderItem={(item) => renderItem(item)}
      />
    </SafeAreaView>
  );
};

export default withNavigation(SelectProteinSetMenuScreen);
