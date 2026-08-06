import { httpClient } from "./httpClient";
import type { ProfilCandidatDTO } from "./profileService";
import type { OffreDTO } from "./offreService";

export interface MatchCandidatDTO {
    profilCandidat: ProfilCandidatDTO;
    score: number;
}

export interface MatchOffreDTO {
    offre: OffreDTO;
    score: number;
}

/** Côté recruteur : candidats classés par compatibilité pour une offre donnée. */
export async function obtenirCandidatsPourOffre(offreId: number): Promise<MatchCandidatDTO[]> {
    const response = await httpClient.get<MatchCandidatDTO[]>(`/offres/${offreId}/candidats-matches`);
    return response.data;
}

/** Côté candidat : offres recommandées classées par compatibilité avec son profil. */
export async function obtenirOffresRecommandees(): Promise<MatchOffreDTO[]> {
    const response = await httpClient.get<MatchOffreDTO[]>("/candidat/offres-recommandees");
    return response.data;
}