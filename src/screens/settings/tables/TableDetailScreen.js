import React from 'react'
import { Alert, StyleSheet } from "react-native";
import {
    Container,
    Body
} from "native-base";
import useSaveTableHook from '../../../hooks/useSaveTableHook'
import useDeleteTableHook from '../../../hooks/useDeleteTableHook'
import TableForm from '../../../components/TableForm';
import { withNavigation } from 'react-navigation';
import { Header } from 'react-native-elements';

const TableDetailScreen = ({ navigation }) => {


    const [saveTable] = useSaveTableHook()
    const [removeTable] = useDeleteTableHook()

    const _table = navigation.getParam('_table');

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
                    text: "Table Edit",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "delete",
                    color: "#fff",
                    onPress: () => {
                        Alert.alert(
                            "Delete Table",
                            "Are you sure you want to delete this table ?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => { },
                                    style: "cancel",
                                },
                                {
                                    text: "OK",
                                    onPress: () => {
                                        removeTable(_table.id)
                                    },
                                },
                            ],
                            { cancelable: false }
                        );
                    },
                }}
            />
            <TableForm
                values={_table}
                onSubmit={(value) => {
                    saveTable(value)
                }}
            />
        </Container>
    )
}
export default withNavigation(TableDetailScreen)
