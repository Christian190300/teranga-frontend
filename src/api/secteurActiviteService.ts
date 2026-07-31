import { httpClient } from "./httpClient";

export interface SecteurActiviteDTO {
    id: number;
    nom: string;
    actif: boolean;
    position: number | null;
}

export interface UpsertSecteurActivitePayload {
    nom: string;
    position?: number;
}

/** GET /api/secteurs-activite — liste publique, secteurs actifs uniquement (utilisée dans les formulaires). */
export async function listerSecteursActifs(): Promise<SecteurActiviteDTO[]> {
    const response = await httpClient.get<SecteurActiviteDTO[]>("/secteurs-activite");
    return response.data;
}

/** GET /api/admin/secteurs-activite — liste admin, tous les secteurs. */
export async function listerSecteursAdmin(): Promise<SecteurActiviteDTO[]> {
    const response = await httpClient.get<SecteurActiviteDTO[]>("/admin/secteurs-activite");
    return response.data;
}

export async function creerSecteur(payload: UpsertSecteurActivitePayload): Promise<SecteurActiviteDTO> {
    const response = await httpClient.post<SecteurActiviteDTO>("/admin/secteurs-activite", payload);
    return response.data;
}

export async function modifierSecteur(id: number, payload: UpsertSecteurActivitePayload): Promise<SecteurActiviteDTO> {
    const response = await httpClient.put<SecteurActiviteDTO>(`/admin/secteurs-activite/${id}`, payload);
    return response.data;
}

export async function definirActivationSecteur(id: number, actif: boolean): Promise<SecteurActiviteDTO> {
    const response = await httpClient.put<SecteurActiviteDTO>(`/admin/secteurs-activite/${id}/activation`, { actif });
    return response.data;
}

export async function supprimerSecteur(id: number): Promise<void> {
    await httpClient.delete(`/admin/secteurs-activite/${id}`);
}