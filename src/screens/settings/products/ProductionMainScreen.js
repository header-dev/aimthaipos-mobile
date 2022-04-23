import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView, withNavigation } from "react-navigation";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { navigate } from "../../../navigationRef";
import { Header } from "react-native-elements";

const ProductionMainScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => {
            navigation.goBack()
          },
        }}
        centerComponent={{
          text: 'Production Management',
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <FlatList
        data={[
          {
            name: "Menu",
            action: () => {
              navigate("MenuList");
            },
            color: "#00BFFF",
            icon: (
              <MaterialIcons
                name="restaurant-menu"
                styles={styles.iconButton}
                size={40}
                color="white"
              />
            ),
          },
          {
            name: "Cetegory",
            action: () => {
              navigate("CategoryList");
            },
            color: "#FF4500",
            icon: (
              <FontAwesome5
                name="layer-group"
                styles={styles.iconButton}
                size={40}
                color="white"
              />
            ),
          },
          {
            name: "Protein",
            action: () => {
              navigate("ProteinList");
            },
            color: "#32CD32",
            icon: (
              <Entypo
                name="bowl"
                size={40}
                styles={styles.iconButton}
                color="white"
              />
            ),
          },
        ]}
        renderItem={({ item }) => (
          <View style={styles.cardItem} key={item.name}>
            <TouchableOpacity
              onPress={item.action}
              style={{ ...styles.buttonCard, backgroundColor: item.color }}
            >
              {item.icon}
              <Text style={styles.textButton}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
        numColumns={1}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    margin: 10,
  },
  cardItem: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonCard: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    width: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    flexDirection: "row",
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default withNavigation(ProductionMainScreen);
