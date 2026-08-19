import { httpClient } from "./httpClient";

export interface PageVisiteeDTO {
    pagePath: string;
    nombre: number;
}

export interface OffreVueResumeDTO {
    offreId: number;
    titreOffre: string | null;
    dateVue: string;
}

export interface CandidatureResumeDTO {
    id: number;
    offreId: number;
    titreOffre: string | null;
    statut: string | null;
    dateCandidature: string;
}

export interface UserActivityDTO {
    userId: string;
    nombrePagesVisitees: number;
    pagesVisitees: PageVisiteeDTO[];
    nombreOffresVues: number;
    offresVues: OffreVueResumeDTO[];
    nombreCandidatures: number;
    candidatures: CandidatureResumeDTO[];
}

/** Champs connus de ProfilRecruteurDTO — étends si tu en as d'autres, le reste est ignoré sans casser le typage. */
export interface ProfilRecruteurAdminDTO {
    nomEntreprise?: string;
    secteurActivite?: string;
    descriptionEntreprise?: string;
    telephoneEntreprise?: string;
    logoPresent?: boolean;
    [key: string]: unknown;
}

export type TypeProfilAdmin = "RECRUTEUR" | "CANDIDAT" | "INCONNU";

/** Reprend les champs de ProfilCandidatDTO tels qu'utilisés dans ProfilCandidatPage.tsx. */
export interface ProfilCandidatAdminDTO {
    telephone?: string;
    adresse?: string;
    sexe?: string;
    ville?: string;
    region?: string;
    pays?: string;
    mobilite?: boolean;
    teletravail?: boolean;
    titreProfessionnel?: string;
    aPropos?: string;
    niveauExperience?: string;
    anneesExperience?: number;
    disponibilite?: string;
    niveauEtude?: string;
    formations?: string[];
    certifications?: string[];
    langues?: string[];
    competences?: string[];
    linkedin?: string;
    github?: string;
    portfolio?: string;
    photoPresente?: boolean;
    cvPresent?: boolean;
    cvOriginalFilename?: string | null;
    lettreMotivationPresente?: boolean;
    lettreMotivationOriginalFilename?: string | null;
    videoStatut?: string;
    videoDureeSecondes?: number | null;
    dateCreation?: string;
    dateMaj?: string;
    score?: { percentage: number } | number;
    [key: string]: unknown;
}

export interface ProfilCompletAdminDTO {
    userId: string;
    typeProfil: TypeProfilAdmin;
    profilRecruteur?: ProfilRecruteurAdminDTO;
    profilCandidat?: ProfilCandidatAdminDTO;
}

/** GET /api/admin/utilisateurs/{userId}/activite */
export async function getActiviteUtilisateur(userId: string): Promise<UserActivityDTO> {
    const response = await httpClient.get(`/admin/utilisateurs/${userId}/activite`);
    return response.data;
}

/** GET /api/admin/utilisateurs/{userId}/profil-complet */
export async function getProfilCompletUtilisateur(userId: string): Promise<ProfilCompletAdminDTO> {
    const response = await httpClient.get(`/admin/utilisateurs/${userId}/profil-complet`);
    return response.data;
}