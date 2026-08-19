import { httpClient } from "./httpClient";

/**
 * Tracking silencieux (page visitées, offres vues) pour alimenter les
 * statistiques admin/recruteur. N'échoue jamais bruyamment : un souci de
 * tracking ne doit jamais gêner l'utilisateur ni polluer la console.
 */

export async function enregistrerPageVisite(pagePath: string): Promise<void> {
    try {
        await httpClient.post("/tracking/page-visite", { pagePath });
    } catch {
        // silencieux : le tracking est un bonus, pas une fonctionnalité critique
    }
}

export async function enregistrerOffreVue(offreId: number): Promise<void> {
    try {
        await httpClient.post("/tracking/offre-vue", { offreId });
    } catch {
        // silencieux
    }
}