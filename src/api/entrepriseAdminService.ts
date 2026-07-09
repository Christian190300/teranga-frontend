import { httpClient } from "./httpClient";

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

const BASE_URL = "/admin/entreprises";

/**
 * GET /api/admin/entreprises — liste paginée des entreprises (profils recruteurs),
 * avec recherche optionnelle par nom. Le backend renvoie une liste brute + le total
 * dans le header X-Total-Count (pas un objet Page Spring Data).
 */
export async function listerEntreprises(page = 0, size = 10, recherche = ""): Promise<ListeEntreprisesResultat> {
    const response = await httpClient.get<ProfilRecruteur[]>(BASE_URL, {
        params: { page, size, recherche: recherche || undefined },
    });
    const total = Number(response.headers["x-total-count"] ?? response.data.length);
    return { entreprises: response.data, total };
}

export async function obtenirEntreprise(id: number): Promise<ProfilRecruteur> {
    const response = await httpClient.get<ProfilRecruteur>(`${BASE_URL}/${id}`);
    return response.data;
}

export async function supprimerEntreprise(id: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`);
}