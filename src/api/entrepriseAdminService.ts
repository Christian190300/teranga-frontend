import { httpClient } from "./httpClient";
import type { ProfilRecruteurDTO } from "./profileService";


export interface ProfilRecruteur {
    id: number;
    userId: string;
    nomEntreprise: string;
    secteurActivite?: string;
    tailleEntreprise?: string;
    description?: string;
    siteWeb?: string;
    logoPresent: boolean;
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
    dateCreation: string;
    dateMaj?: string;
}

export interface ListeEntreprisesResultat {
    entreprises: ProfilRecruteur[];
    total: number;
}

export interface EntreprisesResultat {
    content: ProfilRecruteurDTO[];
    total: number;
    totalPages: number;
}

const BASE_URL = "/admin/entreprises";

/**
 * GET /api/admin/entreprises — liste paginée des entreprises (profils recruteurs),
 * avec recherche optionnelle par nom d'entreprise.
 */
export async function listerEntreprises(page = 0, size = 10, recherche = ""): Promise<EntreprisesResultat> {
    const response = await httpClient.get("/admin/entreprises", {
        params: { page, size, recherche: recherche || undefined },
    });
    return {
        content: response.data.content,
        total: response.data.totalElements,
        totalPages: response.data.totalPages,
    };
}

export async function obtenirEntreprise(id: number): Promise<ProfilRecruteur> {
    const response = await httpClient.get<ProfilRecruteur>(`${BASE_URL}/${id}`);
    return response.data;
}

export async function supprimerEntreprise(id: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`);
}
