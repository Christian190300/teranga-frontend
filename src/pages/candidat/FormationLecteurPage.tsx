import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    obtenirContenuFormation,
    obtenirQuizFinalFormation,
    mesInscriptions,
    mettreAJourProgression,
    afficherDocumentLecon,
    type ContenuChapitreDTO,
    type QuizDTO,
    type LeconDTO,
    type InscriptionFormationDTO,
} from "../../api/formationPublicService";
import "../public/offres.css";
import "./formationLecteur.css";

function formatDuree(minutes: number | null): string {
    if (!minutes) return "";
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60 > 0 ? (minutes % 60) + " min" : ""}`;
}

/** Transforme une URL YouTube/Vimeo classique en URL embarquable ; sinon la laisse telle quelle (balise <video>). */
function versUrlEmbarquable(url: string): { type: "iframe" | "video"; src: string } {
    const matchYoutube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (matchYoutube) {
        return { type: "iframe", src: `https://www.youtube.com/embed/${matchYoutube[1]}` };
    }
    const matchVimeo = url.match(/vimeo\.com\/(\d+)/);
    if (matchVimeo) {
        return { type: "iframe", src: `https://player.vimeo.com/video/${matchVimeo[1]}` };
    }
    return { type: "video", src: url };
}

export function FormationLecteurPage() {
    const { formationId } = useParams<{ formationId: string }>();
    const idNumerique = Number(formationId);

    const [chapitres, setChapitres] = useState<ContenuChapitreDTO[]>([]);
    const [quizFinal, setQuizFinal] = useState<QuizDTO[]>([]);
    const [inscription, setInscription] = useState<InscriptionFormationDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const [chapitreOuvertId, setChapitreOuvertId] = useState<number | null>(null);
    const [leconActive, setLeconActive] = useState<{ chapitreId: number; lecon: LeconDTO } | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        charger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formationId]);

    async function charger() {
        setLoading(true);
        setErreur(null);
        try {
            const [contenuData, quizData, inscriptionsData] = await Promise.all([
                obtenirContenuFormation(idNumerique),
                obtenirQuizFinalFormation(idNumerique),
                mesInscriptions(),
            ]);
            setChapitres(contenuData);
            setQuizFinal(quizData);

            const monInscription = inscriptionsData.find((i) => i.formationId === idNumerique) ?? null;
            setInscription(monInscription);

            // Ouvre le chapitre où le candidat s'était arrêté, ou le premier par défaut
            const premierChapitreId = contenuData[0]?.id ?? null;
            const chapitreAOuvrir = monInscription?.chapitreActuelId ?? premierChapitreId;
            setChapitreOuvertId(chapitreAOuvrir);

            // Sélectionne la première leçon de ce chapitre par défaut
            const chapitre = contenuData.find((c) => c.id === chapitreAOuvrir);
            if (chapitre && chapitre.lecons.length > 0) {
                setLeconActive({ chapitreId: chapitre.id, lecon: chapitre.lecons[0] });
            }
        } catch (err) {
            const messageKey = (err as any)?.response?.data?.message as string | undefined;
            if (messageKey === "error.nonInscrit") {
                setErreur("Vous devez être inscrit à cette formation pour accéder à son contenu.");
            } else {
                setErreur("Impossible de charger cette formation.");
            }
        } finally {
            setLoading(false);
        }
    }

    const indexChapitreActuel = useMemo(
        () => chapitres.findIndex((c) => c.id === (leconActive?.chapitreId ?? chapitreOuvertId)),
        [chapitres, leconActive, chapitreOuvertId]
    );

    async function handleSelectionnerLecon(chapitreId: number, lecon: LeconDTO) {
        setLeconActive({ chapitreId, lecon });
        setPdfUrl(null);

        if (lecon.documentPdfPresent) {
            try {
                const url = await afficherDocumentLecon(lecon.id);
                setPdfUrl(url);
            } catch {
                setErreur("Impossible de charger le document PDF.");
            }
        }
        setChapitreOuvertId(chapitreId);

        const index = chapitres.findIndex((c) => c.id === chapitreId);
        const progression = chapitres.length > 0 ? Math.round(((index + 1) / chapitres.length) * 100) : 0;

        try {
            const misAJour = await mettreAJourProgression(idNumerique, {
                chapitreActuelId: chapitreId,
                progressionPourcent: Math.max(inscription?.progressionPourcent ?? 0, progression),
                minutesAjoutees: 1,
            });
            setInscription(misAJour);
        } catch {
            // Non bloquant pour la navigation si la mise à jour échoue
        }
    }

    if (loading) {
        return <div className="offres-page__loading">Chargement de la formation...</div>;
    }

    if (erreur && chapitres.length === 0) {
        return (
            <div className="offres-page">
                <div className="offre-message--error">{erreur}</div>
                <Link to="/formations" className="btn-secondary" style={{ marginTop: 16, display: "inline-flex" }}>
                    ← Retour au catalogue
                </Link>
            </div>
        );
    }

    const embarquable = leconActive?.lecon.videoUrl ? versUrlEmbarquable(leconActive.lecon.videoUrl) : null;

    return (
        <div className="lecteur-formation">
            <aside className="lecteur-sidebar">
                <Link to="/candidat/formation" className="lecteur-sidebar__retour">
                    ← Mes formations
                </Link>

                <div className="lecteur-sidebar__progression">
                    <div className="lecteur-sidebar__progression-header">
                        <span>Progression</span>
                        <span>{inscription?.progressionPourcent ?? 0}%</span>
                    </div>
                    <div className="lecteur-progress-bar">
                        <div className="lecteur-progress-bar__remplissage" style={{ width: `${inscription?.progressionPourcent ?? 0}%` }} />
                    </div>
                    {inscription?.certificationObtenue && <span className="lecteur-sidebar__certifie">🏆 Certification obtenue</span>}
                </div>

                <nav className="lecteur-chapitres">
                    {chapitres.map((chapitre, index) => (
                        <div className="lecteur-chapitre" key={chapitre.id}>
                            <button
                                className={`lecteur-chapitre__header ${chapitreOuvertId === chapitre.id ? "lecteur-chapitre__header--ouvert" : ""}`}
                                onClick={() => setChapitreOuvertId(chapitreOuvertId === chapitre.id ? null : chapitre.id)}
                            >
                                <span className="lecteur-chapitre__numero">{index + 1}</span>
                                <span className="lecteur-chapitre__titre">{chapitre.titre}</span>
                                <span className="lecteur-chapitre__chevron">{chapitreOuvertId === chapitre.id ? "▲" : "▼"}</span>
                            </button>

                            {chapitreOuvertId === chapitre.id && (
                                <div className="lecteur-lecons">
                                    {chapitre.lecons.map((lecon) => (
                                        <button
                                            key={lecon.id}
                                            className={`lecteur-lecon ${leconActive?.lecon.id === lecon.id ? "lecteur-lecon--active" : ""}`}
                                            onClick={() => handleSelectionnerLecon(chapitre.id, lecon)}
                                        >
                                            <span className="lecteur-lecon__icone">{lecon.videoUrl ? "▶" : "📄"}</span>
                                            <span className="lecteur-lecon__titre">{lecon.titre}</span>
                                            {lecon.dureeMinutes && <span className="lecteur-lecon__duree">{formatDuree(lecon.dureeMinutes)}</span>}
                                        </button>
                                    ))}

                                    {chapitre.quiz.map((quiz) => (
                                        <Link key={quiz.id} to={`/candidat/formation/${idNumerique}/quiz/${quiz.id}`} className="lecteur-quiz-lien">
                                            <span className="lecteur-lecon__icone">📝</span>
                                            <span className="lecteur-lecon__titre">{quiz.titre}</span>
                                            <span className="lecteur-lecon__duree">{quiz.nombreQuestions} question(s)</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {quizFinal.length > 0 && (
                        <div className="lecteur-quiz-final">
                            <p className="lecteur-quiz-final__titre">Évaluation finale</p>
                            {quizFinal.map((quiz) => (
                                <Link key={quiz.id} to={`/candidat/formation/${idNumerique}/quiz/${quiz.id}`} className="lecteur-quiz-lien lecteur-quiz-lien--final">
                                    <span className="lecteur-lecon__icone">🏁</span>
                                    <span className="lecteur-lecon__titre">{quiz.titre}</span>
                                    <span className="lecteur-lecon__duree">Seuil {quiz.noteMinimale}%</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>
            </aside>

            <main className="lecteur-contenu">
                {erreur && <div className="offre-message--error">{erreur}</div>}

                {!leconActive ? (
                    <div className="offres-page__empty">Sélectionne une leçon dans le menu pour commencer.</div>
                ) : (
                    <>
                        <div className="lecteur-contenu__header">
                            <p className="lecteur-contenu__fil">
                                Chapitre {indexChapitreActuel + 1} / {chapitres.length}
                            </p>
                            <h1 className="lecteur-contenu__titre">{leconActive.lecon.titre}</h1>
                        </div>

                        {embarquable ? (
                            embarquable.type === "iframe" ? (
                                <div className="lecteur-video-wrapper">
                                    <iframe
                                        src={embarquable.src}
                                        title={leconActive.lecon.titre}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="lecteur-video-wrapper">
                                    <video src={embarquable.src} controls />
                                </div>
                            )
                        ) : (
                            <div className="lecteur-contenu__sans-video">Aucune vidéo pour cette leçon.</div>
                        )}

                        {pdfUrl && (
                            <div className="lecteur-pdf-wrapper">

                                <iframe
                                    src={pdfUrl}
                                    title="Support PDF"
                                />

                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}