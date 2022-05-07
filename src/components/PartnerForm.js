import React, { useEffect, useState } from 'react'
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from 'formik';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, TouchableOpacity, StyleSheet, Image } from "react-native";
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
    Thumbnail,
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { PARTNER_IMAGE } from '@env';

var width = Dimensions.get("window").width;

const initailThumb = require('./../../assets/thumbnail-empty.png');

export default function PartnerForm({
    values,
    validateSchema,
    onSubmit,
    isLoading
}) {
    const [image, setImage] = useState({
        uri: values.logo ? `${PARTNER_IMAGE}${values.logo}` : Image.resolveAssetSource(initailThumb).uri
    })
    useEffect(() => {
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage({
                uri: result.uri
            });
        }
    };

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
                        onSubmit(image, values)
                    }}
                    validationSchema={validateSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <Form>
                                <View style={{
                                    alignItems: "center",
                                    margin: 10
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={pickImage}
                                    >
                                        <Image
                                            style={{
                                                width: 200,
                                                height: 200
                                            }}
                                            source={{ uri: image.uri }}
                                            PlaceholderContent={<ActivityIndicator />}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.name && touched.name)} >
                                    <MaterialIcons name="format-list-numbered" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        placeholder="Name"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={values.name}
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.chargePrice && touched.chargePrice)} >
                                    <MaterialCommunityIcons name="currency-usd" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('chargePrice')}
                                        onBlur={handleBlur('chargePrice')}
                                        placeholder="Charge Price"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={`${values.chargePrice}`}
                                        keyboardType="numeric"
                                    />
                                </Item>
                                <Item rounded style={styles.inputLogin} error={Boolean(errors.percentage && touched.percentage)} >
                                    <MaterialCommunityIcons name="percent" style={styles.iconInput} />
                                    <Input
                                        onChangeText={handleChange('percentage')}
                                        onBlur={handleBlur('percentage')}
                                        placeholder="Percentage"
                                        placeholderTextColor="#a4a4a4"
                                        style={{ fontSize: 16 }}
                                        value={`${values.percentage}`}
                                        keyboardType="numeric"
                                    />
                                </Item>
                            </Form>
                            <Button
                                rounded
                                block
                                onPress={handleSubmit}
                                style={styles.button_auth}
                            >
                                {isLoading && (<ActivityIndicator animating />)}
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
        width: width * 0.80,
        shadowRadius: 5,
        marginBottom: 10,
        color: '#a4a4a4',
        height: 150
    },
    button_auth: {
        alignSelf: 'center',
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
    iconInput: {
        fontSize: 18,
        marginLeft: 18,
        marginRight: 5,
        color: "#a4a4a4"
    }
});