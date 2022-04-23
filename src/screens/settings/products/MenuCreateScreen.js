import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body,
    Text
} from "native-base";
import useSaveMenuHook from '../../../hooks/useSaveMenuHook'

import { Context as MenuContext } from './../../../context/MenuContext'
import { Context as CategoryContext } from './../../../context/CategoryContext'
import { Context as PrinterContext } from './../../../context/PrinterContext'

import MenuForm from '../../../components/MenuForm';
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';
const MenuFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.'),
    type: Yup.string()
        .required('Please enter a type.'),
    categoryId: Yup.string()
        .required('Please enter a category.'),
    cost: Yup.number()
        .required('Please enter a cost.'),
    price: Yup.number()
        .required('Please enter a base price 1.'),
    specialPrice: Yup.number()
        .required('Please enter a base price 2.')
});
const MenuCreateScreen = ({ navigation }) => {

    const { state: { isRejected, isLoading } } = useContext(MenuContext)
    const { state: { categories }, fetchCategory } = useContext(CategoryContext)
    const { state: { printers }, fetchPrinter } = useContext(PrinterContext)


    const [saveMenu] = useSaveMenuHook()


    return (
        <Container style={{ backgroundColor: "#fff" }}>
            <NavigationEvents onWillFocus={() => {
                fetchCategory("")
                fetchPrinter("")
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
                    text: "Menu Create",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <MenuForm
                values={{
                    id: "",
                    name: "",
                    type: "protein",
                    categoryId: "",
                    cost: "",
                    price: "",
                    photo: "",
                    printerId: ""
                }}
                categories={categories}
                printers={printers}
                validateSchema={MenuFormSchema}
                onSubmit={(image, value) => {
                    saveMenu(image, value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(MenuCreateScreen)
