import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Body } from 'native-base';
import useSaveMenuHook from '../../../hooks/useSaveMenuHook';
import MenuForm from '../../../components/MenuForm';
import { Context as MenuContext } from './../../../context/MenuContext';
import { Context as CategoryContext } from './../../../context/CategoryContext';
import { Context as PrinterContext } from './../../../context/PrinterContext';
import * as Yup from 'yup';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';

const MenuFormSchema = Yup.object().shape({
  name: Yup.string().required('Please enter a name.'),
  type: Yup.string().required('Please enter a type.'),
  categoryId: Yup.string().required('Please enter a category.'),
  cost: Yup.number().required('Please enter a cost.'),
  price: Yup.number().required('Please enter a base price 1.'),
  specialPrice: Yup.number().required('Please enter a base price 2.'),
});
const PartnerEditScreen = ({ navigation }) => {
  const {
    state: { isRejected, isLoading },
  } = useContext(MenuContext);

  const _menu = navigation.getParam('_menu');
  const {
    state: { categories },
    fetchCategory,
  } = useContext(CategoryContext);

  const [saveMenu] = useSaveMenuHook();

  return (
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
          text: 'Menu Create',
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
      />
      <MenuForm
        values={{
          name: _menu.name,
          cost: `${_menu.cost}`,
          price: `${_menu.price}`,
          specialPrice: `${_menu.specialPrice}`,
          categoryId: `${_menu.categoryId}`,
          type: _menu.type,
          photo: _menu.photo,
          printerId: _menu.printerId,
          subSetMenu: _menu.subSetMenu,
        }}
        validateSchema={MenuFormSchema}
        onSubmit={(photo, value) => {
          value.id = _menu.id;
          saveMenu(photo, value);
        }}
        categories={categories}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default withNavigation(PartnerEditScreen);
