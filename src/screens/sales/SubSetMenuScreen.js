import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Context as SaleContext } from './../../context/SaleContext';
import { Context as MenuContext } from './../../context/MenuContext';
import { Context as ProteinContext } from './../../context/ProteinContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ListItem,
  Header,
  Text as TextEl,
  Divider,
} from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import currencyJs from 'currency.js';
import { useEffect } from 'react';
import { useCallback } from 'react';
import Sheet, { SheetRef } from 'react-modal-sheet';
import { useRef } from 'react';
import { BACKEND_URL, MENU_IMAGE } from '@env';
import SelectMultiple from '@quanterdynamic/react-native-multiple-select';
import RBSheet from 'react-native-raw-bottom-sheet';
import { navigate } from '../../navigationRef';
import _ from 'lodash';

const SubSetMenuScreen = ({ navigation, route }) => {
  const menu = navigation.getParam('menu');
  const _orderId = navigation.getParam('_orderId');
  const _makeTakeAway = navigation.getParam('_makeTakeAway');
  const _partnerPrice = navigation.getParam('_partnerPrice');
  const _quantity = navigation.getParam('_quantity');
  const _submenus = navigation.getParam('submenus');

  const [selected, setSelected] = useState(new Map());
  const [selectMenu, setSelectMenu] = useState([]);
  const [isProteinOpen, setIsProteinOpen] = useState(false);
  const [menuSub, setMenuSub] = useState(_submenus);

  const addProtein = async (data, selectedItem, allmenus) => {
    const newSelected = new Map(selected);
    let dataSelect = newSelected.set(
      selectedItem.id,
      !selected.get(selectedItem.id)
    );

    let cmenu = [...allmenus];

    var index = await _.findIndex(cmenu, { id: selectedItem.id });

    let item = { ...cmenu[index] };

    item.proteinId = data.id;
    item.proteinName = data.name;
    item.selectedMenu = true;

    cmenu[index] = item;

    setMenuSub(cmenu);
    setSelected(dataSelect);
  };

  const setSelectedSub = async (id) => {
    let cmenu = [...menuSub];

    var index = await _.findIndex(cmenu, { id: id });

    let item = { ...cmenu[index] };
    item.selectedMenu = true;

    cmenu[index] = item;

    setMenuSub(cmenu);
  };

  const onSelect = useCallback(
    async (item) => {
      const newSelected = new Map(selected);
      if (!selected.get(item.id)) {
        newSelected.set(item.id, !selected.get(item.id));

        if (item.type === 'protein') {
          navigate('SelectProteinSetMenu', {
            main_menu_id: menu.productId,
            productId: item.id,
            selectItem: item,
            allSubMenu: menuSub,
            onGoBack: async (data, selectedItem, menuData) => {
              await addProtein(data, selectedItem, menuData);
            },
          });
        } else {
          setSelected(newSelected);
          setSelectedSub(item.id);
        }
      } else {
        newSelected.delete(item.id);
        setSelected(newSelected);
        await addProtein(
          {
            id: null,
            name: null,
            selectMenu: false,
          },
          item,
          menuSub
        );
      }
    },
    [selected]
  );

  const renderItem = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        containerStyle={{
          backgroundColor: !!selected.get(item.id) ? 'gray' : 'white',
        }}
        onPress={() => {
          onSelect(item);
        }}
      >
        <Image
          style={{
            height: 100,
            width: 100,
          }}
          resizeMode="cover"
          source={{
            uri: `${MENU_IMAGE}${item.photo}`,
          }}
        />
        <ListItem.Content>
          <ListItem.Title>Name : {item.name}</ListItem.Title>
          <ListItem.Subtitle>
            Price :{' '}
            {currencyJs(item.price, {
              separator: ',',
            }).format()}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          {item.type === 'protein' && item.proteinId && (
            <>
              <ListItem.Subtitle
                style={{
                  color: 'blue',
                }}
              >
                Protein : {item?.proteinName}
              </ListItem.Subtitle>
            </>
          )}
        </ListItem.Content>
      </ListItem>
    );
  };

  const keyExtractor = (item, index) => index.toString();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: '#2E7C31',
        }}
        leftComponent={{
          icon: 'close',
          color: '#fff',
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: `Select Sub Set Menu`,
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
        rightComponent={{
          icon: 'forward',
          color: '#fff',
          onPress: async () => {
            let filterMenu = await _.filter(menuSub, {
              selectedMenu: true,
            }).map((m) => {
              return {
                proteinId: m.proteinId ? m.proteinId : null,
                productId: m.id,
              };
            });

            navigate('SaleRequestSetMenu', {
              _subMenu: filterMenu,
              _menu: menu,
              _orderId: _orderId,
              _makeTakeAway: _makeTakeAway,
              _partnerPrice: _partnerPrice,
              _quantity: _quantity,
            });
          },
        }}
      />
      {/* {isLoading && <ActivityIndicator style={{ margin: 10 }} animating />} */}
      <NavigationEvents onWillFocus={() => {}} onDidFocus={() => {}} on />
      <View style={{ margin: 10 }}>
        <Image
          style={{
            height: 250,
          }}
          resizeMode="contain"
          source={{
            uri: `${MENU_IMAGE}${menu.photo}`,
          }}
        />
      </View>
      <View style={{ margin: 10 }}>
        <TextEl h4>{menu.name}</TextEl>
      </View>
      <FlatList
        extraData={selected}
        keyExtractor={keyExtractor}
        data={menuSub}
        renderItem={(item) => renderItem(item)}
      />
    </SafeAreaView>
  );
};

export default withNavigation(SubSetMenuScreen);
