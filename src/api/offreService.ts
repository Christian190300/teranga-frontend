import { httpClient } from "./httpClient";

export type TypeContrat = "CDI" | "CDD" | "STAGE" | "FREELANCE" | "INTERIM" | "ALTERNANCE" | "SERVICE_CIVIQUE" | "TEMPS_PARTIEL";
export type StatutOffre = "BROUILLON" | "PUBLIEE" | "FERMEE" | "EXPIREE";
export type NiveauExperience = "DEBUTANT" | "JUNIOR" | "INTERMEDIAIRE" | "SENIOR" | "EXPERT";
export type NiveauEtude = "AUCUN" | "BAC" | "BAC_2" | "BAC_3" | "BAC_5" | "DOCTORAT";

export interface OffreDTO {
    id: number;
    recruteurId: string;

    titre: string;
    secteurActivite: string | null;
    typeContrat: TypeContrat;
    statut: StatutOffre;
    datePublication: string | null;
    dateExpiration: string | null;

    pays: string | null;
    region: string | null;
    ville: string | null;
    adresse: string | null;
    teletravail: boolean | null;
    hybride: boolean | null;

    description: string | null;
    missions: string[] | null;

    profilRecherche: string | null;
    niveauExperience: NiveauExperience | null;
    experienceMinimum: number | null;
    niveauEtude: NiveauEtude | null;
    competences: string[] | null;
    langues: string[] | null;
    certifications: string[] | null;

    salaireMin: number | null;
    salaireMax: number | null;
    devise: string | null;
    salaireVisible: boolean | null;

    avantages: string[] | null;

    nombrePostes: number | null;
    dateDebut: string | null;
    disponibiliteSouhaitee: string | null;
    horaires: string | null;

    dateCreation: string;
    dateMaj: string | null;

    nomEntreprise: string | null;
    secteurActiviteEntreprise: string | null;
    logoPresent: boolean;
}

export interface UpsertOffrePayload {
    titre: string;
    secteurActivite?: string;
    typeContrat: TypeContrat;
    dateExpiration?: string;
    pays?: string;
    region?: string;
    ville?: string;
    adresse?: string;
    teletravail?: boolean;
    hybride?: boolean;
    description?: string;
    missions?: string[];
    profilRecherche?: string;
    niveauExperience?: NiveauExperience;
    experienceMinimum?: number;
    niveauEtude?: NiveauEtude;
    competences?: string[];
    langues?: string[];
    certifications?: string[];
    salaireMin?: number;
    salaireMax?: number;
    devise?: string;
    salaireVisible?: boolean;
    avantages?: string[];
    nombrePostes?: number;
    dateDebut?: string;
    disponibiliteSouhaitee?: string;
    horaires?: string;
}

/** Alias : OffreFormModal utilise ce nom, OffreFormPage utilise UpsertOffrePayload. Même forme. */
export type UpsertOffreDTO = UpsertOffrePayload;

interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

/** GET /api/offres — liste publique, uniquement les offres publiées. */
export async function listerOffresPubliques(page = 0, size = 10): Promise<SpringPage<OffreDTO>> {
    const response = await httpClient.get<SpringPage<OffreDTO>>("/offres", { params: { page, size } });
    return response.data;
}

/** GET /api/offres/toutes — admin uniquement, tous statuts, tous recruteurs. */
export async function listerToutesOffresAdmin(page = 0, size = 20): Promise<SpringPage<OffreDTO>> {
    const response = await httpClient.get<SpringPage<OffreDTO>>("/offres/toutes", { params: { page, size } });
    return response.data;
}

/** GET /api/offres/mine — offres du recruteur connecté, tous statuts. */
export async function listerMesOffres(): Promise<OffreDTO[]> {
    const response = await httpClient.get<OffreDTO[]>("/offres/mine");
    return response.data;
}

/** GET /api/offres/{id} */
export async function obtenirOffre(id: number): Promise<OffreDTO> {
    const response = await httpClient.get<OffreDTO>(`/offres/${id}`);
    return response.data;
}

/** POST /api/offres — création (statut initial BROUILLON). */
export async function creerOffre(payload: UpsertOffrePayload): Promise<OffreDTO> {
    const response = await httpClient.post<OffreDTO>("/offres", payload);
    return response.data;
}

/** PUT /api/offres/{id} */
export async function mettreAJourOffre(id: number, payload: UpsertOffrePayload): Promise<OffreDTO> {
    const response = await httpClient.put<OffreDTO>(`/offres/${id}`, payload);
    return response.data;
}

/** POST /api/offres/{id}/publier */
export async function publierOffre(id: number): Promise<OffreDTO> {
    const response = await httpClient.post<OffreDTO>(`/offres/${id}/publier`);
    return response.data;
}

/** POST /api/offres/{id}/fermer */
export async function fermerOffre(id: number): Promise<OffreDTO> {
    const response = await httpClient.post<OffreDTO>(`/offres/${id}/fermer`);
    return response.data;
}

/** DELETE /api/offres/{id} — recruteur propriétaire ou admin. */
export async function supprimerOffre(id: number): Promise<void> {
    await httpClient.delete(`/offres/${id}`);
}

// ---------------------------------------------------------------------------
// Listes de valeurs pour les <select> (formulaires)
// ---------------------------------------------------------------------------

export const TYPES_CONTRAT: TypeContrat[] = [
    "CDI",
    "CDD",
    "STAGE",
    "FREELANCE",
    "INTERIM",
    "ALTERNANCE",
    "SERVICE_CIVIQUE",
    "TEMPS_PARTIEL",
];

export const NIVEAUX_EXPERIENCE: NiveauExperience[] = ["DEBUTANT", "JUNIOR", "INTERMEDIAIRE", "SENIOR", "EXPERT"];

export const NIVEAUX_ETUDE: NiveauEtude[] = ["AUCUN", "BAC", "BAC_2", "BAC_3", "BAC_5", "DOCTORAT"];

export const STATUTS_OFFRE: StatutOffre[] = ["BROUILLON", "PUBLIEE", "FERMEE", "EXPIREE"];

// ---------------------------------------------------------------------------
// Labels français pour l'affichage
// ---------------------------------------------------------------------------

export const LABELS_TYPE_CONTRAT: Record<TypeContrat, string> = {
    CDI: "CDI",
    CDD: "CDD",
    STAGE: "Stage",
    FREELANCE: "Freelance",
    INTERIM: "Intérim",
    ALTERNANCE: "Alternance",
    SERVICE_CIVIQUE: "Service civique",
    TEMPS_PARTIEL: "Temps partiel",
};

export const LABELS_NIVEAU_EXPERIENCE: Record<NiveauExperience, string> = {
    DEBUTANT: "Débutant",
    JUNIOR: "Junior",
    INTERMEDIAIRE: "Intermédiaire",
    SENIOR: "Sénior",
    EXPERT: "Expert",
};

export const LABELS_NIVEAU_ETUDE: Record<NiveauEtude, string> = {
    AUCUN: "Aucun",
    BAC: "Bac",
    BAC_2: "Bac+2",
    BAC_3: "Bac+3",
    BAC_5: "Bac+5",
    DOCTORAT: "Doctorat",
};

export const LABELS_STATUT_OFFRE: Record<StatutOffre, string> = {
    BROUILLON: "Brouillon",
    PUBLIEE: "Publiée",
    FERMEE: "Fermée",
    EXPIREE: "Expirée",
};