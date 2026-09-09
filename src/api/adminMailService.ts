import { httpClient } from "./httpClient";

export interface ResultatEnvoiAnnonceDTO {
    joursInactivite: number;
    mailsEnvoyes: number;
}

export async function envoyerAnnonceLancement(joursInactivite: number): Promise<ResultatEnvoiAnnonceDTO> {
    const response = await httpClient.post<ResultatEnvoiAnnonceDTO>(
        `/api/admin/mails/annonce-lancement?joursInactivite=${joursInactivite}`
    );
    return response.data;
}