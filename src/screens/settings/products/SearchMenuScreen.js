import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Body, Text } from 'native-base';
import useSaveMenuHook from '../../../hooks/useSaveMenuHook';

import { Context as MenuContext } from './../../../context/MenuContext';
import { Context as CategoryContext } from './../../../context/CategoryContext';
import { Context as PrinterContext } from './../../../context/PrinterContext';

import MenuSearchForm from '../../../components/MenuSearchForm';
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
const MenuFormSchema = Yup.object().shape({
  name: Yup.string().required('Please enter a name.'),
  type: Yup.string().required('Please enter a type.'),
  categoryId: Yup.string().required('Please enter a category.'),
  cost: Yup.number().required('Please enter a cost.'),
  price: Yup.number().required('Please enter a base price 1.'),
  specialPrice: Yup.number().required('Please enter a base price 2.'),
});
const SearchMenuScreen = ({ navigation }) => {
  const {
    state: { isLoading },
  } = useContext(MenuContext);
  const {
    state: { categories },
    fetchCategory,
  } = useContext(CategoryContext);

  const [saveMenu] = useSaveMenuHook();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container style={{ backgroundColor: '#fff' }}>
        <NavigationEvents
          onWillFocus={() => {
            fetchCategory('');
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
            text: 'Filter Menu List',
            style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
          }}
        />
        <MenuSearchForm
          values={{
            name: '',
            type: '',
            categoryId: '',
            subsetmenu: false,
          }}
          categories={categories}
          onSubmit={(value) => {
            navigation.state.params.onFilter(value);
            navigation.goBack();
          }}
          isLoading={isLoading}
        />
      </Container>
    </SafeAreaView>
  );
};

export default withNavigation(SearchMenuScreen);
