import type { TypeNotificationAdmin } from "../../api/notificationAdminService";

export const LABELS_TYPE_NOTIFICATION: Record<TypeNotificationAdmin, string> = {
    CREATION_UTILISATEUR: "Utilisateur créé",
    CHANGEMENT_ROLE: "Rôle modifié",
    ACTIVATION_COMPTE: "Compte activé",
    DESACTIVATION_COMPTE: "Compte désactivé",
    SUPPRESSION_OFFRE: "Offre supprimée",
    SUPPRESSION_ENTREPRISE: "Entreprise supprimée",
    NOUVELLE_INSCRIPTION: "Nouvelle inscription",
};

/** Couleur d'accent par catégorie d'action (créations/positif = vert, suppressions = rouge, reste = navy/or). */
export function couleurNotification(type: TypeNotificationAdmin): string {
    switch (type) {
        case "NOUVELLE_INSCRIPTION":
        case "CREATION_UTILISATEUR":
        case "ACTIVATION_COMPTE":
            return "#1e7e34";
        case "SUPPRESSION_OFFRE":
        case "SUPPRESSION_ENTREPRISE":
        case "DESACTIVATION_COMPTE":
            return "#b3261e";
        case "CHANGEMENT_ROLE":
        default:
            return "#c8951e";
    }
}