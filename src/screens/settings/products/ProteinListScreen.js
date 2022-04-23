import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Avatar, Icon, ListItem, Image, Header, SearchBar } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { NavigationEvents, withNavigation } from "react-navigation";
import Swipeable from "react-native-swipeable";
import { Context as ProteinContext } from "./../../../context/ProteinContext";
import { navigate } from "../../../navigationRef";
import { Entypo, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import useDeleteProteinHook from "./../../../hooks/useDeleteProteinHook";
import { Alert } from "react-native";

const ProteinListScreen = ({ navigation }) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);

  const {
    state: { proteins, isLoading, isRejected },
    fetchProtein,
  } = useContext(ProteinContext);

  const [removeProtein] = useDeleteProteinHook();

  const keyExtractor = (item, index) => index.toString();

  const [searchValue, setSearchValue] = useState("")

  const renderItem = ({ item }) => (
    <Swipeable
      rightButtons={[
        <TouchableOpacity
          onPress={() => navigate("ProteinEdit", { _protein: item })}
          style={[styles.rightSwipeItem, { backgroundColor: "blue" }]}
        >
          <Entypo name="edit" size={34} color="white" />
        </TouchableOpacity>,
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete Protein",
              "Are you sure you want to delete this protein ?",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    removeProtein(item.id);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
          style={[styles.rightSwipeItem, { backgroundColor: "red" }]}
        >
          <AntDesign name="delete" size={34} color="white" />
        </TouchableOpacity>,
      ]}
      onRightButtonsOpenRelease={(event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }
        setCurrentlyOpenSwipeable(swipeable);
        setIsSwiping(true);
      }}
      onRightButtonsCloseRelease={() => {
        setCurrentlyOpenSwipeable(null);
        setIsSwiping(false);
      }}
    >
      <ListItem bottomDivider>
        <MaterialCommunityIcons name="food-steak" size={50} color="#517fa4" />
        <ListItem.Content>
          <ListItem.Title>Protein Name : {item.name}</ListItem.Title>
          <ListItem.Subtitle>Addition Price : {item.addition_price}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => {
        fetchProtein(searchValue)
        currentlyOpenSwipeable && currentlyOpenSwipeable.recenter()
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
          text: "Protein List",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
        rightComponent={{
          icon: "add",
          color: "#fff",
          onPress: () => {
            navigation.navigate("ProteinCreate")
          },
        }}
      />
      <SearchBar
        placeholder="Find Name..."
        lightTheme
        round
        onChangeText={(search) => {
          fetchProtein(search)
          setSearchValue(search)
        }}
        value={searchValue}
      />
      {isLoading && <ActivityIndicator style={{ margin: 10 }} animating />}
      <FlatList
        scrollEnabled={!isSwiping}
        keyExtractor={keyExtractor}
        data={proteins}
        renderItem={(item) => renderItem(item)}
      />
    </View>
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
  loading: {
    marginTop: 10,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
});

export default withNavigation(ProteinListScreen);
