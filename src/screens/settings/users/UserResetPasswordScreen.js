import React from 'react'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, Dimensions, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
    Container,
    Body,
    Footer,
    Input,
    Item,
    Left,
    Text,
    Title,
    Right,
    View,
    Button,
    Toast,
    Label,
    Form,
} from "native-base";
import { navigate } from '../../../navigationRef';
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { Formik } from 'formik';
import * as Yup from 'yup';
var width = Dimensions.get("window").width;

import useResetPasswordUserHook from './../../../hooks/useResetPasswordUserHook'
import { withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';


const UserFormSchema = Yup.object().shape({
    password: Yup.string()
        .required('Please enter a password.'),
});

const UserResetPasswordScreen = ({ navigation }) => {
    const _id = navigation.getParam('_id');
    const [resetUserPassword] = useResetPasswordUserHook()

    return (
        <Container style={{ backgroundColor: "#fff" }}>
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
                    text: "User Management (Edit)",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <Body>
                <KeyboardAwareScrollView>
                    <View
                        style={{
                            flex: 0.8,
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 20,
                            marginTop: 30,
                        }}
                    >
                        <Formik
                            initialValues={{
                                password: ""
                            }}
                            onSubmit={values => {
                                resetUserPassword(_id, values)
                            }}
                            validationSchema={UserFormSchema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <>
                                    <Form>
                                        <Item rounded style={styles.inputLogin} error={Boolean(errors.password && touched.password)}>
                                            <Ionicons
                                                name="md-mail"
                                                style={{
                                                    fontSize: 18,
                                                    marginLeft: 18,
                                                    marginRight: 5,
                                                    color: "#a4a4a4",
                                                }}
                                            />
                                            <Input
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                placeholder="New Password"
                                                placeholderTextColor="#a4a4a4"
                                                style={{ fontSize: 16, color: "#a4a4a4" }}
                                                autoCapitalize="none"
                                                value={values.password}
                                                secureTextEntry
                                            />
                                        </Item>
                                    </Form>

                                    <Button
                                        rounded
                                        block
                                        onPress={handleSubmit}
                                        style={styles.button_auth}
                                    >
                                        <Text>Reset</Text>
                                    </Button>
                                    <TouchableOpacity
                                        onPress={() => navigate("UserList")}
                                        style={styles.text_auth}
                                        activeOpacity={1}
                                    >
                                        <Text style={styles.text_auth}>Back</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Formik>
                    </View>
                </KeyboardAwareScrollView>
            </Body>
        </Container>
    )
}

const styles = StyleSheet.create({
    inputLogin: {
        backgroundColor: '#FFFFFF',
        width: width * 0.80,
        shadowRadius: 5,
        marginBottom: 10,
        // borderColor: '#a4a4a4',
        color: '#a4a4a4'
    },
    button_auth: {
        minWidth: 200,
        backgroundColor: "green",
        marginBottom: 8,
        height: 53,
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },

    text_auth: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        minWidth: 200,
        marginTop: 5,
        color: '#808080',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
})

export default withNavigation(UserResetPasswordScreen)
