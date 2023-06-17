import { createContext, useState,useContext } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    setUser: () => {},
    handleSetToken: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({name: "Aeriech"});
    const [token, setToken] = useState(); //localStorage.getItem("ACCESS_TOKEN")

    const handleSetToken = (token) => {
        setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };
    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                handleSetToken,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext)