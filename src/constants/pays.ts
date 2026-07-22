export const PAYS = [
    "Sénégal",
    "Mali",
    "Côte d'Ivoire",
    "Guinée",
    "Mauritanie",
    "Gambie",
    "Burkina Faso",
    "Maroc",
    "France",
    "Canada",
    "Autre",
] as const;

export type Pays = typeof PAYS[number];