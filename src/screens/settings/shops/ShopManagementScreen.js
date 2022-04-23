import React, { useContext } from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import { Header, Icon, ListItem } from 'react-native-elements'
import { Context as ShopContext } from './../../../context/ShopContext'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Entypo, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Input, List } from 'native-base';
import { ScrollView } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { ActivityIndicator } from 'react-native';
import useSaveShopHook from './../../../hooks/useSaveShopHook'


const ShopManagementScreen = ({ navigation }) => {

    const { state: { shop, isLoading, isRejected }, fetchShop } = useContext(ShopContext)
    const [saveShopInfo] = useSaveShopHook()

    return (
        <View style={styles.container} >
            <NavigationEvents onWillFocus={fetchShop} />
            {isLoading && (
                <ActivityIndicator
                    size="large"
                    style={{ margin: 5 }}
                />
            )}
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
                    text: "Shop Information",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <Formik
                    initialValues={{
                        id: shop ? shop.id : "",
                        name: shop ? shop.name : "",
                        tax_id: shop ? shop.tax_id : "",
                        tel: shop ? shop.tel : "",
                        mobile: shop ? shop.mobile : "",
                        address1: shop ? shop.address1 : "",
                        state: shop ? shop.state : "",
                        postcode: shop ? shop.postcode : "",
                        country: shop ? shop.country : "",
                        vat: shop ? shop.vat : "",
                        service_charge: shop ? shop.service_charge : ""
                    }}
                    enableReinitialize
                    onSubmit={values => {
                        saveShopInfo(values)
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <View style={{ flex: 1 }}>
                                <ScrollView>
                                    <ListItem key={1} bottomDivider>
                                        <Entypo name="shop" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Name</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            placeholder="Please end restaurant name"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            value={values.name}
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={2} bottomDivider>
                                        <AntDesign name="tags" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Tax ID</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('tax_id')}
                                            onBlur={handleBlur('tax_id')}
                                            placeholder="Please enter Tax ID"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={values.tax_id}
                                            clearButtonMode="always"
                                            keyboardType="number-pad"
                                        />
                                    </ListItem>
                                    <ListItem key={3} bottomDivider>
                                        <Entypo name="phone" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Telephone</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('tel')}
                                            onBlur={handleBlur('tel')}
                                            placeholder="Please enter Telephone"
                                            placeholderTextColor="#a4a4a4"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={values.tel}
                                            keyboardType="phone-pad"
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={4} bottomDivider>
                                        <Entypo name="mobile" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Mobile</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('mobile')}
                                            onBlur={handleBlur('mobile')}
                                            placeholder="Please enter Mobile"
                                            placeholderTextColor="#a4a4a4"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={values.mobile}
                                            keyboardType="phone-pad"
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={5} bottomDivider>
                                        <Entypo name="address" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Address</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('address1')}
                                            onBlur={handleBlur('address1')}
                                            placeholder="Please enter Address"
                                            placeholderTextColor="#a4a4a4"
                                            style={{ fontSize: 16, color: "black" }}
                                            numberOfLines={2}
                                            autoCapitalize="none"
                                            value={values.address1}
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={7} bottomDivider>
                                        <MaterialCommunityIcons name="home-city" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>State</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('state')}
                                            onBlur={handleBlur('state')}
                                            placeholder="Please enter State"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={values.state}
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={8} bottomDivider>
                                        <MaterialIcons name="local-post-office" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Postel Code</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('postcode')}
                                            onBlur={handleBlur('postcode')}
                                            placeholder="Please enter Postel Code"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={values.postcode}
                                            keyboardType="number-pad"
                                            placeholderTextColor="grey"
                                            clearButtonMode="always"
                                        />
                                    </ListItem>
                                    <ListItem key={9} bottomDivider>
                                        <MaterialIcons name="local-post-office" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Country</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('country')}
                                            onBlur={handleBlur('country')}
                                            placeholder="Please enter Country"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            value={values.country}
                                        />
                                    </ListItem>
                                    <ListItem key={10} bottomDivider>
                                        <MaterialIcons name="local-post-office" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>VAT(%)</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('vat')}
                                            onBlur={handleBlur('vat')}
                                            placeholder="Please enter VAT(%)"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={values.vat && `${values.vat}`}
                                            keyboardType="number-pad"
                                        />
                                    </ListItem>
                                    <ListItem key={11} bottomDivider>
                                        <MaterialIcons name="local-post-office" size={24} color="black" />
                                        <ListItem.Content>
                                            <ListItem.Title>Service Charge(%)</ListItem.Title>
                                        </ListItem.Content>
                                        <Input
                                            onChangeText={handleChange('service_charge')}
                                            onBlur={handleBlur('service_charge')}
                                            placeholder="Please enter Service Charge(%)"
                                            placeholderTextColor="grey"
                                            style={{ fontSize: 16, color: "black" }}
                                            autoCapitalize="none"
                                            value={`${values.service_charge}`}
                                            keyboardType="number-pad"
                                        />
                                    </ListItem>
                                </ScrollView>
                            </View>
                            <View>
                                <Button
                                    block
                                    onPress={handleSubmit}
                                    style={styles.buttonSave}
                                >
                                    <Icon name="save" color="white" />
                                    <Text style={styles.textButtonSave}>Save</Text>
                                </Button>
                            </View>

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
        flexDirection: 'column',
    },
    textButtonSave: {
        fontSize: 20,
        color: 'white'
    }
})

export default withNavigation(ShopManagementScreen)