import React, { useContext } from 'react'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import { View, Text } from 'react-native'
import { Header } from 'react-native-elements'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { Input } from 'react-native-elements'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TouchableOpacity } from 'react-native'

import { Context as AuthContext } from './../../context/AuthContext'
import { ActivityIndicator } from 'react-native'

const SignInSchema = Yup.object().shape({
    username: Yup.string()
        .required('Please enter a ID or username.'),
    password: Yup.string()
        .required('Please enter a password.'),
});

const VoidScreen = ({ navigation }) => {

    const { state: { isLoading, user }, signinVoid, getUser } = useContext(AuthContext)

    const _orderId = navigation.getParam('_orderId')

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents
                onWillFocus={() => {
                    getUser()
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
                        navigation.goBack()
                    },
                }}
                centerComponent={{
                    text: `Void`,
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <KeyboardAvoidingView style={styles.content}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    onSubmit={values => {
                        signinVoid(_orderId, user.id, values)
                    }}
                    validationSchema={SignInSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <Input
                                containerStyle={styles.inputContainerOuter}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputText}
                                placeholder="ID"
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                                errorMessage={errors.username && touched.username ? (
                                    errors.username
                                ) : null}
                                errorStyle={styles.inputError}
                                autoCorrect={false}
                            />
                            <Input
                                containerStyle={styles.inputContainerOuter}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputText}
                                placeholder="Password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry
                                errorMessage={errors.password && touched.password ? (
                                    errors.password
                                ) : null}
                                errorStyle={styles.inputError}
                                autoCorrect={false}
                            />
                            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} >
                                {isLoading && <ActivityIndicator animating={isLoading} />}
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>

            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainerOuter: {
        justifyContent: "center",
        alignItems: 'center',
        width: "80%"
    },
    inputContainer: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 25,
        height: 50,
        padding: 20,
    },
    inputText: {
        height: 50,
        color: "grey"
    },
    inputError: {
        alignSelf: 'flex-start',
        // marginLeft: 110,
        fontSize: 17
    },
    loginText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10
    },
    loginButton: {
        width: "80%",
        backgroundColor: "#2E7C31",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row"
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
    },
})


export default withNavigation(VoidScreen)