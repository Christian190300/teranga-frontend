import axios from "axios";
import { httpClient } from "./httpClient";

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL as string;
const REALM = import.meta.env.VITE_KEYCLOAK_REALM as string;
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

export type RoleUtilisateur = "CANDIDAT" | "RECRUTEUR";

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleUtilisateur;
    // Champs entreprise, requis uniquement si role = RECRUTEUR
    nomEntreprise?: string;
    secteurActivite?: string;
    descriptionEntreprise?: string;
    telephoneEntreprise?: string;
}

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

/**
 * Connexion directe contre Keycloak (grant "password").
 * Le client utilisé doit être PUBLIC (pas de secret) avec "Direct Access Grants" activé.
 */
export async function login(email: string, password: string): Promise<void> {
    const url = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set("grant_type", "password");
    body.set("client_id", CLIENT_ID);
    body.set("username", email);
    body.set("password", password);

    const response = await axios.post<TokenResponse>(url, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("ts_access_token", response.data.access_token);
    localStorage.setItem("ts_refresh_token", response.data.refresh_token);
}

/**
 * Inscription : le backend crée l'utilisateur dans Keycloak + son profil.
 */
export async function register(payload: RegisterPayload): Promise<void> {
    await httpClient.post("/register", payload);
}

/**
 * Déconnexion : invalide le refresh token côté Keycloak et nettoie le stockage local.
 */
export async function logout(): Promise<void> {
    const refreshToken = localStorage.getItem("ts_refresh_token");
    const url = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;

    if (refreshToken) {
        const body = new URLSearchParams();
        body.set("client_id", CLIENT_ID);
        body.set("refresh_token", refreshToken);

        try {
            await axios.post(url, body, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        } catch {
            // Même si l'appel échoue (ex: token déjà expiré), on nettoie le stockage local.
        }
    }

    localStorage.removeItem("ts_access_token");
    localStorage.removeItem("ts_refresh_token");
}

export function isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("ts_access_token"));
}

/** Récupère l'identité + le profil déjà rempli de l'utilisateur connecté. */
export async function getMonCompte() {
    const response = await httpClient.get("/account");
    return response.data;
}