import { httpClient } from "./httpClient";

export interface ResultatEnvoiAnnonceDTO {
    joursInactivite: number;
    mailsEnvoyes: number;
}

export interface ResultatEnvoiPersonnaliseDTO {
    mailsEnvoyes: number;
}

export async function envoyerAnnonceLancement(joursInactivite: number): Promise<ResultatEnvoiAnnonceDTO> {
    const response = await httpClient.post<ResultatEnvoiAnnonceDTO>(
        `/admin/mails/annonce-lancement?joursInactivite=${joursInactivite}`
    );
    return response.data;
}

export async function envoyerEmailPersonnaliseAuxCandidats(
    sujet: string,
    message: string
): Promise<ResultatEnvoiPersonnaliseDTO> {
    const response = await httpClient.post<ResultatEnvoiPersonnaliseDTO>(
        `/admin/mails/personnalise-candidats`,
        { sujet, message }
    );
    return response.data;
}