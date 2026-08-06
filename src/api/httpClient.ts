import axios from "axios";
import { refreshToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
});


// Rafraîchissement automatique avant chaque requête
httpClient.interceptors.request.use(async (config) => {

    let token = localStorage.getItem("ts_access_token");

    if (token) {

        try {
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const expiration = payload.exp * 1000;
            const maintenant = Date.now();

            // Si le token expire dans moins de 60 secondes
            if (expiration - maintenant < 60000) {

                console.log("Renouvellement du token...");

                const nouveauToken = await refreshToken();

                if (nouveauToken) {
                    token = nouveauToken;
                }
            }

        } catch (e) {
            console.error("Erreur lecture token", e);
        }
    }


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});