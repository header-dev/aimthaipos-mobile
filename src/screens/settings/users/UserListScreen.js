import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  Header,
  Icon,
  ListItem,
  SearchBar,
} from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { NavigationEvents, withNavigation } from "react-navigation";
import Swipeable from "react-native-swipeable";
import { Context as UserContext } from "./../../../context/UserContext";
import { navigate } from "../../../navigationRef";
import { MaterialCommunityIcons, Entypo, AntDesign } from "@expo/vector-icons";
import useDeleteUserHook from "../../../hooks/useDeleteUserHook";

import { Alert } from "react-native";

const UserListScreen = ({ navigation }) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);

  const [userName, setUserName] = useState("")

  const {
    state: { users, isLoading, isRejected },
    fetchUsers,
  } = useContext(UserContext);

  const [deleteUserByID] = useDeleteUserHook();

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <Swipeable
      rightButtons={[
        <TouchableOpacity
          onPress={() => navigate("UserResetPassword", { _id: item.id })}
          style={[styles.rightSwipeItem, { backgroundColor: "orange" }]}
        >
          <MaterialCommunityIcons name="lock-reset" size={34} color="black" />
        </TouchableOpacity>,
        <TouchableOpacity
          onPress={() => navigate("UserDetail", { _user: item })}
          style={[styles.rightSwipeItem, { backgroundColor: "blue" }]}
        >
          <Entypo name="edit" size={34} color="white" />
        </TouchableOpacity>,
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete User",
              "Are you sure you want to delete this user ?",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    deleteUserByID(item.id);
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
        <Icon name="user" type="evilicon" color="#517fa4" size={50} />
        <ListItem.Content>
          <ListItem.Title>{item.fullname}</ListItem.Title>
          <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title>
            Role Name : {item.roles.map((i) => i.name)}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={()=>{
        fetchUsers("")
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
          text: "User Management",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
        rightComponent={{
          icon: "add",
          color: "#fff",
          onPress: () => {
            navigation.navigate("UserCreate");
          },
        }}
      />
      <SearchBar
        placeholder="Find User Name..."
        lightTheme
        round
        onChangeText={(search) => {
          fetchUsers(search)
          setUserName(search)
        }}
        value={userName}
      />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={2} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
          scrollEnabled={!isSwiping}
          keyExtractor={keyExtractor}
          data={users}
          renderItem={(item) => renderItem(item)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

UserListScreen.navigationOptions = () => {
  return {
    title: "User Management",
  };
};

export default withNavigation(UserListScreen);
