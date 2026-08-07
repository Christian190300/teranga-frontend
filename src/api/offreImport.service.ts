import { httpClient } from "./httpClient";

export interface ImportResultDTO {
    message: string;
}

/** POST /api/import/senjob — admin uniquement, déclenche le scraping + import. */
export async function importerOffresSenjob(): Promise<string> {
    const response = await httpClient.post<string>("/import/senjob");
    return response.data;
}

/** POST /api/import/emploidakar — admin uniquement, déclenche le scraping + import. */
export async function importerOffresEmploiDakar(): Promise<string> {
    const response = await httpClient.post<string>("/import/emploidakar");
    return response.data;
}