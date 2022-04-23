import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, SearchBar } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { NavigationEvents, withNavigation } from "react-navigation";
import { Context as SaleContext } from "./../../context/SaleContext";
import PersonAmounModal from "../../components/sales/PersonAmounModal";
import { Toast } from "native-base";
import { FlatGrid } from 'react-native-super-grid';
const SelectTableScreen = ({ navigation }) => {
  const {
    state: { tables, isLoadingTable },
    saveAddTable,
    createOrder,
    getSaleTable,
  } = useContext(SaleContext);
  const _id = navigation.getParam("_id");
  const [tableId, setTableId] = useState(null);
  const [tableName, setTableName] = useState("");
  const [showModalPerson, setShowModalPerson] = useState(false);

  const renderItems = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "column",
          margin: 1,
          alignItems: "center",
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (item.status === "avaliable") {
              setTableId(item.id);
              setShowModalPerson(true);
            }
          }}
          style={{ alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="table-furniture"
            size={100}
            color={item.status === "unavailable" ? "red" : "green"}
          />
          <Text>
            {item.table_name} - No. {item.table_no}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          getSaleTable("");
        }}
      />
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: `Select Table`,
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <SearchBar
        placeholder="Find Table Name ..."
        onChangeText={(search) => {
          getSaleTable(search);
          setTableName(search);
        }}
        lightTheme
        round
        value={tableName}
      />
      <ActivityIndicator animating={isLoadingTable} />
      <FlatGrid
        data={tables && tables}
        itemDimension={130}
        renderItem={renderItems}
        spacing={10}
        style={{
          flex: 1,
          marginTop: 10
        }}
      />
      <PersonAmounModal
        showModal={showModalPerson}
        handleClose={() => {
          setShowModalPerson(false);
        }}
        onSubmit={(value) => {
          createOrder({
            id: _id,
            personAmount: value.personAmount,
          })
            .then(() => {
              setShowModalPerson(false);
              saveAddTable({
                tableId: tableId,
                orderId: _id,
              });
            })
            .catch((err) => {
              Toast.show({
                text: err.message,
                buttonText: "Okay",
                type: "warning",
              });
            });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
});

export default withNavigation(SelectTableScreen);
