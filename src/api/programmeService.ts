import { httpClient } from "./httpClient";

export type StatutProgramme = "BROUILLON" | "PUBLIEE";

export interface ProgrammeDTO {
    id: number;
    titre: string;
    imagePresente: boolean;
    imageNomOriginal: string | null;
    description: string | null;
    formateur: string | null;
    dateDebut: string; // LocalDate ISO "2026-09-10"
    dateFin: string | null;
    lien: string | null;
    statut: StatutProgramme;
    dateCreation: string;
    dateMaj: string | null;
}

export interface CreerModifierProgrammeDTO {
    titre: string;
    description: string | null;
    formateur: string | null;
    dateDebut: string;
    dateFin: string | null;
    lien: string | null;
}

// ---------- Public ----------

export async function listerProgrammesPublics(): Promise<ProgrammeDTO[]> {
    const response = await httpClient.get<ProgrammeDTO[]>("/programmes");
    return response.data;
}

export async function obtenirProgrammePublic(id: number): Promise<ProgrammeDTO> {
    const response = await httpClient.get<ProgrammeDTO>(`/programmes/${id}`);
    return response.data;
}

export function urlImageProgrammePublique(id: number): string {
    return `/api/programmes/${id}/image`;
}

// ---------- Admin ----------

export async function listerProgrammesAdmin(): Promise<ProgrammeDTO[]> {
    const response = await httpClient.get<ProgrammeDTO[]>("/admin/programmes");
    return response.data;
}

export async function obtenirProgrammeAdmin(id: number): Promise<ProgrammeDTO> {
    const response = await httpClient.get<ProgrammeDTO>(`/admin/programmes/${id}`);
    return response.data;
}

export async function creerProgramme(dto: CreerModifierProgrammeDTO): Promise<ProgrammeDTO> {
    const response = await httpClient.post<ProgrammeDTO>("/admin/programmes", dto);
    return response.data;
}

export async function modifierProgramme(id: number, dto: CreerModifierProgrammeDTO): Promise<ProgrammeDTO> {
    const response = await httpClient.put<ProgrammeDTO>(`/admin/programmes/${id}`, dto);
    return response.data;
}

export async function changerStatutProgramme(id: number, statut: StatutProgramme): Promise<ProgrammeDTO> {
    const response = await httpClient.put<ProgrammeDTO>(`/admin/programmes/${id}/statut`, { statut });
    return response.data;
}

export async function uploaderImageProgramme(id: number, fichier: File): Promise<ProgrammeDTO> {
    const formData = new FormData();
    formData.append("fichier", fichier);
    const response = await httpClient.post<ProgrammeDTO>(`/admin/programmes/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function supprimerProgramme(id: number): Promise<void> {
    await httpClient.delete(`/admin/programmes/${id}`);
}

export function urlImageProgrammeAdmin(id: number): string {
    return `/admin/programmes/${id}/image`;
}