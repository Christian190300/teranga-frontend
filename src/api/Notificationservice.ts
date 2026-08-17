import { httpClient } from "./httpClient";

export type TypeNotificationCandidat = "NOUVELLE_OFFRE" | "FORMATION_RECOMMANDEE" | "ANNONCE";

export interface NotificationCandidatDTO {
    id: number;
    type: TypeNotificationCandidat;
    titre: string;
    message: string;
    lien: string | null;
    libelleAction: string | null;
    dateCreation: string;
    lu: boolean;
}

export interface PageResult<T> {
    content: T[];
    totalCount: number;
}

/** GET /api/notifications : mes notifications, paginées, plus récentes d'abord. */
export async function getMesNotifications(page = 0, size = 20): Promise<PageResult<NotificationCandidatDTO>> {
    const response = await httpClient.get("/notifications", { params: { page, size } });
    const totalCount = Number(response.headers["x-total-count"] ?? response.data.length);
    return { content: response.data, totalCount };
}

/** GET /api/notifications/non-lues/compteur */
export async function getCompteurNonLues(): Promise<number> {
    const response = await httpClient.get("/notifications/non-lues/compteur");
    return response.data.compteur;
}

/** PUT /api/notifications/{id}/lu */
export async function marquerNotificationLue(id: number): Promise<void> {
    await httpClient.put(`/notifications/${id}/lu`);
}

/** PUT /api/notifications/lues */
export async function marquerToutesNotificationsLues(): Promise<void> {
    await httpClient.put("/notifications/lues");
}

// ---------------------------------------------------------------------------
// Admin : envoi d'annonce ciblée
// ---------------------------------------------------------------------------

export type CibleAnnonce = "TOUS_LES_CANDIDATS" | "CANDIDAT_UNIQUE";

export interface EnvoyerAnnoncePayload {
    cible: CibleAnnonce;
    destinataireUserId?: string;
    titre: string;
    message: string;
    lien?: string;
    libelleAction?: string;
}

/** POST /api/admin/notifications-candidat/annonce */
export async function envoyerAnnonce(payload: EnvoyerAnnoncePayload): Promise<number> {
    const response = await httpClient.post("/admin/notifications-candidat/annonce", payload);
    return response.data.nombreEnvoyees;
}