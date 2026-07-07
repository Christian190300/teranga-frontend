import { httpClient } from "./httpClient";

// Miroir des DTOs Java (com.terangasenegal.user.service.dto)

export interface AdminUtilisateur {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    roles: string[];
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