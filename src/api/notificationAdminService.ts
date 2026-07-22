import { httpClient } from "./httpClient";

export type TypeNotificationAdmin =
    | "CREATION_UTILISATEUR"
    | "CHANGEMENT_ROLE"
    | "ACTIVATION_COMPTE"
    | "DESACTIVATION_COMPTE"
    | "SUPPRESSION_OFFRE"
    | "SUPPRESSION_ENTREPRISE"
    | "NOUVELLE_INSCRIPTION";

export interface NotificationAdminDTO {
    id: number;
    type: TypeNotificationAdmin;
    message: string;
    responsableNom: string | null;
    dateCreation: string;
    lu: boolean;
}

export interface ListeNotificationsResultat {
    notifications: NotificationAdminDTO[];
    total: number;
}

const BASE_URL = "/admin/notifications";

/** GET /api/admin/notifications — liste paginée, la plus récente en premier. */
export async function listerNotifications(page = 0, size = 20): Promise<ListeNotificationsResultat> {
    const response = await httpClient.get<NotificationAdminDTO[]>(BASE_URL, { params: { page, size } });
    const total = Number(response.headers["x-total-count"] ?? response.data.length);
    return { notifications: response.data, total };
}

/** GET /api/admin/notifications/non-lues/compteur */
export async function compterNotificationsNonLues(): Promise<number> {
    const response = await httpClient.get<{ compteur: number }>(`${BASE_URL}/non-lues/compteur`);
    return response.data.compteur;
}

/** PUT /api/admin/notifications/{id}/lu */
export async function marquerNotificationLue(id: number): Promise<void> {
    await httpClient.put(`${BASE_URL}/${id}/lu`);
}

/** PUT /api/admin/notifications/lues */
export async function marquerToutesNotificationsLues(): Promise<void> {
    await httpClient.put(`${BASE_URL}/lues`);
}