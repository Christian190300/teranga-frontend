import type { TypeContrat } from "../../api/offreService";

interface ContratColor {
    bg: string;
    text: string;
    bar: string;
    /** Ombre teintée discrète (rgba) utilisée au survol des cartes */
    shadow: string;
    /** Dégradé très sobre pour le badge-logo (initiales) quand l'entreprise n'a pas de logo. */
    gradient: string;
}

/* Palette sobre, feutrée et professionnelle (tons ardoise, taupe, navy et gris) */
const COULEURS: Record<TypeContrat, ContratColor> = {
    CDI: {
        bg: "#f1f5f9",
        text: "#0f172a",
        bar: "#0b1d3a",
        shadow: "rgba(15, 23, 42, 0.08)",
        gradient: "linear-gradient(135deg, #0b1d3a 0%, #1e3a8a 100%)",
    },
    CDD: {
        bg: "#f8fafc",
        text: "#334155",
        bar: "#475569",
        shadow: "rgba(71, 85, 105, 0.08)",
        gradient: "linear-gradient(135deg, #334155 0%, #64748b 100%)",
    },
    STAGE: {
        bg: "#f7f7f8",
        text: "#475467",
        bar: "#667085",
        shadow: "rgba(102, 112, 133, 0.08)",
        gradient: "linear-gradient(135deg, #475467 0%, #858d9d 100%)",
    },
    FREELANCE: {
        bg: "#f1f5f9",
        text: "#1e293b",
        bar: "#334155",
        shadow: "rgba(30, 41, 59, 0.08)",
        gradient: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    },
    INTERIM: {
        bg: "#f8fafc",
        text: "#334155",
        bar: "#64748b",
        shadow: "rgba(100, 116, 139, 0.08)",
        gradient: "linear-gradient(135deg, #334155 0%, #94a3b8 100%)",
    },
    ALTERNANCE: {
        bg: "#f0f4f8",
        text: "#102a43",
        bar: "#243b53",
        shadow: "rgba(16, 42, 67, 0.08)",
        gradient: "linear-gradient(135deg, #102a43 0%, #334e68 100%)",
    },
    SERVICE_CIVIQUE: {
        bg: "#f3f4f6",
        text: "#374151",
        bar: "#4b5563",
        shadow: "rgba(75, 85, 99, 0.08)",
        gradient: "linear-gradient(135deg, #374151 0%, #6b7280 100%)",
    },
    TEMPS_PARTIEL: {
        bg: "#f1f5f9",
        text: "#475569",
        bar: "#94a3b8",
        shadow: "rgba(148, 163, 184, 0.08)",
        gradient: "linear-gradient(135deg, #475569 0%, #cbd5e1 100%)",
    },
};

export function getCouleurContrat(type: TypeContrat): ContratColor {
    return COULEURS[type] ?? COULEURS.CDI;
}