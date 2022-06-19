import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Context as SaleContext } from './../../context/SaleContext';

const SubSetMenuScreen = ({ navigation }) => {
  const {
    state: { menus, isLoading },
    fetchMenuSale,
  } = useContext(SaleContext);

  return (
    <View>
      <NavigationEvents
        onWillFocus={() => {
          fetchMenuSale(1, 'ALL', 'Favorite');
        }}
      />
      {menus.map((m) => {
        return <Text>{JSON.stringify(m)}</Text>;
      })}
    </View>
  );
};

export default withNavigation(SubSetMenuScreen);
