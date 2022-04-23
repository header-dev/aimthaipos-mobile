import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Header, Icon, SearchBar } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Context as TableContext } from "./../../../context/TableContext";
import { ActivityIndicator } from "react-native";
import { NavigationEvents, withNavigation } from "react-navigation";
import { navigate } from "../../../navigationRef";
import { FlatGrid } from 'react-native-super-grid';

const TableListScreen = ({ navigation }) => {
  const [tableName, setTableName] = useState("")

  const {
    state: { tables, isLoading, isRejected },
    fetchTable,
  } = useContext(TableContext);

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
            navigate("TableDetail", { _table: item });
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
      <NavigationEvents onWillFocus={() => {
        fetchTable('')
      }} />
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
          text: "Table Management",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
        rightComponent={{
          icon: "add",
          color: "#fff",
          onPress: () => {
            navigation.navigate("TableCreate")
          },
        }}
      />
      <SearchBar
        placeholder="Table Name"
        lightTheme
        round
        onChangeText={(search) => {
          fetchTable(search)
          setTableName(search)
        }}
        value={tableName}
      />
      {isLoading && (<ActivityIndicator animating={isLoading} style={{
        marginTop: 10
      }} />)}
      <FlatGrid
        data={tables}
        itemDimension={130}
        renderItem={renderItems}
        spacing={10}
        style={{
          flex: 1,
          marginTop: 10
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

export default withNavigation(TableListScreen);
