import React, { useEffect, useContext } from 'react'

import { Context as AuthContext } from '../context/AuthContext'
import {  withNavigation } from "react-navigation";
const ResolveAuthScreen = ({ navigation }) => {

    const { tryLocalSignin } = useContext(AuthContext)

    useEffect(() => {
        tryLocalSignin(navigation)
    }, [])

    return null
}


export default withNavigation(ResolveAuthScreen)