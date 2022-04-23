import React from 'react'
import { SimpleLineIcons, Ionicons, MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, Dimensions, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
    Container,
    Body,
    Footer,
    Header,
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
    Picker,
    Icon,
} from "native-base";
import { withNavigation } from 'react-navigation';

const TableFormSchema = Yup.object().shape({
    table_no: Yup.string()
        .required('Please enter a table no.'),
    table_name: Yup.string()
        .required('Please enter a table name.'),
    status: Yup.string()
        .required('Please enter a status.'),
    person_support: Yup.number('Please enter a number only').
        required('Please enter a person support.'),
});

var width = Dimensions.get("window").width;

const TableForm = ({
    values,
    onSubmit
}) => {
    return (
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
                    initialValues={values}
                    enableReinitialize
                    onSubmit={values => {
                        onSubmit(values)
                    }}
                    validationSchema={TableFormSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <Form>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.table_no && touched.table_no)}>
                                    <Ionicons
                                        name="md-mail"
                                        style={styles.iconInput}
                                    />
                                    <Input
                                        onChangeText={handleChange('table_no')}
                                        onBlur={handleBlur('table_no')}
                                        placeholder="No."
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        autoCapitalize="none"
                                        keyboardType="number-pad"
                                        value={`${values.table_no}`}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.table_name && touched.table_name)}>
                                    <MaterialIcons name="format-list-numbered" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('table_name')}
                                        onBlur={handleBlur('table_name')}
                                        placeholder="Name"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.table_name}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.person_support && touched.person_support)}>
                                    <Ionicons name="person" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('person_support')}
                                        onBlur={handleBlur('person_support')}
                                        placeholder="Person Support"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={`${values.person_support}`}
                                        keyboardType="number-pad"
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.location && touched.location)}>
                                    <Entypo name="location" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('location')}
                                        onBlur={handleBlur('location')}
                                        placeholder="Location"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.location}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.status && touched.status)}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        placeholder="Status"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={values.status}
                                        onValueChange={handleChange('status')}
                                    >
                                        <Picker.Item label="Avaliable" value="avaliable" />
                                        <Picker.Item label="Un Available" value="unavailable" />
                                    </Picker>
                                </Item>
                                <Item rounded style={styles.inputTextArea} error={Boolean(errors.remark && touched.remark)}>
                                    <FontAwesome name="sticky-note" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('remark')}
                                        onBlur={handleBlur('remark')}
                                        placeholder="Remark"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.remark}
                                        multiline
                                        numberOfLines={5}
                                    />
                                </Item>
                            </Form>
                            <Button
                                rounded
                                block
                                onPress={handleSubmit}
                                style={styles.button_auth}
                            >
                                <Text>Save</Text>
                            </Button>
                        </>
                    )}
                </Formik>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    inputLogin: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        shadowRadius: 5,
        marginBottom: 10,
        // borderColor: '#a4a4a4',
        color: '#a4a4a4',
    },
    inputTextArea: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        shadowRadius: 5,
        marginBottom: 10,
        color: '#a4a4a4',
        height: 150
    },
    button_auth: {
        alignSelf:'center',
        width: '80%',
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
        width: '80%',
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
    iconInput: {
        fontSize: 18,
        marginLeft: 18,
        marginRight: 5,
        color: "#a4a4a4"
    }
});

export default withNavigation(TableForm)