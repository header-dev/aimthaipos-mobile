import { Body, CheckBox, ListItem, Text } from 'native-base'
import React from 'react'
import { View } from 'react-native'

export default function InputCheckBoxForm({ label, checked , onChecked , error, children}) {
    return (
        <>
            <ListItem noBorder>
                <CheckBox checked={checked} color={error && "red"}  onPress={() => {
                    onChecked(!checked)
                }}/>
                <Body>
                    <Text>{children}</Text>
                </Body>
            </ListItem>
        </>
    )
}
