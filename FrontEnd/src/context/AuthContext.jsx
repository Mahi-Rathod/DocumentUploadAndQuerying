import React, {createContext, useContext, useReducer} from "react";
import { AuthReducer } from "../reducer/AuthReducer.jsx";

const AuthContext = createContext();


const AuthProvider = ({children}) => {
    const initialState = {
        isLogin : null,
        error : '',
        userId: ''
    }

    const [ {isLogin, userId, error}, authDispatch ] = useReducer(AuthReducer, initialState);

    return(
        <AuthContext.Provider value={{isLogin, error, userId, authDispatch}} >
            {children}
        </AuthContext.Provider>
    )

}


const useAuth = () =>useContext(AuthContext);


export {
    AuthProvider,
    useAuth
}