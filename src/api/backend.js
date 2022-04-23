import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from './../constants'

const instance = axios.create({
    baseURL:  `${BACKEND_URL}/api/ver1`
})

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

export default instance