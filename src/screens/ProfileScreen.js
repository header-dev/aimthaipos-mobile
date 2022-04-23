import React, { useContext } from "react";
import { Alert } from "react-native";
import { View, StyleSheet } from "react-native";
import { Avatar, Header, Text } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationEvents, withNavigation } from "react-navigation";
import { Context as AuthContext } from "./../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const {
    state: { user },
    getUser,signout
  } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationEvents onWillFocus={getUser} />
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
          text: "Profile",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.sectionContent}>
          <Avatar
            size="xlarge"
            rounded
            icon={{ name: "user", type: "font-awesome" }}
            containerStyle={{
              margin: 10,
              backgroundColor: "grey",
            }}
          />
        </View>
        <View style={styles.sectionContent}>
          <View>
            <Text style={styles.textStyle}>ID : {user && user.code}</Text>
            <Text style={styles.textStyle}>Name : {user && user.fullname}</Text>
            <Text style={styles.textStyle}>Email : {user && user.email}</Text>
          </View>
        </View>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => {
              Alert.alert(
                "Confirm Logout",
                "Are you sure you want to logout ?",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      signout()
                    },
                  },
                ],
                { cancelable: false }
              );
          }}>
            <Text style={styles.loginText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  sectionContent: { flexDirection: "row", justifyContent: "center" },
  logoutButton: {
    width: "100%",
    backgroundColor: "orange",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  textStyle:{
      fontSize: 18,
      margin: 5
  }
});

export default withNavigation(ProfileScreen);
