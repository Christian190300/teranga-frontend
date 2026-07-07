import type { TypeContrat } from "../../api/offreService";

interface ContratColor {
    bg: string;
    text: string;
    bar: string;
}

const COULEURS: Record<TypeContrat, ContratColor> = {
    CDI: { bg: "#eaf0fb", text: "#14294d", bar: "#14294d" },
    CDD: { bg: "#e6f4ea", text: "#1e7e34", bar: "#2fa84f" },
    STAGE: { bg: "#fdf3e3", text: "#8a6212", bar: "#c8951e" },
    FREELANCE: { bg: "#f3eaFB", text: "#6b3fa0", bar: "#8a5cc7" },
    INTERIM: { bg: "#fdece3", text: "#a1481e", bar: "#e0692f" },
    ALTERNANCE: { bg: "#e3f6f5", text: "#1b7f7a", bar: "#2fb0a8" },
    SERVICE_CIVIQUE: { bg: "#eaf6ec", text: "#2c7a3f", bar: "#4caf6a" },
    TEMPS_PARTIEL: { bg: "#eef0f4", text: "#4a5568", bar: "#8a97ab" },
};

export function getCouleurContrat(type: TypeContrat): ContratColor {
    return COULEURS[type] ?? COULEURS.CDI;
}