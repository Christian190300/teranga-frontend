import { useState } from "react";
import type { CSSProperties } from "react";
import { obtenirLogoEntreprisePublicUrl } from "../../api/profileService";

function initiales(nom: string | null): string {
    if (!nom) return "?";
    return nom.slice(0, 2).toUpperCase();
}

interface LogoEntrepriseProps {
    recruteurId: string;
    logoPresent: boolean;
    nomEntreprise: string | null;
    className?: string;
    style?: CSSProperties;
}

/**
 * Affiche le logo public d'une entreprise si présent, avec repli automatique
 * sur les initiales (même className/style) si absent ou si l'image échoue à charger.
 */
export function LogoEntreprise({ recruteurId, logoPresent, nomEntreprise, className, style }: LogoEntrepriseProps) {
    const [erreur, setErreur] = useState(false);

    if (!logoPresent || erreur) {
        return (
            <div className={className} style={style}>
                {initiales(nomEntreprise)}
            </div>
        );
    }

    return (
        <img
            src={obtenirLogoEntreprisePublicUrl(recruteurId)}
            alt={nomEntreprise ?? "Logo entreprise"}
            className={className}
            style={style}
            onError={() => setErreur(true)}
        />
    );
}