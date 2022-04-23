import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'native-base';
import { useContext, useEffect, useState } from 'react'
import { Context as PrinterContext } from './../context/PrinterContext'
export default () => {
    const { getBillPrinter } = useContext(PrinterContext)
    useEffect(() => {
        return () => {
            billPrinter()
        }
    }, [])

    const billPrinter = async () => {
        getBillPrinter()
    };
    return [billPrinter]
}