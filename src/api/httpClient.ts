import axios from "axios";
import { refreshToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;


export const httpClient = axios.create({
    baseURL: API_BASE_URL,
});


httpClient.interceptors.request.use(async (config) => {

    let token = localStorage.getItem(
        "ts_access_token"
    );


    if (token) {

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );


            const expiration =
                payload.exp * 1000;


            if (expiration - Date.now() < 60000) {

                const nouveauToken =
                    await refreshToken();


                if (nouveauToken) {
                    token = nouveauToken;
                }
            }


        } catch {

            token = null;
        }
    }


    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }


    return config;

});



httpClient.interceptors.response.use(

    response => response,


    async error => {


        if (error.response?.status === 401) {

            console.warn(
                "Session expirée"
            );


            localStorage.removeItem(
                "ts_access_token"
            );

            localStorage.removeItem(
                "ts_refresh_token"
            );


            window.location.href =
                "/login";
        }


        return Promise.reject(error);
    }

);