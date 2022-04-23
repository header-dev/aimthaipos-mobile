import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Button, Header } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationEvents, withNavigation } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import { Input } from "react-native-elements";
import { Context as UserContext } from "./../../../context/UserContext";
import { Icon, Item, Picker, Toast } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

const UserFormSchema = Yup.object().shape({
  code: Yup.number("ID must be use number only").required("Please enter a ID."),
  username: Yup.string().required("Please enter a username."),
  firstname: Yup.string().required("Please enter a firstname."),
  lastname: Yup.string().required("Please enter a lastname."),
  email: Yup.string().email().required("Please enter a email."),
  roleId: Yup.string("Please enter a role.").required("Please enter a role."),
});

const UserDetailScreen = ({ navigation }) => {
  const _user = navigation.getParam("_user");
  const {
    state: { roles, isRoleLoading },
    fetchRoles,
    updateUser,
  } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationEvents onWillFocus={fetchRoles} />
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
          text: "User Management (Detail)",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.content}
        scrollEnabled={false}
      >
        <Formik
          key={1}
          initialValues={{ ..._user, password: "", roleId: JSON.parse(_user.roles.map(i => i.id)) }}
          enableReinitialize
          onSubmit={(values) => {
            updateUser(values.id, values);
          }}
          validationSchema={UserFormSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Input
                label="ID"
                labelStyle={{
                  alignSelf: "flex-start",
                  padding: 5,
                }}
                containerStyle={styles.inputContainerOuter}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                placeholder="ID"
                onChangeText={handleChange("code")}
                onBlur={handleBlur("code")}
                value={values.code}
                errorMessage={errors.code && touched.code ? errors.code : null}
                errorStyle={styles.inputError}
                autoCorrect={false}
              />
              <Input
                label="Username"
                labelStyle={{
                  alignSelf: "flex-start",
                  padding: 5,
                }}
                containerStyle={styles.inputContainerOuter}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                placeholder="Username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                errorMessage={
                  errors.username && touched.username ? errors.username : null
                }
                errorStyle={styles.inputError}
                autoCorrect={false}
              />
              <Input
                label="Firstname"
                labelStyle={{
                  alignSelf: "flex-start",
                  padding: 5,
                }}
                containerStyle={styles.inputContainerOuter}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                placeholder="Firstname"
                onChangeText={handleChange("firstname")}
                onBlur={handleBlur("firstname")}
                value={values.firstname}
                errorMessage={
                  errors.firstname && touched.firstname
                    ? errors.firstname
                    : null
                }
                errorStyle={styles.inputError}
                autoCorrect={false}
              />
              <Input
                label="Lastname"
                labelStyle={{
                  alignSelf: "flex-start",
                  padding: 5,
                }}
                containerStyle={styles.inputContainerOuter}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                placeholder="Lastname"
                onChangeText={handleChange("lastname")}
                onBlur={handleBlur("lastname")}
                value={values.lastname}
                errorMessage={
                  errors.lastname && touched.lastname ? errors.lastname : null
                }
                errorStyle={styles.inputError}
                autoCorrect={false}
              />
              <Input
                label="Email Address"
                labelStyle={{
                  alignSelf: "flex-start",
                  padding: 5,
                }}
                containerStyle={styles.inputContainerOuter}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                placeholder="Email Address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                errorMessage={
                  errors.email && touched.email ? errors.email : null
                }
                errorStyle={styles.inputError}
                autoCorrect={false}
              />
              <Item
                rounded
                style={styles.inputLogin}
                error={Boolean(errors.roleId && touched.roleId)}
              >
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholder="Role"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={`${values.roleId}`}
                  onValueChange={handleChange("roleId")}
                >
                  {roles &&
                    roles.map((i) => (
                      <Picker.Item label={`${i.name}`} value={`${i.id}`} />
                    ))}
                </Picker>
                {errors.roleId ? (
                  <Text style={styles.errorMessage}>{errors.roleId}</Text>
                ) : null}
              </Item>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={(e) => handleSubmit(e)}
              >
                <Text style={styles.loginText}>Update</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  content: {
    padding: 20,
    alignItems: "center",
    flex: 15,
  },
  inputLogin: {
    backgroundColor: "#FFFFFF",
    width: "78%",
    shadowRadius: 5,
    padding: 15,
    borderColor: "#a4a4a4",
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
  },
  inputContainerOuter: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  inputContainer: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "grey",
  },
  inputError: {
    alignSelf: "flex-start",
    // marginLeft: 110,
    fontSize: 17,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#FFA500",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
});

export default withNavigation(UserDetailScreen);
