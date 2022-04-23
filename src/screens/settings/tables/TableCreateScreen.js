import React from 'react'
import { StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSaveTableHook from '../../../hooks/useSaveTableHook'
import TableForm from '../../../components/TableForm';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

const TableCreateScreen = ({ navigation }) => {

    const [saveTable] = useSaveTableHook()

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
                    text: "Table Create",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <TableForm
                values={{
                    table_no: "",
                    table_name: "",
                    location: "",
                    status: "avaliable",
                    remark: "",
                    person_support: ""
                }}
                onSubmit={(value) => {
                    saveTable(value)
                }}
            />
        </Container>
    )
}

export default withNavigation(TableCreateScreen)
