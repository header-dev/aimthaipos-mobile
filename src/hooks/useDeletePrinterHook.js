import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as PrinterContext } from '../context/PrinterContext'
import { navigate } from '../navigationRef';

export default () => {
    const { fetchPrinter, deletePrinter } = useContext(PrinterContext);

    const removePrinter = (id) => {
        deletePrinter(id)
        fetchPrinter()
    }

    return [removePrinter]
}