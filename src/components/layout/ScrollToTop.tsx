import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Remonte la page en haut à chaque changement de route, avec un léger
 * glissement fluide plutôt qu'un saut brutal.
 */
export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [pathname]);

    return null;
}