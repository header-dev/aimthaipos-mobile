import React, { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar, Header } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { Context as SaleContext } from "./../../context/SaleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { NavigationEvents } from "react-navigation";
import PersonAmounModal from "../../components/sales/PersonAmounModal";
import { Toast } from "native-base";
import { FlatList } from "react-native";

const MergeTableScreen = ({ navigation }) => {
  const {
    state: { tables, isLoadingTable },
    mergeAddTable,
    getSaleTable,
    createOrder
  } = useContext(SaleContext);

  const _orderId = navigation.getParam("_orderId");
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
          // fetchTable("");
          getSaleTable();
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
          text: "Merge Table",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <SearchBar
        placeholder="Type Here..."
        onChangeText={(search) => {
          // fetchTable(search);
        }}
        lightTheme
        round
        // value={tableName}
      />
      <ActivityIndicator animating={isLoadingTable} />
      <FlatList
        data={tables}
        renderItem={renderItems}
        numColumns={5}
        keyExtractor={(item, index) => index}
      />
      <PersonAmounModal
        showModal={showModalPerson}
        handleClose={() => {
          setShowModalPerson(false);
        }}
        onSubmit={(value) => {
          createOrder({
            id: _orderId,
            personAmount: value.personAmount,
          })
            .then(() => {
              setShowModalPerson(false);
              mergeAddTable({
                tableId: tableId,
                orderId: _orderId,
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
    backgroundColor: "white",
  },
});

export default withNavigation(MergeTableScreen);
