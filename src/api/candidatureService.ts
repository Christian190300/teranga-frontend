import { httpClient } from "./httpClient";
// réutilise le type déjà défini

export type StatutCandidature = "ENVOYEE" | "VUE" | "ACCEPTEE" | "REFUSEE" | "RETIREE";

export interface CandidatureDTO {
    id: number;
    offreId: number;
    candidatId: string;
    statut: StatutCandidature;
    message: string | null;
    dateCandidature: string;
    dateMaj: string | null;

    offreTitre: string | null;
    offreStatut: string | null;

    candidatFirstName: string | null;
    candidatLastName: string | null;
    candidatEmail: string | null;

    telephone: string | null;
    ville: string | null;
    pays: string | null;
    titreProfessionnel: string | null;
    niveauExperience: string | null;
    anneesExperience: number | null;
    competences: string[] | null;
    langues: string[] | null;

    photoPresente: boolean;
    cvPresent: boolean;
    cvOriginalFilename: string | null;
    lettreMotivationPresente: boolean;
    lettreMotivationOriginalFilename: string | null;
}

export const LABELS_STATUT_CANDIDATURE: Record<StatutCandidature, string> = {
    ENVOYEE: "Envoyée",
    VUE: "Vue",
    ACCEPTEE: "Acceptée",
    REFUSEE: "Refusée",
    RETIREE: "Retirée",
};

/** POST /api/offres/{offreId}/candidatures — le candidat postule. */
export async function postulerOffre(offreId: number, message?: string): Promise<CandidatureDTO> {
    const response = await httpClient.post<CandidatureDTO>(`/offres/${offreId}/candidatures`, message ? { message } : {});
    return response.data;
}

/** GET /api/offres/{offreId}/candidatures/statut — vérifie si le candidat a déjà postulé. */
export async function aDejaPostule(offreId: number): Promise<boolean> {
    const response = await httpClient.get<{ aDejaPostule: boolean }>(`/offres/${offreId}/candidatures/statut`);
    return response.data.aDejaPostule;
}

/** GET /api/candidatures/mine — mes candidatures (candidat connecté). */
export async function listerMesCandidatures(): Promise<CandidatureDTO[]> {
    const response = await httpClient.get<CandidatureDTO[]>("/candidatures/mine");
    return response.data;
}

/** DELETE /api/candidatures/{id} — le candidat retire sa candidature. */
export async function retirerCandidature(id: number): Promise<void> {
    await httpClient.delete(`/candidatures/${id}`);
}

/** GET /api/offres/{offreId}/candidatures — candidatures reçues pour une offre (recruteur propriétaire). */
export async function listerCandidaturesPourOffre(offreId: number): Promise<CandidatureDTO[]> {
    const response = await httpClient.get<CandidatureDTO[]>(`/offres/${offreId}/candidatures`);
    return response.data;
}

/** PUT /api/candidatures/{id}/statut — le recruteur change le statut d'une candidature. */
export async function changerStatutCandidature(id: number, statut: StatutCandidature): Promise<CandidatureDTO> {
    const response = await httpClient.put<CandidatureDTO>(`/candidatures/${id}/statut`, { statut });
    return response.data;
}

/** GET /api/candidatures/recues — toutes les candidatures reçues (recruteur), toutes offres confondues. */
export async function listerCandidaturesRecues(): Promise<CandidatureDTO[]> {
    const response = await httpClient.get<CandidatureDTO[]>("/candidatures/recues");
    return response.data;
}

/** GET /api/candidatures/{id}/cv — le recruteur télécharge le CV du candidat. */
export async function telechargerCvCandidature(candidatureId: number, filename: string): Promise<void> {
    const response = await httpClient.get(`/candidatures/${candidatureId}/cv`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = filename;
    lien.click();
    URL.revokeObjectURL(url);
}

/** GET /api/candidatures/{id}/lettre-motivation — le recruteur télécharge la lettre du candidat. */
export async function telechargerLettreMotivationCandidature(candidatureId: number, filename: string): Promise<void> {
    const response = await httpClient.get(`/candidatures/${candidatureId}/lettre-motivation`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = filename;
    lien.click();
    URL.revokeObjectURL(url);
}

/** GET /api/candidatures/toutes — admin uniquement, toutes offres et recruteurs confondus. */
export async function listerToutesCandidaturesAdmin(
    page = 0,
    size = 20
): Promise<CandidatureDTO[]> {
    const response = await httpClient.get<CandidatureDTO[]>(
        "/candidatures/admin/toutes",
        {
            params: { page, size },
        }
    );

    return response.data;
}