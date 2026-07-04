import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import * as authService from "../api/authService";

interface AuthContextValue {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(authService.isAuthenticated());

    const login = useCallback(async (email: string, password: string) => {
        await authService.login(email, password);
        setAuthenticated(true);
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setAuthenticated(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated: authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
}