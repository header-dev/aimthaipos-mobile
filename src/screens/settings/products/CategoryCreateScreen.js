import React, { useContext } from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSaveCategoryHook from '../../../hooks/useSaveCategoryHook'
import { Context as CategoryContext } from './../../../context/CategoryContext'
import CategoryForm from '../../../components/CategoryForm';

import * as Yup from 'yup';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

const CategoryFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter a name.')
});
const CategoryCreateScreen = ({ navigation }) => {

    const { state: { isRejected, isLoading } } = useContext(CategoryContext)

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
                    text: "Category Create",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <CategoryForm
                values={{
                    id: "",
                    name: ""
                }}
                validateSchema={CategoryFormSchema}
                totalCategory={null}
                onSubmit={(value) => {
                    saveCategory(value)
                }}
                isLoading={isLoading}
            />
        </Container>
    )
}

export default withNavigation(CategoryCreateScreen)
