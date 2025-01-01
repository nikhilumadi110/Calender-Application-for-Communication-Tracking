// src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = (loading) => {
        setIsLoading(loading);
    };
    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
       </LoadingContext.Provider>
    )
};

export const useLoading = () => {
    return useContext(LoadingContext);
}