import { httpClient } from "./httpClient";

// ---------------------------------------------------------------------------
// Candidat
// ---------------------------------------------------------------------------

export interface ProfilCandidatDTO {
    id: number | null;
    userId: string;

    telephone: string | null;
    adresse: string | null;
    sexe: string | null;
    ville: string | null;
    region: string | null;
    pays: string | null;
    mobilite: boolean | null;
    teletravail: boolean | null;

    titreProfessionnel: string | null;
    aPropos: string | null;
    niveauExperience: string | null;
    anneesExperience: number | null;
    disponibilite: string | null;

    formations: string[] | null;
    certifications: string[] | null;
    langues: string[] | null;
    competences: string[] | null;

    linkedin: string | null;
    github: string | null;
    portfolio: string | null;

    photoContentType: string | null;
    photoPresente: boolean;

    cvOriginalFilename: string | null;
    cvContentType: string | null;
    cvPresent: boolean;

    lettreMotivationOriginalFilename: string | null;
    lettreMotivationContentType: string | null;
    lettreMotivationPresente: boolean;

    dateCreation: string | null;
    dateMaj: string | null;
}

export interface UpdateProfilCandidatPayload {
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
    formations?: string[];
    certifications?: string[];
    langues?: string[];
    competences?: string[];
    linkedin?: string;
    github?: string;
    portfolio?: string;
}

export async function getMonProfilCandidat(): Promise<ProfilCandidatDTO> {
    const response = await httpClient.get<ProfilCandidatDTO>("/profil");
    return response.data;
}

export async function updateMonProfilCandidat(payload: UpdateProfilCandidatPayload): Promise<ProfilCandidatDTO> {
    const response = await httpClient.put<ProfilCandidatDTO>("/profil", payload);
    return response.data;
}

/** Téléverse (ou remplace) la photo de profil du candidat connecté. */
export async function uploaderPhotoCandidat(file: File): Promise<ProfilCandidatDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<ProfilCandidatDTO>("/profil/photo", formData);
    return response.data;
}

export async function obtenirPhotoCandidatUrl(): Promise<string | null> {
    try {
        const response = await httpClient.get("/profil/photo", { responseType: "blob" });
        return URL.createObjectURL(response.data as Blob);
    } catch {
        return null;
    }
}

/** Téléverse (ou remplace) le CV (PDF) du candidat connecté. */
export async function uploaderCvCandidat(file: File): Promise<ProfilCandidatDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<ProfilCandidatDTO>("/profil/cv", formData);
    return response.data;
}

export async function telechargerCvCandidat(nomFichier = "cv.pdf"): Promise<void> {
    const response = await httpClient.get("/profil/cv", { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichier;
    lien.click();
    URL.revokeObjectURL(url);
}

/** Téléverse (ou remplace) la lettre de motivation (PDF) du candidat connecté. */
export async function uploaderLettreMotivation(file: File): Promise<ProfilCandidatDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<ProfilCandidatDTO>("/profil/lettre-motivation", formData);
    return response.data;
}

export async function telechargerLettreMotivation(nomFichier = "lettre-motivation.pdf"): Promise<void> {
    const response = await httpClient.get("/profil/lettre-motivation", { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichier;
    lien.click();
    URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Recruteur
// ---------------------------------------------------------------------------

export interface ProfilRecruteurDTO {
    id: number | null;
    userId: string;

    nomEntreprise: string | null;
    secteurActivite: string | null;
    tailleEntreprise: string | null;
    description: string | null;
    siteWeb: string | null;

    logoContentType: string | null;
    logoPresent: boolean;

    nomContact: string | null;
    fonctionContact: string | null;
    emailProfessionnel: string | null;
    telephoneEntreprise: string | null;

    pays: string | null;
    region: string | null;
    ville: string | null;
    adresse: string | null;

    linkedin: string | null;
    facebook: string | null;
    twitter: string | null;

    dateCreation: string | null;
    dateMaj: string | null;
}

export interface UpdateProfilRecruteurPayload {
    nomEntreprise?: string;
    secteurActivite?: string;
    tailleEntreprise?: string;
    description?: string;
    siteWeb?: string;
    nomContact?: string;
    fonctionContact?: string;
    emailProfessionnel?: string;
    telephoneEntreprise?: string;
    pays?: string;
    region?: string;
    ville?: string;
    adresse?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
}

export async function getMonProfilRecruteur(): Promise<ProfilRecruteurDTO> {
    const response = await httpClient.get<ProfilRecruteurDTO>("/profil-recruteur");
    return response.data;
}

export async function updateMonProfilRecruteur(payload: UpdateProfilRecruteurPayload): Promise<ProfilRecruteurDTO> {
    const response = await httpClient.put<ProfilRecruteurDTO>("/profil-recruteur", payload);
    return response.data;
}

export async function uploaderLogoRecruteur(file: File): Promise<ProfilRecruteurDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<ProfilRecruteurDTO>("/profil-recruteur/logo", formData);
    return response.data;
}

export async function obtenirLogoRecruteurUrl(): Promise<string | null> {
    try {
        const response = await httpClient.get("/profil-recruteur/logo", { responseType: "blob" });
        return URL.createObjectURL(response.data as Blob);
    } catch {
        return null;
    }
}