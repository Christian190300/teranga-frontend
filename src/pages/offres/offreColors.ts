import type { TypeContrat } from "../../api/offreService";

interface ContratColor {
    bg: string;
    text: string;
    bar: string;
    /** Ombre teintée (rgba) utilisée au survol des cartes, pour que chaque type de contrat ait sa propre identité colorée. */
    shadow: string;
    /** Dégradé utilisé pour le badge-logo (initiales) quand l'entreprise n'a pas de logo. */
    gradient: string;
}

const COULEURS: Record<TypeContrat, ContratColor> = {
    CDI: {
        bg: "#eaf0fb",
        text: "#14294d",
        bar: "#14294d",
        shadow: "rgba(20, 41, 77, 0.22)",
        gradient: "linear-gradient(135deg, #14294d 0%, #2c4a85 100%)",
    },
    CDD: {
        bg: "#e6f4ea",
        text: "#1e7e34",
        bar: "#2fa84f",
        shadow: "rgba(47, 168, 79, 0.26)",
        gradient: "linear-gradient(135deg, #1e7e34 0%, #3fbf63 100%)",
    },
    STAGE: {
        bg: "#fdf3e3",
        text: "#8a6212",
        bar: "#c8951e",
        shadow: "rgba(200, 149, 30, 0.28)",
        gradient: "linear-gradient(135deg, #a1740f 0%, #dba63a 100%)",
    },
    FREELANCE: {
        bg: "#f3eafb",
        text: "#6b3fa0",
        bar: "#8a5cc7",
        shadow: "rgba(138, 92, 199, 0.26)",
        gradient: "linear-gradient(135deg, #6b3fa0 0%, #9b6fd6 100%)",
    },
    INTERIM: {
        bg: "#fdece3",
        text: "#a1481e",
        bar: "#e0692f",
        shadow: "rgba(224, 105, 47, 0.26)",
        gradient: "linear-gradient(135deg, #a1481e 0%, #e37f45 100%)",
    },
    ALTERNANCE: {
        bg: "#e3f6f5",
        text: "#1b7f7a",
        bar: "#2fb0a8",
        shadow: "rgba(47, 176, 168, 0.26)",
        gradient: "linear-gradient(135deg, #1b7f7a 0%, #3fc9c0 100%)",
    },
    SERVICE_CIVIQUE: {
        bg: "#eaf6ec",
        text: "#2c7a3f",
        bar: "#4caf6a",
        shadow: "rgba(76, 175, 106, 0.26)",
        gradient: "linear-gradient(135deg, #2c7a3f 0%, #5cc07c 100%)",
    },
    TEMPS_PARTIEL: {
        bg: "#eef0f4",
        text: "#4a5568",
        bar: "#8a97ab",
        shadow: "rgba(138, 151, 171, 0.26)",
        gradient: "linear-gradient(135deg, #4a5568 0%, #8a97ab 100%)",
    },
};

export function getCouleurContrat(type: TypeContrat): ContratColor {
    return COULEURS[type] ?? COULEURS.CDI;
}