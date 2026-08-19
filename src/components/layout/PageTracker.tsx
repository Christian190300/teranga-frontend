import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { enregistrerPageVisite } from "../../api/trackingService";

/**
 * Enregistre silencieusement chaque changement de page pour les statistiques
 * admin. Même principe que <ScrollToTop /> : un composant sans rendu, monté
 * une fois dans App.tsx, qui réagit aux changements de route.
 * <p>
 * Ne track pas les pages d'authentification (connexion/inscription/reset...)
 * pour ne pas polluer les stats avec du bruit non pertinent pour le métier.
 */
const PAGES_IGNOREES = [
    "/connexion",
    "/inscription",
    "/mot-de-passe-oublie",
    "/reinitialiser-mot-de-passe",
    "/premiere-connexion",
    "/verifier-email",
];

export function PageTracker() {
    const location = useLocation();
    const dernierePage = useRef<string | null>(null);

    useEffect(() => {
        const path = location.pathname;

        // Évite les doublons si le composant se remonte sans changement de route réel
        if (path === dernierePage.current) return;
        dernierePage.current = path;

        const estIgnoree = PAGES_IGNOREES.some((p) => path.startsWith(p));
        if (!estIgnoree) {
            enregistrerPageVisite(path);
        }
    }, [location.pathname]);

    return null;
}