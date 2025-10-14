import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext);
}


export function AuthProvider(props) {
    const [authUser, setAuthUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (sessionStorage.getItem("USER_ACCESS_TOKEN") === undefined || sessionStorage.getItem("USER_ACCESS_TOKEN") == null) {
            navigate('/login');
        }
        
    })
    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    }

    return (
        <AuthContext.Provider value={value} >{props.children}</AuthContext.Provider>
    )
}