import { Toast } from 'native-base';
import { useContext } from 'react'
import { Context as PrinterContext } from '../context/PrinterContext'
import { navigate } from '../navigationRef';

export default () => {
    const { createPrinter } = useContext(PrinterContext);

    const savePrinter = (value) => {
        createPrinter(value).then(() => {
            navigate('PrinterList')
        })
    }

    return [savePrinter]
}