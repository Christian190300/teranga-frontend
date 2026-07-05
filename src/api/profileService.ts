import { httpClient } from "./httpClient";

// ---------------------------------------------------------------------------
// Candidat
// ---------------------------------------------------------------------------

export interface ProfilCandidatDTO {
    id: number | null;
    userId: string;
    telephone: string | null;
    adresse: string | null;
    photoContentType: string | null;
    photoPresente: boolean;
    cvOriginalFilename: string | null;
    cvContentType: string | null;
    cvPresent: boolean;
    competences: string[] | null;
    dateCreation: string | null;
    dateMaj: string | null;
}

export interface UpdateProfilCandidatPayload {
    telephone?: string;
    adresse?: string;
    competences?: string[];
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

/**
 * Récupère la photo de profil du candidat connecté sous forme d'URL utilisable
 * dans un <img src>. Le blob doit être révoqué (URL.revokeObjectURL) quand il
 * n'est plus utilisé, pour éviter les fuites mémoire.
 */
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

/** Déclenche le téléchargement du CV du candidat connecté. */
export async function telechargerCvCandidat(nomFichier = "cv.pdf"): Promise<void> {
    const response = await httpClient.get("/profil/cv", { responseType: "blob" });
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
    description: string | null;
    telephoneEntreprise: string | null;
    logoContentType: string | null;
    logoPresent: boolean;
    dateCreation: string | null;
    dateMaj: string | null;
}

export interface UpdateProfilRecruteurPayload {
    nomEntreprise?: string;
    secteurActivite?: string;
    description?: string;
    telephoneEntreprise?: string;
}

export async function getMonProfilRecruteur(): Promise<ProfilRecruteurDTO> {
    const response = await httpClient.get<ProfilRecruteurDTO>("/profil-recruteur");
    return response.data;
}

export async function updateMonProfilRecruteur(payload: UpdateProfilRecruteurPayload): Promise<ProfilRecruteurDTO> {
    const response = await httpClient.put<ProfilRecruteurDTO>("/profil-recruteur", payload);
    return response.data;
}

/** Téléverse (ou remplace) le logo de l'entreprise du recruteur connecté. */
export async function uploaderLogoRecruteur(file: File): Promise<ProfilRecruteurDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<ProfilRecruteurDTO>("/profil-recruteur/logo", formData);
    return response.data;
}

/**
 * Récupère le logo de l'entreprise sous forme d'URL utilisable dans un <img src>.
 * Le blob doit être révoqué (URL.revokeObjectURL) quand il n'est plus utilisé.
 */
export async function obtenirLogoRecruteurUrl(): Promise<string | null> {
    try {
        const response = await httpClient.get("/profil-recruteur/logo", { responseType: "blob" });
        return URL.createObjectURL(response.data as Blob);
    } catch {
        return null;
    }
}