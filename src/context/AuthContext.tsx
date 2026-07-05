import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as authService from "../api/authService";
import { getMonCompte } from "../api/authService";

export type Role = "CANDIDAT" | "RECRUTEUR" | "ADMIN";

interface CurrentUser {
    firstName: string;
    lastName: string;
    email: string;
    role: Role | null;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    isLoadingUser: boolean;
    currentUser: CurrentUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractRole(authorities: string[] | undefined): Role | null {
    if (!authorities) return null;
    if (authorities.includes("ROLE_ADMIN")) return "ADMIN";
    if (authorities.includes("ROLE_RECRUTEUR")) return "RECRUTEUR";
    if (authorities.includes("ROLE_CANDIDAT")) return "CANDIDAT";
    return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(authService.isAuthenticated());
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const refreshCurrentUser = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setCurrentUser(null);
            return;
        }
        setIsLoadingUser(true);
        try {
            const data = await getMonCompte();
            setCurrentUser({
                firstName: data.compte.firstName,
                lastName: data.compte.lastName,
                email: data.compte.email,
                role: extractRole(data.compte.authorities),
            });
        } catch {
            setCurrentUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    }, []);

    // Au chargement de l'app, si un token existe déjà (rechargement de page), on récupère le rôle.
    useEffect(() => {
        if (authenticated) {
            refreshCurrentUser();
        }
    }, [authenticated, refreshCurrentUser]);

    const login = useCallback(
        async (email: string, password: string) => {
            await authService.login(email, password);
            setAuthenticated(true);
            await refreshCurrentUser();
        },
        [refreshCurrentUser]
    );

    const logout = useCallback(async () => {
        await authService.logout();
        setAuthenticated(false);
        setCurrentUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: authenticated, isLoadingUser, currentUser, login, logout, refreshCurrentUser }}
        >
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