import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import * as authService from "../api/authService";
import { getMonCompte } from "../api/authService";
import { obtenirPhotoCandidatUrl, obtenirLogoRecruteurUrl } from "../api/profileService";

export type Role = "CANDIDAT" | "RECRUTEUR" | "ADMIN";

interface CurrentUser {
    firstName: string;
    lastName: string;
    email: string;
    role: Role | null;
    photoUrl: string | null;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    isLoadingUser: boolean;
    currentUser: CurrentUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshCurrentUser: () => Promise<void>;
    refreshPhoto: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractRole(authorities: string[] | undefined): Role | null {
    if (!authorities) return null;
    if (authorities.includes("ROLE_ADMIN")) return "ADMIN";
    if (authorities.includes("ROLE_RECRUTEUR")) return "RECRUTEUR";
    if (authorities.includes("ROLE_CANDIDAT")) return "CANDIDAT";
    return null;
}

/** Charge la photo (candidat) ou le logo (recruteur) selon le rôle, sinon null. */
async function chargerPhotoSelonRole(role: Role | null): Promise<string | null> {
    if (role === "CANDIDAT") return obtenirPhotoCandidatUrl();
    if (role === "RECRUTEUR") return obtenirLogoRecruteurUrl();
    return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(authService.isAuthenticated());
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    // Garde une référence vers l'URL blob active pour pouvoir la révoquer proprement
    // (évite les fuites mémoire) sans dépendre de currentUser dans les deps d'effet.
    const photoUrlRef = useRef<string | null>(null);

    function revokePhotoActuelle() {
        if (photoUrlRef.current) {
            URL.revokeObjectURL(photoUrlRef.current);
            photoUrlRef.current = null;
        }
    }

    const refreshCurrentUser = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            revokePhotoActuelle();
            setCurrentUser(null);
            return;
        }
        setIsLoadingUser(true);
        try {
            const data = await getMonCompte();
            const role = extractRole(data.compte.authorities);
            const photoUrl = await chargerPhotoSelonRole(role);

            revokePhotoActuelle();
            photoUrlRef.current = photoUrl;

            setCurrentUser({
                firstName: data.compte.firstName,
                lastName: data.compte.lastName,
                email: data.compte.email,
                role,
                photoUrl,
            });
        } catch {
            revokePhotoActuelle();
            setCurrentUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    }, []);

    /**
     * Recharge uniquement la photo/logo (sans re-fetcher tout le compte).
     * À appeler juste après un upload réussi depuis la page profil.
     */
    const refreshPhoto = useCallback(async () => {
        if (!currentUser) return;
        const photoUrl = await chargerPhotoSelonRole(currentUser.role);
        revokePhotoActuelle();
        photoUrlRef.current = photoUrl;
        setCurrentUser((prev) => (prev ? { ...prev, photoUrl } : prev));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.role]);

    // Au chargement de l'app, si un token existe déjà (rechargement de page), on récupère le rôle.
    useEffect(() => {
        if (authenticated) {
            refreshCurrentUser();
        }
        // Révoque l'URL blob au démontage complet de l'app.
        return () => revokePhotoActuelle();
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
        revokePhotoActuelle();
        setCurrentUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: authenticated,
                isLoadingUser,
                currentUser,
                login,
                logout,
                refreshCurrentUser,
                refreshPhoto,
            }}
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