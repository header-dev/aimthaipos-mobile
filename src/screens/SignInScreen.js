import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from 'react-native-elements'
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Context } from '../context/AuthContext'
import { NavigationEvents } from 'react-navigation';
import { ActivityIndicator } from 'react-native';

const SignInSchema = Yup.object().shape({
    username: Yup.string()
        .required('Please enter a ID or username.'),
    password: Yup.string()
        .required('Please enter a password.'),
});

const SignInScreen = ({ navigation }) => {

    const { state, signin, clearErrorMessage } = useContext(Context)

    return (
        <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
            <NavigationEvents
                onWillBlur={clearErrorMessage}
            />
            <KeyboardAvoidingView style={styles.content}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <View style={styles.logo}>
                    <Image source={require('./../../assets/logo-login.png')} style={{ width: 305, height: 246 }} />
                </View>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    onSubmit={values => {
                        signin(values)
                    }}
                    validationSchema={SignInSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <Input
                                containerStyle={styles.inputContainerOuter}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputText}
                                placeholder="ID or Username"
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
                            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
                            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} >
                                {state.isLoading && <ActivityIndicator animating={state.isLoading} />}
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>

            </KeyboardAvoidingView>
        </SafeAreaView>
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
        marginLeft:10
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
        flexDirection:"row"
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
    },
})

SignInScreen.navigationOptions = () => {
    return {
        headerShown: false
    }
}

export default SignInScreen