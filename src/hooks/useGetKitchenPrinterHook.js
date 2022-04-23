import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'native-base';
import { useContext, useEffect, useState } from 'react'
import { Context as PrinterContext } from './../context/PrinterContext'
export default () => {
    const { getKitchenPrinter } = useContext(PrinterContext)
    useEffect(() => {
        return () => {
            kitchenPrinter()
        }
    }, [])

    const kitchenPrinter = () => {
        getKitchenPrinter()
    };
    return [kitchenPrinter]
}