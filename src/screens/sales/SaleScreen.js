import React, { useContext, useEffect, useState } from "react";
import Expo from "expo";
import { View, StyleSheet } from "react-native";
import { SearchBar, Image, Text, Header, BottomSheet, ListItem, Tooltip } from "react-native-elements";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Context as CategoryContext } from "./../../context/CategoryContext";
import { Context as SaleContext } from "./../../context/SaleContext";
import { Context as ProteinContext } from "./../../context/ProteinContext";
import { NavigationEvents, withNavigation } from "react-navigation";
import { BACKEND_URL, MENU_IMAGE } from "./../../constants";
import _ from "lodash";
import { MaterialIcons } from "@expo/vector-icons";
import { priceNumberFormat } from "./../../utils/NumberUtil";
import { navigate } from "../../navigationRef";
import { Button, Icon, Badge } from "react-native-elements";
import { TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { ScrollableTab, Tab, Tabs, Toast, Header as NativeHeader } from "native-base";
import { truncate } from "../../utils/FormatObjectUtil";
import { FlatGrid } from 'react-native-super-grid';
import { TouchableWithoutFeedback } from "react-native";
import currency from 'currency.js'
import ItemQuantityModal from "../../components/sales/ItemQuantityModal";

const SaleScreen = ({ navigation }) => {

  const [category, setCategory] = useState("ALL");
  const [menu, setMenu] = useState("ALL");
  const [segmentActive, setSegmentActive] = useState(0);
  const [showQuntityModal, setShowQuntityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [headerTitle, setHeaderTitle] = useState(``)

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

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          fetchCurrentOrder();
          fetchCategory();
          fetchMenuSale(1, "ALL", "Favorite");
          setSegmentActive(0);
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
            category === "Favorite" ? 1 : 0,
            search ? search : "ALL",
            category
          );
          setMenu(search ? search : "ALL");
        }}
        value={menu === "ALL" ? "" : menu}
      />
      <SegmentedControl
        values={["Favorite", ...categories.map((i) => i.name)]}
        selectedIndex={segmentActive}
        onChange={(event) => {
          setSegmentActive(event.nativeEvent.selectedSegmentIndex);
        }}
        onValueChange={(value) => {
          setCategory(value);
          let [cat] = _.filter(categories, { name: value })
          fetchMenuSale(value === "Favorite" ? 1 : 0, menu, value !== "Favorite" ? cat.id : "Favorite");
        }}
      />
      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      <FlatGrid
        itemDimension={130}
        data={menus}
        renderItem={({ item }) => (
          <View
            key={item.id}
            style={{
              flexDirection: "column",
              margin: 4,
              borderColor: "grey",
              borderWidth: 0.5,
            }}
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
            <View style={styles.footerCard}>
              <View style={{ flexDirection: "row" }}>
                <Tooltip popover={<Text>{item.name}</Text>}>
                  <MaterialIcons name="food-bank" size={22} color="green" />
                </Tooltip>
                <Text style={styles.textCard}>{truncate(item.name, 10)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textCard}>
                  {currentOrder.orderType === "partner" ? currency(item.specialPrice, { separator: ',' }).format() : currency(item.price, { separator: ',' }).format()}
                </Text>
                <MaterialIcons
                  name={item.favorite === 1 ? "favorite" : "favorite-outline"}
                  size={20}
                  color={item.favorite === 1 ? "orange" : "black"}
                  onPress={() => {
                    saveFavorite(item.id, item.favorite);
                    fetchMenuSale(
                      category === "Favorite" ? 1 : 0,
                      menu,
                      category
                    );
                  }}
                />
              </View>
            </View>
          </View>
        )}
        spacing={4}
        style={{
          flex: 1,
          marginTop: 10
        }}
      />
      <ItemQuantityModal
        showModal={showQuntityModal}
        handleClose={() => {
          setShowQuntityModal(false);
        }}
        onSubmit={({ quantity }) => {
          setShowQuntityModal(false);

          const { id, name, price, specialPrice, type, category } = selectedProduct

          let makeToTakeAway = false
          
          /**if (currentOrder.orderType === 'take-away' && category.name !== "Lunch Special") {
            makeToTakeAway = true
          }**/
          
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
});

export default withNavigation(SaleScreen);
