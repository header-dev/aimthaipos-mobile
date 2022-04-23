import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSaveCategoryHook from '../../../hooks/useSaveCategoryHook'
import ProteinForm from '../../../components/ProteinForm';
import { Context as CategoryContext } from './../../../context/CategoryContext'
import * as Yup from 'yup';
import { withNavigation } from 'react-navigation';
import CategoryForm from '../../../components/CategoryForm';
import { Header } from 'react-native-elements';
const CategoryFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.')
});
const CategoryEditScreen = ({ navigation }) => {


    const { state: { isRejected, isLoading } } = useContext(CategoryContext)

    const _category = navigation.getParam('_category')

    const _categories = navigation.getParam("_categories")

    const [saveCategory] = useSaveCategoryHook()

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
                    text: "Category Edit",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <CategoryForm
                values={_category}
                totalCategory={_categories}
                validateSchema={CategoryFormSchema}
                onSubmit={(value) => {
                    saveCategory(value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(CategoryEditScreen)
