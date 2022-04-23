import React from 'react'
import { View, Text } from 'react-native'
import { Button, Card, Header, Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'

const PrinterSettingScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                    text: "Settings Printer",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <Card>
                <Card.Title>Bill / Receipt Printer</Card.Title>
                <Card.Divider />
                <Button
                    icon={<Icon name='settings' color='#ffffff' />}
                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    onPress={() => {
                        navigation.navigate('PrinterBillEdit')
                    }}
                    title='Configuration' />
            </Card>
            <Card>
                <Card.Title>Kitchen Printer</Card.Title>
                <Card.Divider />
                <Button
                    icon={<Icon name='settings' color='#ffffff' />}
                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    onPress={() => {
                        navigation.navigate('PrinterKitchenEdit')
                    }}
                    title='Configuration' />
            </Card>
        </SafeAreaView>
    )
}

export default withNavigation(PrinterSettingScreen)