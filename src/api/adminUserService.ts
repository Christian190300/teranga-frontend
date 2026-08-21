import { httpClient } from "./httpClient";
import type { OffreDTO } from "./offreService";

// Miroir des DTOs Java (com.terangasenegal.user.service.dto)

export interface AdminUtilisateur {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    roles: string[];
    derniereConnexion: string | null;
}

export interface CreerUtilisateurAdmin {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
}

export interface ChangerRole {
    role: string;
}

export interface Activation {
    actif: boolean;
}

export interface PageOffres {
    content: OffreDTO[];
    totalElements: number;
    totalPages: number;
    number: number; // page courante (0-indexée)
    size: number;
}

export interface InscriptionsParPeriode {
    parJour: Record<string, number>;
    parMois: Record<string, number>;
    parAnnee: Record<string, number>;
}

export interface StatistiqueInscriptionDTO {
    periode: string;
    total: number;
}

// À vérifier contre KeycloakAdminService.ROLES_GERES côté backend.
export const ROLES_GERES = [
    "ROLE_CANDIDAT",
    "ROLE_RECRUTEUR",
    "ROLE_ADMIN",
] as const;

export const LABELS_ROLES: Record<string, string> = {
    ROLE_CANDIDAT: "Candidat",
    ROLE_RECRUTEUR: "Recruteur",
    ROLE_ADMIN: "Administrateur",
};
export type RoleGere = (typeof ROLES_GERES)[number];

export interface ListeUtilisateursResultat {
    utilisateurs: AdminUtilisateur[];
    total: number;
}
export interface UtilisateursStatistiques {
    total: number;
    actifs: number;
    inactifs: number;
}

const BASE_URL = "/admin/utilisateurs";

export async function listerUtilisateurs(
    page: number,
    size: number,
    recherche: string
): Promise<ListeUtilisateursResultat> {
    const response = await httpClient.get<AdminUtilisateur[]>(BASE_URL, {
        params: { page, size, recherche: recherche || undefined },
    });

    const total = Number(response.headers["x-total-count"] ?? response.data.length);
    return { utilisateurs: response.data, total };
}

export async function creerUtilisateur(dto: CreerUtilisateurAdmin): Promise<AdminUtilisateur> {
    const response = await httpClient.post<AdminUtilisateur>(BASE_URL, dto);
    return response.data;
}

export async function changerRole(id: string, dto: ChangerRole): Promise<void> {
    await httpClient.put(`${BASE_URL}/${id}/role`, dto);
}

export async function definirActivation(id: string, dto: Activation): Promise<void> {
    await httpClient.put(`${BASE_URL}/${id}/activation`, dto);
}

/**
 * Liste ADMIN : toutes les offres, tous statuts confondus, tous recruteurs.
 * Backend : GET /api/offres/toutes (protégé ROLE_ADMIN), renvoie un objet Page
 * Spring Data brut (pas une liste + header, contrairement aux endpoints /admin/*).
 */
export async function listerToutesOffresAdmin(page: number, size: number): Promise<PageOffres> {
    const response = await httpClient.get<PageOffres>("/offres/toutes", {
        params: { page, size },
    });
    return response.data;
}

export async function obtenirStatistiquesUtilisateurs(): Promise<UtilisateursStatistiques> {
    const response = await httpClient.get<UtilisateursStatistiques>(`${BASE_URL}/statistiques`);
    return response.data;
}

export async function obtenirStatistiquesInscriptions(): Promise<InscriptionsParPeriode> {
    const response = await httpClient.get<InscriptionsParPeriode>(`${BASE_URL}/statistiques/inscriptions`);
    return response.data;
}

/** Formate une date de dernière connexion en relatif (ex: "il y a 3 jours"), ou "Jamais connecté" si null. */
export function formaterDerniereConnexion(derniereConnexion: string | null): string {
    if (!derniereConnexion) {
        return "Jamais connecté";
    }

    const date = new Date(derniereConnexion);
    const maintenant = new Date();
    const diffMs = maintenant.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHeures = Math.floor(diffMinutes / 60);
    const diffJours = Math.floor(diffHeures / 24);

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffHeures < 24) return `Il y a ${diffHeures} h`;
    if (diffJours === 1) return "Hier";
    if (diffJours < 30) return `Il y a ${diffJours} j`;

    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
