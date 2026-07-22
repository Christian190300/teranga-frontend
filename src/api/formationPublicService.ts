import { httpClient } from "./httpClient";
import {
    LABELS_CATEGORIE,
    LABELS_NIVEAU_FORMATION,
    type CategorieFormation,
    type NiveauFormation,
    type TypeQuestion,
    type LeconDTO,
    type QuizDTO,
} from "./formationAdminService";

export { LABELS_CATEGORIE, LABELS_NIVEAU_FORMATION };
export type { CategorieFormation, NiveauFormation, TypeQuestion, LeconDTO, QuizDTO };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

export interface FormationPublicDTO {
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
    prerequis: string[] | null;
    competencesAcquises: string[] | null;
    nombreChapitres: number;
    nombreInscrits: number;
    dejaInscrit: boolean | null;
}

export async function listerFormationsPubliques(): Promise<FormationPublicDTO[]> {
    const response = await httpClient.get<FormationPublicDTO[]>("/formations");
    return response.data;
}

export async function obtenirFormationPublique(id: number): Promise<FormationPublicDTO> {
    const response = await httpClient.get<FormationPublicDTO>(`/formations/${id}`);
    return response.data;
}

export function obtenirImageFormationPublicUrl(id: number): string {
    return `${API_BASE_URL}/formations/${id}/image`;
}

// ---------------------------------------------------------------------------
// Inscription & progression
// ---------------------------------------------------------------------------

export type StatutInscription = "EN_COURS" | "TERMINEE" | "ABANDONNEE";

export interface InscriptionFormationDTO {
    id: number;
    formationId: number;
    formationTitre: string;
    statut: StatutInscription;
    progressionPourcent: number;
    chapitreActuelId: number | null;
    tempsPasseMinutes: number;
    dateInscription: string;
    dateDerniereConnexion: string | null;
    dateFin: string | null;
    certificationObtenue: boolean;
}

export async function sInscrire(formationId: number): Promise<void> {
    await httpClient.post(`/formations/${formationId}/inscription`);
}

export async function mesInscriptions(): Promise<InscriptionFormationDTO[]> {
    const response = await httpClient.get<InscriptionFormationDTO[]>("/formations/inscriptions/mine");
    return response.data;
}

export async function mettreAJourProgression(
    formationId: number,
    params: { chapitreActuelId?: number; progressionPourcent?: number; minutesAjoutees?: number }
): Promise<InscriptionFormationDTO> {
    const query = new URLSearchParams();
    if (params.chapitreActuelId != null) query.set("chapitreActuelId", String(params.chapitreActuelId));
    if (params.progressionPourcent != null) query.set("progressionPourcent", String(params.progressionPourcent));
    if (params.minutesAjoutees != null) query.set("minutesAjoutees", String(params.minutesAjoutees));

    const response = await httpClient.put<InscriptionFormationDTO>(`/formations/${formationId}/progression?${query.toString()}`);
    return response.data;
}

// ---------------------------------------------------------------------------
// Contenu (chapitres / leçons / quiz) — réservé aux inscrits
// ---------------------------------------------------------------------------

export interface ContenuChapitreDTO {
    id: number;
    ordre: number;
    titre: string;
    description: string | null;
    lecons: LeconDTO[];
    quiz: QuizDTO[];
}

export async function obtenirContenuFormation(formationId: number): Promise<ContenuChapitreDTO[]> {
    const response = await httpClient.get<ContenuChapitreDTO[]>(`/formations/${formationId}/contenu`);
    return response.data;
}

export async function obtenirQuizFinalFormation(formationId: number): Promise<QuizDTO[]> {
    const response = await httpClient.get<QuizDTO[]>(`/formations/${formationId}/quiz-final`);
    return response.data;
}

/** Le PDF est protégé par auth — on le récupère en blob plutôt que via une simple URL <a href>. */
export async function telechargerDocumentLecon(leconId: number, nomFichier = "document.pdf"): Promise<void> {
    const response = await httpClient.get(`/formations/lecons/${leconId}/document`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichier;
    lien.click();
    URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Passage de quiz
// ---------------------------------------------------------------------------

/** Une proposition de réponse SANS le champ estBonneReponse (le candidat ne doit pas le voir avant de répondre). */
export interface ReponseQCMPublicDTO {
    id: number;
    ordre: number;
    texte: string;
}

export interface QuestionQCMDTO {
    id: number;
    quizId: number;
    ordre: number;
    typeQuestion: TypeQuestion;
    question: string;
    points: number;
    reponsesPubliques: ReponseQCMPublicDTO[];
}

export interface ReponseSoumisePayload {
    questionId: number;
    reponseIds: number[];
}

export interface PasserQuizPayload {
    reponses: ReponseSoumisePayload[];
}

export interface CorrectionQuestionDTO {
    questionId: number;
    question: string;
    reponseIdsCorrectes: number[];
    reponseIdsCochees: number[];
    pointsObtenus: number;
    pointsMax: number;
    explication: string | null;
}

export interface ResultatQuizDTO {
    quizId: number;
    score: number;
    scoreMax: number;
    notePourcent: number;
    valide: boolean;
    mention: string | null;
    certificationObtenue: boolean;
    numeroCertification: string | null;
    corrections: CorrectionQuestionDTO[];
}

export async function obtenirQuestionsPourPassage(quizId: number): Promise<QuestionQCMDTO[]> {
    const response = await httpClient.get<QuestionQCMDTO[]>(`/formations/quiz/${quizId}/questions`);
    return response.data;
}

export async function passerQuiz(quizId: number, payload: PasserQuizPayload): Promise<ResultatQuizDTO> {
    const response = await httpClient.post<ResultatQuizDTO>(`/quiz/${quizId}/passer`, payload);
    return response.data;
}

/** Le quiz peut être final ou rattaché à un chapitre — on cherche dans les deux listes. */
export async function obtenirDetailQuiz(formationId: number, quizId: number): Promise<QuizDTO | null> {
    const [chapitres, final] = await Promise.all([obtenirContenuFormation(formationId), obtenirQuizFinalFormation(formationId)]);
    const quizDeChapitre = chapitres.flatMap((c) => c.quiz).find((q) => q.id === quizId);
    return quizDeChapitre ?? final.find((q) => q.id === quizId) ?? null;
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export interface CertificationDTO {
    id: number;
    formationId: number;
    formationTitre: string;
    candidatNomComplet: string;
    numero: string;
    notePourcent: number;
    mention: string | null;
    dateObtention: string;
    pdfPresent: boolean;
    qrCodeData: string | null;
}

export async function mesCertifications(): Promise<CertificationDTO[]> {
    const response = await httpClient.get<CertificationDTO[]>("/certifications/mine");
    return response.data;
}

export async function telechargerCertificatPdf(certificationId: number, nomFichier = "certificat.pdf"): Promise<void> {
    const response = await httpClient.get(`/certifications/${certificationId}/pdf`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichier;
    lien.click();
    URL.revokeObjectURL(url);
}

/**
 * Retourne une URL temporaire pour afficher un PDF dans le navigateur.
 */
export async function obtenirDocumentLeconUrl(leconId: number): Promise<string> {
    const response = await httpClient.get(
        `/formations/lecons/${leconId}/document`,
        { responseType: "blob" }
    );

    const blob = new Blob([response.data], {
        type: "application/pdf",
    });

    return URL.createObjectURL(blob);
}

export async function afficherDocumentLecon(leconId: number): Promise<string> {
    const response = await httpClient.get(
        `/formations/lecons/${leconId}/document`,
        {
            responseType: "blob",
        }
    );

    const blob = new Blob([response.data], {
        type: "application/pdf",
    });

    return URL.createObjectURL(blob);
}