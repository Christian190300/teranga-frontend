export const REGIONS_SENEGAL = [
    "Dakar",
    "Diourbel",
    "Fatick",
    "Kaolack",
    "Kaffrine",
    "Kédougou",
    "Kolda",
    "Louga",
    "Matam",
    "Saint-Louis",
    "Sédhiou",
    "Tambacounda",
    "Thiès",
    "Ziguinchor",
] as const;

export type RegionSenegal = typeof REGIONS_SENEGAL[number];