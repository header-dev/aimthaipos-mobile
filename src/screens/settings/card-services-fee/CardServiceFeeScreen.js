import React, { useContext } from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import { Header, Icon, ListItem } from 'react-native-elements'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Entypo, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Footer, Input, List } from 'native-base';
import { ScrollView } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { ActivityIndicator } from 'react-native';
import { Context as SettingContext } from './../../../context/SettingContext'

const CardServiceFeeScreen = ({ navigation }) => {

    const { state: { card, isCardLoading, isCardRejected }, fetchCard, createCard } = useContext(SettingContext)

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={fetchCard} />
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
                    text: "Services Fee Managemet",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "#fff",
                    onPress: () => {
                        navigation.navigate("PartnerCreate")
                    },
                }}
            />
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <Formik
                    initialValues={{
                        id: card ? card.id : "",
                        fee: card ? card.fee : "",
                        providerFee: card ? card.providerFee : ""
                    }}
                    enableReinitialize
                    onSubmit={values => {
                        createCard(values)
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <View style={{ flex: 1 }}>
                                <ScrollView>
                                    <ListItem key={1} bottomDivider>
                                        <Entypo name="price-tag" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Service Charges for Card (%)</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('fee')}
                                            onBlur={handleBlur('fee')}
                                            placeholder="Please end percentage fee"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            value={values.fee.toString()}
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={1} bottomDivider>
                                        <Entypo name="price-tag" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Service Charges for Provider (%)</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('providerFee')}
                                            onBlur={handleBlur('providerFee')}
                                            placeholder="Please end provider fee"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            value={values.providerFee && values.providerFee.toString()}
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                </ScrollView>
                            </View>
                            <Footer style={{ padding: 5 }}>
                                <Button
                                    block
                                    onPress={handleSubmit}
                                    style={styles.buttonSave}
                                >
                                    <Icon name="save" color="white" />
                                    <Text style={styles.textButtonSave}>Save</Text>
                                </Button>
                            </Footer>
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    loading: {
        marginTop: 10
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },
    textButtonSave: {
        fontSize: 20,
        color: 'white',
    },
    buttonSave: {
        width: '100%'
    }
});

export default withNavigation(CardServiceFeeScreen)