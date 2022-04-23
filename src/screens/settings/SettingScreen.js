import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { Header, Icon, ListItem } from "react-native-elements";

const SettingScreen = ({ navigation }) => {

  const list = [
    {
      title: "User Management",
      icon: "user-cog",
      type: "font-awesome-5",
      button: false,
      action: () => {
        navigation.navigate("UserList");
      },
    },
    {
      title: "Shop Info Management",
      icon: "info-circle",
      type: "font-awesome-5",
      button: false,
      action: () => {
        navigation.navigate("ShopList");
      },
    },
    {
      title: "Production Management",
      icon: "restaurant-menu",
      type: "material-icon",
      button: false,
      action: () => {
        navigation.navigate("ProductionMain");
      },
    },
    {
      title: "Promotion Management",
      icon: "burst-sale",
      type: "foundation",
      button: false,
      action: () => {
        navigation.navigate("PromotionList");
      },
    },
    {
      title: "Partner Management",
      icon: "supple",
      type: "font-awesome-5",
      button: false,
      action: () => {
        navigation.navigate("PartnerList");
      },
    },
    {
      title: "Table Management",
      icon: "table-chair",
      type: "material-community",
      button: false,
      action: () => {
        navigation.navigate("TableList");
      },
    },
    {
      title: "Services Fee Management",
      icon: "credit-card",
      type: "font-awensome5",
      button: false,
      action: () => {
        navigation.navigate("CardServiceFeeScreen");
      },
    },
    {
      title: "Printer Preferences",
      icon: "printer",
      type: "material-community",
      button: false,
      action: () => {
        navigation.navigate("PrinterSettings");
      },
    }
  ];

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={item.action}>
      <Icon name={item.icon} type={item.type} />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>
      {!item.button && <ListItem.Chevron />}
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: () => {
            navigation.toggleDrawer();
          },
        }}
        centerComponent={{
          text: "Settings",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingScreen;
