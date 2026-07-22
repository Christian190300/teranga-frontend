export const LANGUES = [
    "Français",
    "Anglais",
    "Wolof",
    "Pulaar",
    "Sérère",
    "Diola",
    "Arabe",
    "Espagnol",
    "Allemand",
    "Portugais",
] as const;

export type Langue = typeof LANGUES[number];