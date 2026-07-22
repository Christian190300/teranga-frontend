export const DISPONIBILITES = [
    "Immédiate",
    "Sous 15 jours",
    "Sous 1 mois",
    "Sous 3 mois",
    "À définir",
] as const;

export type Disponibilite = typeof DISPONIBILITES[number];