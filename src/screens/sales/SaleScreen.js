import React, { useContext, useEffect, useState } from "react";
import Expo from "expo";
import { View, StyleSheet } from "react-native";
import { SearchBar, Image, Text, Header, BottomSheet, ListItem, Tooltip } from "react-native-elements";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Context as CategoryContext } from "./../../context/CategoryContext";
import { Context as SaleContext } from "./../../context/SaleContext";
import { Context as ProteinContext } from "./../../context/ProteinContext";
import { NavigationEvents, withNavigation } from "react-navigation";
import { BACKEND_URL, MENU_IMAGE } from "@env";
import _ from "lodash";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { navigate } from "../../navigationRef";
import { Button, Icon, Badge, Card } from "react-native-elements";
import { TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { ScrollableTab, Tab, Tabs, Toast, Header as NativeHeader } from "native-base";
import { FlatGrid } from 'react-native-super-grid';
import currency from 'currency.js'
import ItemQuantityModal from "../../components/sales/ItemQuantityModal";
import SelectDropdown from 'react-native-select-dropdown'

const SaleScreen = ({ navigation }) => {

  const [category, setCategory] = useState({
    id: 1,
    name: "Favorite"
  });
  const [menu, setMenu] = useState("ALL");
  const [showQuntityModal, setShowQuntityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [headerTitle, setHeaderTitle] = useState(``)
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const {
    state: { categories },
    fetchCategory,
  } = useContext(CategoryContext);

  const [product, setProduct] = useState([])
  const [table, setTable] = useState(null)

  const {
    state: {
      menus,
      currentOrder,
      order,
      isLoading
    },
    fetchMenuSale,
    saveFavorite,
    fetchCurrentOrder,
    fetchOrderById,
    createOrderDetail,
    clearCurrentOrder,
  } = useContext(SaleContext);

  const {
    state: { proteins },
    fetchProtein,
  } = useContext(ProteinContext);

  useEffect(() => {
    if (currentOrder) {
      fetchOrderById(currentOrder.id);

      let orderNo = currentOrder.orderNo
      let table = currentOrder.orderType === 'dine-in' && currentOrder
        .tableTransactions ? ` - Table : ${currentOrder
          .tableTransactions.map((e) => e.table.table_no)
          .join(",")}` : ``
      setTable(table)
      setHeaderTitle(`${orderNo} ${table}`)
    }
    return () => { };
  }, [currentOrder, order]);

  const mapCategories = (item) => {
    let cloneItem = item
    cloneItem = [...cloneItem, { id: 1, name: 'Favorite' }]
    return _.sortBy(cloneItem, ['id'])
  }

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          fetchCurrentOrder();
          fetchCategory();
          fetchMenuSale(1, "ALL", "Favorite");
          fetchProtein();
        }}
      />
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: "#2E7C31"
        }}
        leftComponent={{
          icon: "home",
          color: "#fff",
          onPress: clearCurrentOrder,
        }}
        centerComponent={{
          text: headerTitle,
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
        rightComponent={() => (
          <TouchableOpacity
            onPress={() => {
              navigate("Cart", {
                _orderId: currentOrder && currentOrder.id,
                _headerCaption: headerTitle,
                _tableNo: table
              });
            }}
            disabled={!Boolean(order.orderDetails.length)}
          >
            <Icon
              name={`shopping-cart`}
              type="material-icon"
              color="white"
              size={25}
              containerStyle={{ marginRight: 15, paddingLeft: 10 }}
            />
            <Badge
              value={order && order.orderDetails.length}
              status="error"
              containerStyle={{
                position: "absolute",
                top: -4,
                right: 5,
              }}
            />
          </TouchableOpacity>
        )}
      />
      <SearchBar
        placeholder="Search"
        lightTheme
        onChangeText={(search) => {
          fetchMenuSale(
            category.id,
            search ? search : "ALL",
            category.name
          );
          setMenu(search ? search : "ALL");
        }}
        value={menu === "ALL" ? "" : menu}
      />
      <Card containerStyle={{
        flex: 1,
        paddingBottom: 55
      }}>
        <View style={styles.sectionCategories}>
          <Text style={styles.textCap}>
            Categories
          </Text>
          <SelectDropdown
            data={mapCategories(categories)}
            defaultValueByIndex={0}
            onSelect={async (selectedItem, index) => {
              setCategory({
                id: selectedItem.id,
                name: selectedItem.name
              })
              await fetchMenuSale(selectedItem.id, menu, selectedItem.name !== "Favorite" ? selectedItem.id : "Favorite");
            }}
            defaultValue={{category}}
            defaultButtonText={'Select category'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name
            }}
            rowTextForSelection={(item, index) => {
              return item.name
            }}
            buttonStyle={styles.dropdown4BtnStyle}
            buttonTextStyle={styles.dropdown4BtnTxtStyle}
          />
        </View>
        {isLoading && <ActivityIndicator />}
        <FlatGrid
          itemDimension={130}
          data={menus}
          renderItem={({ item }) => (
            <View
              key={item.id}
              style={styles.prodCardContent}
            >
              <TouchableOpacity
                onPress={() => {
                  if (currentOrder.orderStatus !== "closed") {
                    setSelectedProduct(item)
                    setShowQuntityModal(true)
                  } else {
                    Toast.show({
                      text: "This order has been closed.",
                      position: "top",
                      type: "warning"
                    })
                  }
                }}>
                <Image
                  style={styles.imageThumbnail}
                  resizeMode="cover"
                  resizeMethod="resize"
                  source={{ uri: `${MENU_IMAGE}${item.photo}` }}
                  transition={false}
                  PlaceholderContent={<ActivityIndicator />}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2
                }}
                onPress={() => {
                  saveFavorite(item.id, item.favorite);
                  fetchMenuSale(
                    category.id,
                    menu,
                    category.name !== "Favorite" ? category.id : category.name
                  );
                }}
              >
                <MaterialIcons
                  name={item.favorite === 1 ? "favorite" : "favorite-outline"}
                  size={30}
                  color={item.favorite === 1 ? "orange" : "black"}
                />
              </TouchableOpacity>
              <View style={styles.footerCard}>
                <Text style={styles.textProductName}>{item.name}</Text>
                <Text style={styles.textPrice}>
                  {currentOrder.orderType === "partner" ? currency(item.specialPrice, { separator: ',' }).format() : currency(item.price, { separator: ',' }).format()}
                </Text>
              </View>
            </View>
          )}
          spacing={4}
          style={{
            marginTop: 10,
          }}
        />
      </Card>
      <ItemQuantityModal
        showModal={showQuntityModal}
        handleClose={() => {
          setShowQuntityModal(false);
        }}
        onSubmit={({ quantity }) => {
          setShowQuntityModal(false);

          const { id, name, price, specialPrice, type, category } = selectedProduct

          let makeToTakeAway = false

          if (currentOrder.orderType === 'take-away') {
            makeToTakeAway = true
          }

          let partnerPrice = 0
          if (currentOrder.orderType === 'partner') {
            partnerPrice = currentOrder.partner.chargePrice
          }

          if (type === "protein") {
            navigate("SelectProtein", {
              menu: {
                productId: id,
                price: currentOrder.orderType === 'partner' ? specialPrice : price,
                name: name,
              },
              _orderId: currentOrder.id,
              _makeTakeAway: makeToTakeAway,
              _partnerPrice: partnerPrice,
              _quantity: quantity
            })
          } else {
            createOrderDetail({
              orderRequests: null,
              productId: id,
              price: currentOrder.orderType === 'partner' ? specialPrice : price,
              orderId: currentOrder && currentOrder.id,
              makeTakeAway: makeToTakeAway,
              partnerPrice: partnerPrice,
              quantity: quantity,
            }).then(() => {
              Toast.show({
                text:
                  "This menu is already to cart.",
                buttonText: "Okay",
                type: "success",
              });
              fetchOrderById(currentOrder.id);

            });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionCategories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCap: {
    fontSize: 18,
    fontWeight: "bold",
    marginEnd: 4,
  },
  textProductName: {
    textAlign: 'center',
    marginBottom: 4
  },
  textPrice: {
    textAlign: 'center'
  },
  prodCardContent: {
    flexDirection: "column",
    margin: 4,
    minHeight: 180,
  },
  contentGrid: {
    padding: 2,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    width: '100%',
    flex: 1,
  },
  textCard: {
    margin: 1,
    fontSize: 18,
  },
  footerCard: {
    margin: 2,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "auto",
    minWidth: 200
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown4BtnStyle: {
    width: '25%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
});

export default withNavigation(SaleScreen);
