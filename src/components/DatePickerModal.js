import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-elements';
import CalendarPicker from 'react-native-calendar-picker';

export default function DatePickerModal({ showModal, onSubmit, onClose }) {

    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)

    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            setSelectedEndDate(date)
        } else {
            setSelectedStartDate(date)
            setSelectedEndDate(null)
        }
    }


    return (
        <Modal
            animationType="slide"
            // transparent
            visible={showModal}
        >
            <View style={styles.centeredView}>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    todayBackgroundColor="#f2e6ff"
                    selectedDayColor="#7300e6"
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={onDateChange}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: 'space-around',
                        width:'100%'
                    }}
                >
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            if (selectedEndDate && selectedStartDate) {
                                onSubmit(selectedStartDate, selectedEndDate)
                            }
                        }}
                    >
                        <Text style={styles.textStyle}>OK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose, { backgroundColor:'red',borderColor:'red' }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.textStyle, { color:'white',  }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 20
    },
    inputLogin: {
        backgroundColor: "#FFFFFF",
        marginBottom: 10,
        borderColor: "#a4a4a4",
        color: "#a4a4a4",
        width: "100%",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 30,
        padding: 10,
        elevation: 2,
        width: 200,
        height: 50,
        justifyContent:'center',
        borderWidth:0.3,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        // backgroundColor: "#2196F3",
    },
    textStyle: {
        // color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center",
    },
    modalHeaderText: {
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
    },
});