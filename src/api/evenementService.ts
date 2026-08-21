import { httpClient } from "./httpClient";

export type StatutEvenement = "BROUILLON" | "PUBLIEE" | "ARCHIVEE";
export type TypeEvenement = "DIPLOME" | "STAGE" | "AUTRE";

export interface EvenementDTO {
    id: number;
    titre: string;
    imagePresente: boolean;
    imageNomOriginal: string | null;
    dateEvenement: string; // yyyy-MM-dd
    heure: string | null; // "HH:mm"
    lieu: string | null;
    description: string | null;
    organisateur: string | null;
    lien: string | null;
    type: TypeEvenement | null;
    statut: StatutEvenement;
    dateCreation: string | null;
    dateMaj: string | null;
}

export interface EvenementFormPayload {
    titre: string;
    dateEvenement: string;
    heure?: string;
    lieu?: string;
    description?: string;
    organisateur?: string;
    lien?: string;
    type?: TypeEvenement;
}

export const LABELS_STATUT_EVENEMENT: Record<StatutEvenement, string> = {
    BROUILLON: "Brouillon",
    PUBLIEE: "Publié",
    ARCHIVEE: "Archivé",
};

export const LABELS_TYPE_EVENEMENT: Record<TypeEvenement, string> = {
    DIPLOME: "Cérémonie de diplômés",
    STAGE: "Stage",
    AUTRE: "Autre",
};

// ---------- Public ----------

/** GET /api/evenements — événements publiés, triés par date. */
export async function listerEvenementsPublics(): Promise<EvenementDTO[]> {
    const response = await httpClient.get<EvenementDTO[]>("/evenements");
    return response.data;
}

/** GET /api/evenements/{id} */
export async function obtenirEvenementPublic(id: number): Promise<EvenementDTO> {
    const response = await httpClient.get<EvenementDTO>(`/evenements/${id}`);
    return response.data;
}

/** GET /api/evenements/{id}/image — retourne une blob URL à libérer via URL.revokeObjectURL. */
export async function obtenirImageEvenementPubliqueUrl(id: number): Promise<string | null> {
    try {
        const response = await httpClient.get(`/evenements/${id}/image`, { responseType: "blob" });
        return URL.createObjectURL(response.data as Blob);
    } catch {
        return null;
    }
}

// ---------- Admin ----------

const BASE_ADMIN = "/admin/evenements";

export async function listerEvenementsAdmin(): Promise<EvenementDTO[]> {
    const response = await httpClient.get<EvenementDTO[]>(BASE_ADMIN);
    return response.data;
}

export async function creerEvenement(payload: EvenementFormPayload): Promise<EvenementDTO> {
    const response = await httpClient.post<EvenementDTO>(BASE_ADMIN, payload);
    return response.data;
}

export async function modifierEvenement(id: number, payload: EvenementFormPayload): Promise<EvenementDTO> {
    const response = await httpClient.put<EvenementDTO>(`${BASE_ADMIN}/${id}`, payload);
    return response.data;
}

/** POST /api/admin/evenements/{id}/image — upload direct depuis la galerie photo du device. */
export async function uploaderImageEvenement(id: number, fichier: File): Promise<EvenementDTO> {
    const formData = new FormData();
    formData.append("fichier", fichier);
    const response = await httpClient.post<EvenementDTO>(`${BASE_ADMIN}/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/** GET /api/admin/evenements/{id}/image — retourne une blob URL à libérer via URL.revokeObjectURL. */
export async function obtenirImageEvenementAdminUrl(id: number): Promise<string | null> {
    try {
        const response = await httpClient.get(`${BASE_ADMIN}/${id}/image`, { responseType: "blob" });
        return URL.createObjectURL(response.data as Blob);
    } catch {
        return null;
    }
}

export async function changerStatutEvenement(id: number, statut: StatutEvenement): Promise<EvenementDTO> {
    const response = await httpClient.put<EvenementDTO>(`${BASE_ADMIN}/${id}/statut`, { statut });
    return response.data;
}

export async function supprimerEvenement(id: number): Promise<void> {
    await httpClient.delete(`${BASE_ADMIN}/${id}`);
}