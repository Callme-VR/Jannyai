"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useContext, ReactNode } from "react";

// Define the context value type
interface AppContextType {
    user: any; // You can replace 'any' with the actual User type from Clerk if available
}

// Define the provider props type
interface AppContextProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const { user } = useUser();
    const value: AppContextType = {
        user
    }
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}