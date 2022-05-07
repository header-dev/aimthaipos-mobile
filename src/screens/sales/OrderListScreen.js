import React, {
  useContext,
} from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  Avatar,
  ListItem,
  Text,
  Header,
} from "react-native-elements";
import { NavigationEvents, withNavigation } from "react-navigation";
import { Context as SaleContext } from "./../../context/SaleContext";
import { navigate } from "../../navigationRef";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import useGetOrderHook from "./../../hooks/sales/useGetOrderHook";
import useOpenOrderHook from "./../../hooks/sales/useOpenOrderHook";
import Moment from "moment";
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from "react-native-swipe-list";
import { PARTNER_IMAGE } from "@env"
import { SafeAreaView } from "react-native-safe-area-context";

const OrderListScreen = ({ navigation }) => {

  const {
    state: {
      orders,
      isLoadingOrder,
      isLoadingInitCashDrawer,
    },
    checkInitCashDrawer,
  } = useContext(SaleContext);

  const [getOrder] = useGetOrderHook();
  const [openOrderTransaction] = useOpenOrderHook();

  const keyExtractor = (item, index) => item.id.toString();

  const newOrder = () => {
    navigate("OrderTypeModal");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            getOrder();
            checkInitCashDrawer();
          }}
        />
        <Header
          placement="center"
          containerStyle={{
            backgroundColor: "#2E7C31",
          }}
          leftComponent={{
            icon: "menu",
            color: "#fff",
            onPress: () => {
              navigation.toggleDrawer()
            },
          }}
          centerComponent={{
            text: `Order List (${Moment().format("DD-MM-YYYY")})`,
            style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
          }}
          rightComponent={() => (
            <TouchableOpacity
              onPress={() => {
                newOrder()
              }}
            >
              <FontAwesome name="plus" size={25} color="white" />
            </TouchableOpacity>
          )}
        />
        <SwipeableFlatList
          closeOnScroll
          keyExtractor={keyExtractor}
          data={orders}
          renderItem={({ item }) => (
            <Animated.View>
              <ListItem bottomDivider key={item.id}>
                {item.orderType === "dine-in" && (
                  <Ionicons name="restaurant-outline" size={50} color="#517fa4" />
                )}
                {item.orderType === "take-away" && (
                  <FontAwesome name="shopping-bag" size={50} color="#517fa4" />
                )}
                {item.orderType === "delivery" && (
                  <MaterialIcons name="delivery-dining" size={50} color="#517fa4" />
                )}
                {item.orderType === "partner" && (
                  <Avatar
                    rounded
                    source={{
                      uri:
                        `${PARTNER_IMAGE}${item.partner && item.partner.logo}`,
                    }}
                    size={"medium"}
                  />
                )}
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: 'bold' }}>Order No : {item.orderNo}</ListItem.Title>
                  {item.tableTransactions.length > 0 && (
                    <ListItem.Subtitle style={{ fontStyle: 'italic' }}>
                      Table :{" "}
                      {item.tableTransactions
                        .map((e) => e.table ? e.table.table_name : "n/a")
                        .join(",")}
                    </ListItem.Subtitle>
                  )}
                  {item.orderType !== 'partner' ? (
                    <ListItem.Subtitle style={{ fontStyle: 'italic' }}>
                      Order Type : {item.orderType}
                    </ListItem.Subtitle>
                  ) : (
                    <ListItem.Subtitle style={{ fontStyle: 'italic' }}>
                      Partner : {item.partner && item.partner.name}
                    </ListItem.Subtitle>
                  )}
                </ListItem.Content>
                <View>
                  <Text h4>{item.orderStatus}</Text>
                  <Text>Time : {Moment(item.createdAt).format("HH:mm")}</Text>
                </View>
              </ListItem>
            </Animated.View>
          )}
          renderRightActions={({ item }) => (
            <SwipeableQuickActions key={item.id}>
              {item.orderStatus !== 'void' && <SwipeableQuickActionButton
                accessibilityLabel="Void"
                onPress={() => {
                  navigate("Void", {
                    _orderId: item.id
                  })
                }}
                text="Void"
                style={{
                  flex: 1,
                  width: 50,
                  backgroundColor: "orange",
                }}
                textStyle={{
                  fontWeight: "bold",
                  color: "white",
                }}
              />}
              <SwipeableQuickActionButton
                accessibilityLabel="Open"
                onPress={() => {
                  if (
                    item.orderType === "dine-in" &&
                    !item.tableTransactions.length
                  ) {
                    navigate("SelectTable", {
                      _id: item.id,
                    });
                  } else if (item.orderType === "partner" && !item.partnerId) {
                    navigate("SelectPartner", {
                      _id: item.id,
                    });
                  } else if (item.orderType === "delivery" && !item.customerId) {
                    navigate("SelectCustomer", {
                      _id: item.id,
                    });
                  } else {
                    openOrderTransaction(item);
                  }
                }}
                text="Open"
                style={{
                  flex: 1,
                  width: 50,
                  backgroundColor: "blue",
                }}
                textStyle={{
                  fontWeight: "bold",
                  color: "white",
                }}
              />
            </SwipeableQuickActions>
          )}
          removeClippedSubviews={true} // Unmount components when outside of window
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            getOrder()
          }}
        />

        {isLoadingInitCashDrawer && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {isLoadingOrder && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  rightHiddenContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "red",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  loading: {
    marginTop: 10,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withNavigation(OrderListScreen);
