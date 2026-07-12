import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    obtenirQuestionsPourPassage,
    obtenirDetailQuiz,
    passerQuiz,
    type QuestionQCMDTO,
    type QuizDTO,
    type ResultatQuizDTO,
} from "../../api/formationPublicService";
import "../public/offres.css";
import "./formationQuiz.css";

export function FormationQuizPage() {
    const { formationId, quizId } = useParams<{ formationId: string; quizId: string }>();
    const formationIdNum = Number(formationId);
    const quizIdNum = Number(quizId);

    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [questions, setQuestions] = useState<QuestionQCMDTO[]>([]);
    const [reponsesChoisies, setReponsesChoisies] = useState<Record<number, number[]>>({});
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const [envoiEnCours, setEnvoiEnCours] = useState(false);
    const [resultat, setResultat] = useState<ResultatQuizDTO | null>(null);

    useEffect(() => {
        charger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizId]);

    async function charger() {
        setLoading(true);
        setErreur(null);
        try {
            const [quizData, questionsData] = await Promise.all([
                obtenirDetailQuiz(formationIdNum, quizIdNum),
                obtenirQuestionsPourPassage(quizIdNum),
            ]);
            setQuiz(quizData);
            setQuestions(questionsData);
            setReponsesChoisies({});
            setResultat(null);
        } catch (err) {
            const messageKey = (err as any)?.response?.data?.message as string | undefined;
            if (messageKey === "error.nonInscrit") {
                setErreur("Vous devez être inscrit à la formation pour passer ce quiz.");
            } else if (messageKey === "error.tentativesEpuisees") {
                setErreur("Vous avez atteint le nombre maximum de tentatives pour ce quiz.");
            } else {
                setErreur("Impossible de charger ce quiz.");
            }
        } finally {
            setLoading(false);
        }
    }

    function toggleReponse(question: QuestionQCMDTO, reponseId: number) {
        setReponsesChoisies((prev) => {
            const actuelles = prev[question.id] ?? [];
            if (question.typeQuestion === "REPONSE_UNIQUE") {
                return { ...prev, [question.id]: [reponseId] };
            }
            const dejaChoisie = actuelles.includes(reponseId);
            return {
                ...prev,
                [question.id]: dejaChoisie ? actuelles.filter((id) => id !== reponseId) : [...actuelles, reponseId],
            };
        });
    }

    const nombreQuestionsRepondues = questions.filter((q) => (reponsesChoisies[q.id]?.length ?? 0) > 0).length;
    const toutesRepondues = questions.length > 0 && nombreQuestionsRepondues === questions.length;

    async function handleSoumettre() {
        if (!toutesRepondues) return;
        setEnvoiEnCours(true);
        setErreur(null);
        try {
            const reponse = await passerQuiz(quizIdNum, {
                reponses: questions.map((q) => ({ questionId: q.id, reponseIds: reponsesChoisies[q.id] ?? [] })),
            });
            setResultat(reponse);
        } catch (err) {
            const messageKey = (err as any)?.response?.data?.message as string | undefined;
            if (messageKey === "error.tentativesEpuisees") {
                setErreur("Vous avez atteint le nombre maximum de tentatives pour ce quiz.");
            } else {
                setErreur("Impossible d'envoyer vos réponses pour le moment.");
            }
        } finally {
            setEnvoiEnCours(false);
        }
    }

    function handleRecommencer() {
        setReponsesChoisies({});
        setResultat(null);
    }

    if (loading) {
        return <div className="offres-page__loading">Chargement du quiz...</div>;
    }

    if (erreur && !resultat && questions.length === 0) {
        return (
            <div className="offres-page">
                <div className="offre-message--error">{erreur}</div>
                <Link to={`/candidat/formation/${formationIdNum}`} className="btn-secondary" style={{ marginTop: 16, display: "inline-flex" }}>
                    ← Retour à la formation
                </Link>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            <div className="quiz-page__header">
                <Link to={`/candidat/formation/${formationIdNum}`} className="quiz-page__retour">
                    ← Retour à la formation
                </Link>
                <h1 className="quiz-page__titre">{quiz?.titre ?? "Quiz"}</h1>
                {quiz && <p className="quiz-page__sous-titre">Note minimale pour valider : {quiz.noteMinimale}%</p>}
            </div>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            {!resultat ? (
                <>
                    <div className="quiz-progression">
                        <span>
                            {nombreQuestionsRepondues} / {questions.length} question(s) répondue(s)
                        </span>
                        <div className="lecteur-progress-bar">
                            <div
                                className="lecteur-progress-bar__remplissage"
                                style={{ width: `${questions.length ? (nombreQuestionsRepondues / questions.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    {questions.map((question, index) => (
                        <div className="quiz-question-card" key={question.id}>
                            <div className="quiz-question-card__header">
                                <span className="quiz-question-card__numero">Question {index + 1}</span>
                                <span className="quiz-question-card__type">
                                    {question.typeQuestion === "REPONSE_UNIQUE" ? "Une seule réponse" : "Plusieurs réponses possibles"}
                                </span>
                                <span className="quiz-question-card__points">{question.points} pts</span>
                            </div>
                            <p className="quiz-question-card__texte">{question.question}</p>

                            <div className="quiz-question-card__reponses">
                                {question.reponsesPubliques.map((reponse) => {
                                    const choisie = (reponsesChoisies[question.id] ?? []).includes(reponse.id);
                                    return (
                                        <label key={reponse.id} className={`quiz-reponse-option ${choisie ? "quiz-reponse-option--choisie" : ""}`}>
                                            <input
                                                type={question.typeQuestion === "REPONSE_UNIQUE" ? "radio" : "checkbox"}
                                                name={`question-${question.id}`}
                                                checked={choisie}
                                                onChange={() => toggleReponse(question, reponse.id)}
                                            />
                                            <span>{reponse.texte}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="quiz-actions">
                        <button className="btn-gold" onClick={handleSoumettre} disabled={!toutesRepondues || envoiEnCours}>
                            {envoiEnCours ? "Envoi..." : "Valider mes réponses"}
                        </button>
                        {!toutesRepondues && <p className="wizard-hint">Réponds à toutes les questions pour valider.</p>}
                    </div>
                </>
            ) : (
                <ResultatQuizAffichage
                    resultat={resultat}
                    formationId={formationIdNum}
                    peutRecommencer={quiz?.nombreTentativesMax == null || quiz.nombreTentativesMax > 1}
                    onRecommencer={handleRecommencer}
                />
            )}
        </div>
    );
}

function ResultatQuizAffichage({
                                   resultat,
                                   formationId,
                                   peutRecommencer,
                                   onRecommencer,
                               }: {
    resultat: ResultatQuizDTO;
    formationId: number;
    peutRecommencer: boolean;
    onRecommencer: () => void;
}) {
    return (
        <div className="quiz-resultat">
            <div className={`quiz-resultat__banniere ${resultat.valide ? "quiz-resultat__banniere--succes" : "quiz-resultat__banniere--echec"}`}>
                <span className="quiz-resultat__note">{resultat.notePourcent}%</span>
                <span className="quiz-resultat__statut">{resultat.valide ? "Quiz validé 🎉" : "Quiz non validé"}</span>
                {resultat.mention && <span className="quiz-resultat__mention">Mention : {resultat.mention}</span>}
                <span className="quiz-resultat__score">
                    {resultat.score} / {resultat.scoreMax} points
                </span>
            </div>

            {resultat.certificationObtenue && (
                <div className="candidature-form__success" style={{ marginBottom: 20 }}>
                    🏆 Félicitations, vous avez obtenu votre certification
                    {resultat.numeroCertification ? ` (N° ${resultat.numeroCertification})` : ""} !{" "}
                    <Link to="/candidat/formation" className="offre-detail__cta-info">
                        Voir mes certifications →
                    </Link>
                </div>
            )}

            <p className="quiz-resultat__corrections-titre">Correction détaillée</p>

            {resultat.corrections.map((correction, index) => {
                const estCorrecteTotalement = correction.pointsObtenus === correction.pointsMax;
                return (
                    <div className="quiz-correction-card" key={correction.questionId}>
                        <div className="quiz-correction-card__header">
                            <span className="quiz-question-card__numero">Question {index + 1}</span>
                            <span className={`quiz-correction-card__points ${estCorrecteTotalement ? "quiz-correction-card__points--ok" : ""}`}>
                                {correction.pointsObtenus} / {correction.pointsMax} pts
                            </span>
                        </div>
                        <p className="quiz-question-card__texte">{correction.question}</p>
                        <p className="quiz-correction-card__detail">
                            {correction.reponseIdsCochees.length === 0
                                ? "Aucune réponse cochée."
                                : `${correction.reponseIdsCochees.length} réponse(s) cochée(s), ${correction.reponseIdsCorrectes.length} attendue(s).`}
                        </p>
                        {correction.explication && <p className="quiz-correction-card__explication">💡 {correction.explication}</p>}
                    </div>
                );
            })}

            <div className="quiz-actions">
                {!resultat.valide && peutRecommencer && (
                    <button className="btn-secondary" onClick={onRecommencer}>
                        Repasser le quiz
                    </button>
                )}
                <Link to={`/candidat/formation/${formationId}`} className="btn-gold">
                    Retour à la formation
                </Link>
            </div>
        </div>
    );
}