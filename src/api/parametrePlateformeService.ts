import { httpClient } from "./httpClient";

export interface ParametrePlateformeDTO {
    nomSite: string | null;
    emailContact: string | null;
    description: string | null;
    modeMaintenance: boolean;
    dateMaj: string | null;
}

export interface ParametrePlateformePublicDTO {
    nomSite: string | null;
    modeMaintenance: boolean;
}

export interface UpdateParametrePlateformePayload {
    nomSite?: string;
    emailContact?: string;
    description?: string;
    modeMaintenance: boolean;
}

/** GET /api/parametres/public — accessible sans authentification. */
export async function obtenirParametresPublic(): Promise<ParametrePlateformePublicDTO> {
    const response = await httpClient.get<ParametrePlateformePublicDTO>("/parametres/public");
    return response.data;
}

/** GET /api/admin/parametres */
export async function obtenirParametresAdmin(): Promise<ParametrePlateformeDTO> {
    const response = await httpClient.get<ParametrePlateformeDTO>("/admin/parametres");
    return response.data;
}

/** PUT /api/admin/parametres */
export async function mettreAJourParametres(payload: UpdateParametrePlateformePayload): Promise<ParametrePlateformeDTO> {
    const response = await httpClient.put<ParametrePlateformeDTO>("/admin/parametres", payload);
    return response.data;
}