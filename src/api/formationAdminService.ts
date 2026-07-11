import { httpClient } from "./httpClient";

// ---------------------------------------------------------------------------
// Types communs
// ---------------------------------------------------------------------------

export type CategorieFormation =
    | "DEVELOPPEMENT_WEB"
    | "INTELLIGENCE_ARTIFICIELLE"
    | "MARKETING_DIGITAL"
    | "COMPTABILITE"
    | "BUREAUTIQUE"
    | "GESTION_PROJET"
    | "LANGUES"
    | "AUTRE";

export type NiveauFormation = "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";

export type TypeQuestion = "REPONSE_UNIQUE" | "REPONSE_MULTIPLE";

export const LABELS_CATEGORIE: Record<CategorieFormation, string> = {
    DEVELOPPEMENT_WEB: "Développement Web",
    INTELLIGENCE_ARTIFICIELLE: "Intelligence Artificielle",
    MARKETING_DIGITAL: "Marketing Digital",
    COMPTABILITE: "Comptabilité",
    BUREAUTIQUE: "Bureautique",
    GESTION_PROJET: "Gestion de Projet",
    LANGUES: "Langues",
    AUTRE: "Autre",
};

export const LABELS_NIVEAU_FORMATION: Record<NiveauFormation, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
};

// ---------------------------------------------------------------------------
// Formation
// ---------------------------------------------------------------------------

export interface FormationDTO {
    id: number;
    titre: string;
    description: string | null;
    categorie: CategorieFormation;
    niveau: NiveauFormation;
    langue: string | null;
    dureeMinutes: number | null;
    formateur: string | null;
    imagePresente: boolean;
    videoPresentationUrl: string | null;
    gratuite: boolean;
    prix: number | null;
    noteMinimale: number | null;
    certificatActif: boolean;
    visible: boolean;
    nombreMaxInscrits: number | null;
    dateDebut: string | null;
    dateFin: string | null;
    prerequis: string[] | null;
    competencesAcquises: string[] | null;
    dateCreation: string;
    dateModification: string | null;
    nombreChapitres: number;
    nombreInscrits: number;
}

export interface CreerFormationPayload {
    titre: string;
    description?: string;
    categorie: CategorieFormation;
    niveau: NiveauFormation;
    langue?: string;
    dureeMinutes?: number;
    formateur?: string;
    videoPresentationUrl?: string;
    gratuite: boolean;
    prix?: number;
    noteMinimale?: number;
    certificatActif: boolean;
    visible: boolean;
    nombreMaxInscrits?: number;
    dateDebut?: string;
    dateFin?: string;
    prerequis?: string[];
    competencesAcquises?: string[];
}

export async function creerFormation(payload: CreerFormationPayload): Promise<FormationDTO> {
    const response = await httpClient.post<FormationDTO>("/admin/formations", payload);
    return response.data;
}

export async function modifierFormation(id: number, payload: CreerFormationPayload): Promise<FormationDTO> {
    const response = await httpClient.put<FormationDTO>(`/admin/formations/${id}`, payload);
    return response.data;
}

export async function supprimerFormation(id: number): Promise<void> {
    await httpClient.delete(`/admin/formations/${id}`);
}

export async function obtenirFormation(id: number): Promise<FormationDTO> {
    const response = await httpClient.get<FormationDTO>(`/admin/formations/${id}`);
    return response.data;
}

export async function listerFormationsAdmin(): Promise<FormationDTO[]> {
    const response = await httpClient.get<FormationDTO[]>("/admin/formations");
    return response.data;
}

export async function uploaderImageFormation(id: number, file: File): Promise<FormationDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<FormationDTO>(`/admin/formations/${id}/image`, formData);
    return response.data;
}

export function obtenirImageFormationUrl(id: number): string {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
    return `${apiBaseUrl}/admin/formations/${id}/image`;
}

// ---------------------------------------------------------------------------
// Chapitre
// ---------------------------------------------------------------------------

export interface ChapitreDTO {
    id: number;
    formationId: number;
    ordre: number;
    titre: string;
    description: string | null;
    nombreLecons: number;
}

export interface CreerChapitrePayload {
    ordre: number;
    titre: string;
    description?: string;
}

export async function creerChapitre(formationId: number, payload: CreerChapitrePayload): Promise<ChapitreDTO> {
    const response = await httpClient.post<ChapitreDTO>(`/admin/formations/${formationId}/chapitres`, payload);
    return response.data;
}

export async function modifierChapitre(id: number, payload: CreerChapitrePayload): Promise<ChapitreDTO> {
    const response = await httpClient.put<ChapitreDTO>(`/admin/chapitres/${id}`, payload);
    return response.data;
}

export async function supprimerChapitre(id: number): Promise<void> {
    await httpClient.delete(`/admin/chapitres/${id}`);
}

export async function listerChapitres(formationId: number): Promise<ChapitreDTO[]> {
    const response = await httpClient.get<ChapitreDTO[]>(`/admin/formations/${formationId}/chapitres`);
    return response.data;
}

// ---------------------------------------------------------------------------
// Leçon
// ---------------------------------------------------------------------------

export interface LeconDTO {
    id: number;
    chapitreId: number;
    ordre: number;
    titre: string;
    videoUrl: string | null;
    documentPdfPresent: boolean;
    dureeMinutes: number | null;
}

export interface CreerLeconPayload {
    ordre: number;
    titre: string;
    videoUrl?: string;
    dureeMinutes?: number;
}

export async function creerLecon(chapitreId: number, payload: CreerLeconPayload): Promise<LeconDTO> {
    const response = await httpClient.post<LeconDTO>(`/admin/chapitres/${chapitreId}/lecons`, payload);
    return response.data;
}

export async function modifierLecon(id: number, payload: CreerLeconPayload): Promise<LeconDTO> {
    const response = await httpClient.put<LeconDTO>(`/admin/lecons/${id}`, payload);
    return response.data;
}

export async function supprimerLecon(id: number): Promise<void> {
    await httpClient.delete(`/admin/lecons/${id}`);
}

export async function listerLecons(chapitreId: number): Promise<LeconDTO[]> {
    const response = await httpClient.get<LeconDTO[]>(`/admin/chapitres/${chapitreId}/lecons`);
    return response.data;
}

export async function uploaderDocumentLecon(id: number, file: File): Promise<LeconDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post<LeconDTO>(`/admin/lecons/${id}/document`, formData);
    return response.data;
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export interface QuizDTO {
    id: number;
    formationId: number;
    chapitreId: number | null;
    titre: string;
    noteMinimale: number;
    nombreTentativesMax: number | null;
    nombreQuestions: number;
    pointsTotal: number;
}

export interface CreerQuizPayload {
    chapitreId?: number | null;
    titre: string;
    noteMinimale: number;
    nombreTentativesMax?: number;
}

export async function creerQuiz(formationId: number, payload: CreerQuizPayload): Promise<QuizDTO> {
    const response = await httpClient.post<QuizDTO>(`/admin/formations/${formationId}/quiz`, payload);
    return response.data;
}

export async function supprimerQuiz(id: number): Promise<void> {
    await httpClient.delete(`/admin/quiz/${id}`);
}

export async function listerQuiz(formationId: number): Promise<QuizDTO[]> {
    const response = await httpClient.get<QuizDTO[]>(`/admin/formations/${formationId}/quiz`);
    return response.data;
}

// ---------------------------------------------------------------------------
// Question QCM (vue admin — inclut estBonneReponse)
// ---------------------------------------------------------------------------

export interface ReponseQCMDTO {
    id: number;
    ordre: number;
    texte: string;
    estBonneReponse: boolean;
}

export interface CreerReponseQCMPayload {
    ordre: number;
    texte: string;
    estBonneReponse: boolean;
}

export interface QuestionQCMDTO {
    id: number;
    quizId: number;
    ordre: number;
    typeQuestion: TypeQuestion;
    question: string;
    points: number;
    explication: string | null;
    reponses: ReponseQCMDTO[];
}

export interface CreerQuestionQCMPayload {
    ordre: number;
    typeQuestion: TypeQuestion;
    question: string;
    points: number;
    explication?: string;
    reponses: CreerReponseQCMPayload[];
}

export async function creerQuestion(quizId: number, payload: CreerQuestionQCMPayload): Promise<QuestionQCMDTO> {
    const response = await httpClient.post<QuestionQCMDTO>(`/admin/quiz/${quizId}/questions`, payload);
    return response.data;
}

export async function modifierQuestion(id: number, payload: CreerQuestionQCMPayload): Promise<QuestionQCMDTO> {
    const response = await httpClient.put<QuestionQCMDTO>(`/admin/questions/${id}`, payload);
    return response.data;
}

export async function supprimerQuestion(id: number): Promise<void> {
    await httpClient.delete(`/admin/questions/${id}`);
}

export async function listerQuestions(quizId: number): Promise<QuestionQCMDTO[]> {
    const response = await httpClient.get<QuestionQCMDTO[]>(`/admin/quiz/${quizId}/questions`);
    return response.data;
}