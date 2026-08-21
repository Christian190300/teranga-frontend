import { httpClient } from "./httpClient";

export type StatutEvenement = "BROUILLON" | "PUBLIEE" | "ARCHIVEE";
export type TypeEvenement = "DIPLOME" | "STAGE" | "AUTRE";

export interface EvenementDTO {
    id: number;
    titre: string;
    imageUrl: string | null;
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
    imageUrl?: string;
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

export async function changerStatutEvenement(id: number, statut: StatutEvenement): Promise<EvenementDTO> {
    const response = await httpClient.put<EvenementDTO>(`${BASE_ADMIN}/${id}/statut`, { statut });
    return response.data;
}

export async function supprimerEvenement(id: number): Promise<void> {
    await httpClient.delete(`${BASE_ADMIN}/${id}`);
}