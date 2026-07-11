import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    creerFormation,
    modifierFormation,
    obtenirFormation,
    uploaderImageFormation,
    creerChapitre,
    supprimerChapitre,
    listerChapitres,
    creerLecon,
    supprimerLecon,
    listerLecons,
    uploaderDocumentLecon,
    creerQuiz,
    supprimerQuiz,
    listerQuiz,
    creerQuestion,
    supprimerQuestion,
    listerQuestions,
    LABELS_CATEGORIE,
    LABELS_NIVEAU_FORMATION,
    type CategorieFormation,
    type NiveauFormation,
    type TypeQuestion,
    type ChapitreDTO,
    type LeconDTO,
    type QuizDTO,
    type QuestionQCMDTO,
    type CreerReponseQCMPayload,
} from "../../api/formationAdminService";
import "../public/offres.css";
import "./formationAdmin.css";

const ETAPES = ["Infos générales", "Chapitres & Leçons", "Quiz & Questions", "Paramètres"] as const;
type Etape = 0 | 1 | 2 | 3;

export function FormationWizardPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const enModification = !!id;

    const [etape, setEtape] = useState<Etape>(0);
    const [formationId, setFormationId] = useState<number | null>(id ? Number(id) : null);
    const [chargementInitial, setChargementInitial] = useState(enModification);
    const [erreur, setErreur] = useState<string | null>(null);

    // --- Étape 1 : infos générales ---
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [categorie, setCategorie] = useState<CategorieFormation>("DEVELOPPEMENT_WEB");
    const [niveau, setNiveau] = useState<NiveauFormation>("DEBUTANT");
    const [langue, setLangue] = useState("Français");
    const [dureeMinutes, setDureeMinutes] = useState("");
    const [formateur, setFormateur] = useState("");
    const [videoPresentationUrl, setVideoPresentationUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [enregistrementEtape1, setEnregistrementEtape1] = useState(false);

    // --- Étape 4 : paramètres ---
    const [gratuite, setGratuite] = useState(true);
    const [prix, setPrix] = useState("");
    const [noteMinimale, setNoteMinimale] = useState("70");
    const [certificatActif, setCertificatActif] = useState(true);
    const [visible, setVisible] = useState(false);
    const [nombreMaxInscrits, setNombreMaxInscrits] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [prerequis, setPrerequis] = useState("");
    const [competencesAcquises, setCompetencesAcquises] = useState("");
    const [enregistrementFinal, setEnregistrementFinal] = useState(false);

    useEffect(() => {
        if (enModification && id) {
            (async () => {
                try {
                    const f = await obtenirFormation(Number(id));
                    setTitre(f.titre);
                    setDescription(f.description ?? "");
                    setCategorie(f.categorie);
                    setNiveau(f.niveau);
                    setLangue(f.langue ?? "");
                    setDureeMinutes(f.dureeMinutes != null ? String(f.dureeMinutes) : "");
                    setFormateur(f.formateur ?? "");
                    setVideoPresentationUrl(f.videoPresentationUrl ?? "");
                    setGratuite(f.gratuite);
                    setPrix(f.prix != null ? String(f.prix) : "");
                    setNoteMinimale(f.noteMinimale != null ? String(f.noteMinimale) : "70");
                    setCertificatActif(f.certificatActif);
                    setVisible(f.visible);
                    setNombreMaxInscrits(f.nombreMaxInscrits != null ? String(f.nombreMaxInscrits) : "");
                    setDateDebut(f.dateDebut ? f.dateDebut.slice(0, 10) : "");
                    setDateFin(f.dateFin ? f.dateFin.slice(0, 10) : "");
                    setPrerequis((f.prerequis ?? []).join(", "));
                    setCompetencesAcquises((f.competencesAcquises ?? []).join(", "));
                } catch {
                    setErreur("Impossible de charger cette formation.");
                } finally {
                    setChargementInitial(false);
                }
            })();
        }
    }, [enModification, id]);

    function construirePayloadBase() {
        return {
            titre,
            description: description.trim() || undefined,
            categorie,
            niveau,
            langue: langue.trim() || undefined,
            dureeMinutes: dureeMinutes.trim() ? Number(dureeMinutes) : undefined,
            formateur: formateur.trim() || undefined,
            videoPresentationUrl: videoPresentationUrl.trim() || undefined,
            gratuite,
            prix: gratuite ? undefined : prix.trim() ? Number(prix) : undefined,
            noteMinimale: noteMinimale.trim() ? Number(noteMinimale) : undefined,
            certificatActif,
            visible,
            nombreMaxInscrits: nombreMaxInscrits.trim() ? Number(nombreMaxInscrits) : undefined,
            dateDebut: dateDebut ? new Date(dateDebut).toISOString() : undefined,
            dateFin: dateFin ? new Date(dateFin).toISOString() : undefined,
            prerequis: prerequis.trim() ? prerequis.split(",").map((p) => p.trim()).filter(Boolean) : undefined,
            competencesAcquises: competencesAcquises.trim()
                ? competencesAcquises.split(",").map((c) => c.trim()).filter(Boolean)
                : undefined,
        };
    }

    /** Étape 1 : crée la formation si elle n'existe pas encore, sinon la met à jour. Nécessaire pour avancer. */
    async function handleValiderEtape1() {
        if (!titre.trim()) {
            setErreur("Le titre est obligatoire.");
            return;
        }
        setErreur(null);
        setEnregistrementEtape1(true);
        try {
            let formation;
            if (formationId) {
                formation = await modifierFormation(formationId, construirePayloadBase());
            } else {
                formation = await creerFormation(construirePayloadBase());
                setFormationId(formation.id);
            }
            if (imageFile) {
                await uploaderImageFormation(formation.id, imageFile);
            }
            setEtape(1);
        } catch {
            setErreur("Impossible d'enregistrer les informations générales.");
        } finally {
            setEnregistrementEtape1(false);
        }
    }

    async function handleTerminer() {
        if (!formationId) return;
        setEnregistrementFinal(true);
        setErreur(null);
        try {
            await modifierFormation(formationId, construirePayloadBase());
            navigate("/admin/formations");
        } catch {
            setErreur("Impossible d'enregistrer les paramètres finaux.");
        } finally {
            setEnregistrementFinal(false);
        }
    }

    if (chargementInitial) {
        return <div className="offres-page__loading">Chargement...</div>;
    }

    return (
        <div className="offres-page formation-wizard">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">{enModification ? "Modifier la formation" : "Nouvelle formation"}</h1>
                    <p className="offres-page__subtitle">Créez une formation complète : contenu, quiz et paramètres.</p>
                </div>
            </div>

            <div className="wizard-steps">
                {ETAPES.map((nomEtape, index) => (
                    <div
                        key={nomEtape}
                        className={`wizard-steps__item ${index === etape ? "wizard-steps__item--actif" : ""} ${
                            index < etape ? "wizard-steps__item--fait" : ""
                        }`}
                        onClick={() => {
                            // On ne peut naviguer que vers une étape déjà atteignable (formation créée)
                            if (formationId || index === 0) setEtape(index as Etape);
                        }}
                    >
                        <span className="wizard-steps__numero">{index < etape ? "✓" : index + 1}</span>
                        <span className="wizard-steps__label">{nomEtape}</span>
                    </div>
                ))}
            </div>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            {etape === 0 && (
                <EtapeInfosGenerales
                    {...{
                        titre,
                        setTitre,
                        description,
                        setDescription,
                        categorie,
                        setCategorie,
                        niveau,
                        setNiveau,
                        langue,
                        setLangue,
                        dureeMinutes,
                        setDureeMinutes,
                        formateur,
                        setFormateur,
                        videoPresentationUrl,
                        setVideoPresentationUrl,
                        setImageFile,
                    }}
                    surSuivant={handleValiderEtape1}
                    enCours={enregistrementEtape1}
                />
            )}

            {etape === 1 && formationId && (
                <EtapeChapitres formationId={formationId} surPrecedent={() => setEtape(0)} surSuivant={() => setEtape(2)} />
            )}

            {etape === 2 && formationId && (
                <EtapeQuiz formationId={formationId} surPrecedent={() => setEtape(1)} surSuivant={() => setEtape(3)} />
            )}

            {etape === 3 && (
                <EtapeParametres
                    {...{
                        gratuite,
                        setGratuite,
                        prix,
                        setPrix,
                        noteMinimale,
                        setNoteMinimale,
                        certificatActif,
                        setCertificatActif,
                        visible,
                        setVisible,
                        nombreMaxInscrits,
                        setNombreMaxInscrits,
                        dateDebut,
                        setDateDebut,
                        dateFin,
                        setDateFin,
                        prerequis,
                        setPrerequis,
                        competencesAcquises,
                        setCompetencesAcquises,
                    }}
                    surPrecedent={() => setEtape(2)}
                    surTerminer={handleTerminer}
                    enCours={enregistrementFinal}
                />
            )}
        </div>
    );
}

// ============================================================
// Étape 1 : Infos générales
// ============================================================

interface PropsEtape1 {
    titre: string;
    setTitre: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    categorie: CategorieFormation;
    setCategorie: (v: CategorieFormation) => void;
    niveau: NiveauFormation;
    setNiveau: (v: NiveauFormation) => void;
    langue: string;
    setLangue: (v: string) => void;
    dureeMinutes: string;
    setDureeMinutes: (v: string) => void;
    formateur: string;
    setFormateur: (v: string) => void;
    videoPresentationUrl: string;
    setVideoPresentationUrl: (v: string) => void;
    setImageFile: (f: File | null) => void;
    surSuivant: () => void;
    enCours: boolean;
}

function EtapeInfosGenerales(props: PropsEtape1) {
    return (
        <div className="offre-form-card">
            <p className="offre-form-card__section-title">Informations générales</p>

            <div className="offre-field">
                <label>Titre de la formation *</label>
                <input value={props.titre} onChange={(e) => props.setTitre(e.target.value)} placeholder="Java Spring Boot pour débutants" />
            </div>

            <div className="offre-field">
                <label>Description</label>
                <textarea value={props.description} onChange={(e) => props.setDescription(e.target.value)} rows={4} />
            </div>

            <div className="offre-field-row">
                <div className="offre-field">
                    <label>Catégorie *</label>
                    <select value={props.categorie} onChange={(e) => props.setCategorie(e.target.value as CategorieFormation)}>
                        {Object.entries(LABELS_CATEGORIE).map(([valeur, libelle]) => (
                            <option key={valeur} value={valeur}>
                                {libelle}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="offre-field">
                    <label>Niveau *</label>
                    <select value={props.niveau} onChange={(e) => props.setNiveau(e.target.value as NiveauFormation)}>
                        {Object.entries(LABELS_NIVEAU_FORMATION).map(([valeur, libelle]) => (
                            <option key={valeur} value={valeur}>
                                {libelle}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="offre-field-row--3">
                <div className="offre-field">
                    <label>Langue</label>
                    <input value={props.langue} onChange={(e) => props.setLangue(e.target.value)} placeholder="Français" />
                </div>
                <div className="offre-field">
                    <label>Durée estimée (minutes)</label>
                    <input type="number" min={0} value={props.dureeMinutes} onChange={(e) => props.setDureeMinutes(e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Formateur</label>
                    <input value={props.formateur} onChange={(e) => props.setFormateur(e.target.value)} placeholder="Nom du formateur" />
                </div>
            </div>

            <div className="offre-field">
                <label>URL vidéo de présentation (facultatif)</label>
                <input
                    value={props.videoPresentationUrl}
                    onChange={(e) => props.setVideoPresentationUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                />
            </div>

            <div className="offre-field">
                <label>Image de couverture</label>
                <div className="candidature-form__file">
                    <input type="file" accept="image/*" onChange={(e) => props.setImageFile(e.target.files?.[0] ?? null)} />
                </div>
            </div>

            <div className="wizard-actions">
                <button className="btn-gold" onClick={props.surSuivant} disabled={props.enCours}>
                    {props.enCours ? "Enregistrement..." : "Suivant →"}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// Étape 2 : Chapitres & Leçons
// ============================================================

function EtapeChapitres({
                            formationId,
                            surPrecedent,
                            surSuivant,
                        }: {
    formationId: number;
    surPrecedent: () => void;
    surSuivant: () => void;
}) {
    const [chapitres, setChapitres] = useState<ChapitreDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const [nouveauTitre, setNouveauTitre] = useState("");
    const [nouvelleDescription, setNouvelleDescription] = useState("");
    const [ajoutEnCours, setAjoutEnCours] = useState(false);

    const [chapitreOuvertId, setChapitreOuvertId] = useState<number | null>(null);

    useEffect(() => {
        charger();
    }, [formationId]);

    async function charger() {
        setLoading(true);
        try {
            setChapitres(await listerChapitres(formationId));
        } catch {
            setErreur("Impossible de charger les chapitres.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAjouterChapitre() {
        if (!nouveauTitre.trim()) return;
        setAjoutEnCours(true);
        try {
            const chapitre = await creerChapitre(formationId, {
                ordre: chapitres.length + 1,
                titre: nouveauTitre.trim(),
                description: nouvelleDescription.trim() || undefined,
            });
            setChapitres((prev) => [...prev, chapitre]);
            setNouveauTitre("");
            setNouvelleDescription("");
        } catch {
            setErreur("Impossible d'ajouter ce chapitre.");
        } finally {
            setAjoutEnCours(false);
        }
    }

    async function handleSupprimerChapitre(id: number) {
        if (!window.confirm("Supprimer ce chapitre et toutes ses leçons ?")) return;
        try {
            await supprimerChapitre(id);
            setChapitres((prev) => prev.filter((c) => c.id !== id));
        } catch {
            setErreur("Impossible de supprimer ce chapitre.");
        }
    }

    return (
        <div className="offre-form-card">
            <p className="offre-form-card__section-title">Chapitres et leçons</p>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : (
                <div className="chapitres-liste">
                    {chapitres.map((chapitre) => (
                        <div className="chapitre-item" key={chapitre.id}>
                            <div
                                className="chapitre-item__header"
                                onClick={() => setChapitreOuvertId(chapitreOuvertId === chapitre.id ? null : chapitre.id)}
                            >
                                <div>
                                    <span className="chapitre-item__ordre">{chapitre.ordre}</span>
                                    <span className="chapitre-item__titre">{chapitre.titre}</span>
                                    <span className="chapitre-item__meta">
                                        {chapitre.nombreLecons} leçon{chapitre.nombreLecons > 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="chapitre-item__actions" onClick={(e) => e.stopPropagation()}>
                                    <button className="btn-secondary btn-danger" onClick={() => handleSupprimerChapitre(chapitre.id)}>
                                        Supprimer
                                    </button>
                                    <span className="chapitre-item__chevron">{chapitreOuvertId === chapitre.id ? "▲" : "▼"}</span>
                                </div>
                            </div>

                            {chapitreOuvertId === chapitre.id && <SousListeLecons chapitreId={chapitre.id} onChange={charger} />}
                        </div>
                    ))}
                </div>
            )}

            <div className="ajout-inline">
                <p className="ajout-inline__titre">Ajouter un chapitre</p>
                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>Titre du chapitre</label>
                        <input value={nouveauTitre} onChange={(e) => setNouveauTitre(e.target.value)} placeholder="Introduction" />
                    </div>
                    <div className="offre-field">
                        <label>Description (facultatif)</label>
                        <input value={nouvelleDescription} onChange={(e) => setNouvelleDescription(e.target.value)} />
                    </div>
                </div>
                <button className="btn-secondary" onClick={handleAjouterChapitre} disabled={ajoutEnCours || !nouveauTitre.trim()}>
                    {ajoutEnCours ? "Ajout..." : "+ Ajouter le chapitre"}
                </button>
            </div>

            <div className="wizard-actions">
                <button className="btn-secondary" onClick={surPrecedent}>
                    ← Précédent
                </button>
                <button className="btn-gold" onClick={surSuivant} disabled={chapitres.length === 0}>
                    Suivant →
                </button>
            </div>
            {chapitres.length === 0 && <p className="wizard-hint">Ajoute au moins un chapitre pour continuer.</p>}
        </div>
    );
}

function SousListeLecons({ chapitreId, onChange }: { chapitreId: number; onChange: () => void }) {
    const [lecons, setLecons] = useState<LeconDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [titre, setTitre] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [dureeMinutes, setDureeMinutes] = useState("");
    const [fichierPdf, setFichierPdf] = useState<File | null>(null);
    const [ajoutEnCours, setAjoutEnCours] = useState(false);

    useEffect(() => {
        charger();
    }, [chapitreId]);

    async function charger() {
        setLoading(true);
        try {
            setLecons(await listerLecons(chapitreId));
        } finally {
            setLoading(false);
        }
    }

    async function handleAjouter() {
        if (!titre.trim()) return;
        setAjoutEnCours(true);
        try {
            const lecon = await creerLecon(chapitreId, {
                ordre: lecons.length + 1,
                titre: titre.trim(),
                videoUrl: videoUrl.trim() || undefined,
                dureeMinutes: dureeMinutes.trim() ? Number(dureeMinutes) : undefined,
            });
            if (fichierPdf) {
                await uploaderDocumentLecon(lecon.id, fichierPdf);
            }
            setTitre("");
            setVideoUrl("");
            setDureeMinutes("");
            setFichierPdf(null);
            await charger();
            onChange();
        } finally {
            setAjoutEnCours(false);
        }
    }

    async function handleSupprimer(id: number) {
        await supprimerLecon(id);
        await charger();
        onChange();
    }

    return (
        <div className="lecons-liste">
            {loading ? (
                <p className="wizard-hint">Chargement...</p>
            ) : (
                lecons.map((lecon) => (
                    <div className="lecon-item" key={lecon.id}>
                        <span className="lecon-item__ordre">{lecon.ordre}</span>
                        <span className="lecon-item__titre">{lecon.titre}</span>
                        {lecon.dureeMinutes && <span className="lecon-item__duree">{lecon.dureeMinutes} min</span>}
                        {lecon.documentPdfPresent && <span className="lecon-item__badge">📄 PDF</span>}
                        {lecon.videoUrl && <span className="lecon-item__badge">🎬 Vidéo</span>}
                        <button className="lecon-item__supprimer" onClick={() => handleSupprimer(lecon.id)}>
                            ✕
                        </button>
                    </div>
                ))
            )}

            <div className="ajout-inline ajout-inline--leger">
                <div className="offre-field-row--3">
                    <div className="offre-field">
                        <label>Titre de la leçon</label>
                        <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Les variables" />
                    </div>
                    <div className="offre-field">
                        <label>URL vidéo</label>
                        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="offre-field">
                        <label>Durée (min)</label>
                        <input type="number" min={0} value={dureeMinutes} onChange={(e) => setDureeMinutes(e.target.value)} />
                    </div>
                </div>
                <div className="offre-field">
                    <label>Document PDF (facultatif)</label>
                    <div className="candidature-form__file">
                        <input type="file" accept="application/pdf" onChange={(e) => setFichierPdf(e.target.files?.[0] ?? null)} />
                    </div>
                </div>
                <button className="btn-secondary" onClick={handleAjouter} disabled={ajoutEnCours || !titre.trim()}>
                    {ajoutEnCours ? "Ajout..." : "+ Ajouter la leçon"}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// Étape 3 : Quiz & Questions
// ============================================================

function EtapeQuiz({ formationId, surPrecedent, surSuivant }: { formationId: number; surPrecedent: () => void; surSuivant: () => void }) {
    const [chapitres, setChapitres] = useState<ChapitreDTO[]>([]);
    const [quizList, setQuizList] = useState<QuizDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const [titreQuiz, setTitreQuiz] = useState("");
    const [chapitreIdQuiz, setChapitreIdQuiz] = useState<string>(""); // "" = quiz final
    const [noteMinimaleQuiz, setNoteMinimaleQuiz] = useState("70");
    const [tentativesMax, setTentativesMax] = useState("");
    const [ajoutEnCours, setAjoutEnCours] = useState(false);

    const [quizOuvertId, setQuizOuvertId] = useState<number | null>(null);

    useEffect(() => {
        charger();
    }, [formationId]);

    async function charger() {
        setLoading(true);
        try {
            const [c, q] = await Promise.all([listerChapitres(formationId), listerQuiz(formationId)]);
            setChapitres(c);
            setQuizList(q);
        } catch {
            setErreur("Impossible de charger les quiz.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAjouterQuiz() {
        if (!titreQuiz.trim() || !noteMinimaleQuiz.trim()) return;
        setAjoutEnCours(true);
        try {
            const quiz = await creerQuiz(formationId, {
                titre: titreQuiz.trim(),
                chapitreId: chapitreIdQuiz ? Number(chapitreIdQuiz) : undefined,
                noteMinimale: Number(noteMinimaleQuiz),
                nombreTentativesMax: tentativesMax.trim() ? Number(tentativesMax) : undefined,
            });
            setQuizList((prev) => [...prev, quiz]);
            setTitreQuiz("");
            setChapitreIdQuiz("");
            setTentativesMax("");
        } catch {
            setErreur("Impossible de créer ce quiz.");
        } finally {
            setAjoutEnCours(false);
        }
    }

    async function handleSupprimerQuiz(id: number) {
        if (!window.confirm("Supprimer ce quiz et toutes ses questions ?")) return;
        await supprimerQuiz(id);
        setQuizList((prev) => prev.filter((q) => q.id !== id));
    }

    function nomChapitre(chapitreId: number | null): string {
        if (chapitreId === null) return "Quiz final de la formation";
        return chapitres.find((c) => c.id === chapitreId)?.titre ?? `Chapitre #${chapitreId}`;
    }

    const quizFinalExiste = quizList.some((q) => q.chapitreId === null);

    return (
        <div className="offre-form-card">
            <p className="offre-form-card__section-title">Quiz et questions</p>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : (
                <div className="chapitres-liste">
                    {quizList.map((quiz) => (
                        <div className="chapitre-item" key={quiz.id}>
                            <div className="chapitre-item__header" onClick={() => setQuizOuvertId(quizOuvertId === quiz.id ? null : quiz.id)}>
                                <div>
                                    <span className="chapitre-item__titre">{quiz.titre}</span>
                                    <span className="chapitre-item__meta">
                                        {nomChapitre(quiz.chapitreId)} · {quiz.nombreQuestions} question(s) · {quiz.pointsTotal} pts · seuil{" "}
                                        {quiz.noteMinimale}%
                                    </span>
                                </div>
                                <div className="chapitre-item__actions" onClick={(e) => e.stopPropagation()}>
                                    <button className="btn-secondary btn-danger" onClick={() => handleSupprimerQuiz(quiz.id)}>
                                        Supprimer
                                    </button>
                                    <span className="chapitre-item__chevron">{quizOuvertId === quiz.id ? "▲" : "▼"}</span>
                                </div>
                            </div>

                            {quizOuvertId === quiz.id && <SousListeQuestions quizId={quiz.id} onChange={charger} />}
                        </div>
                    ))}
                </div>
            )}

            <div className="ajout-inline">
                <p className="ajout-inline__titre">Ajouter un quiz</p>
                <div className="offre-field-row--3">
                    <div className="offre-field">
                        <label>Titre du quiz</label>
                        <input value={titreQuiz} onChange={(e) => setTitreQuiz(e.target.value)} placeholder="Quiz final" />
                    </div>
                    <div className="offre-field">
                        <label>Rattaché à</label>
                        <select value={chapitreIdQuiz} onChange={(e) => setChapitreIdQuiz(e.target.value)}>
                            <option value="">Quiz final (fin de formation)</option>
                            {chapitres.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.titre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="offre-field">
                        <label>Note minimale (%)</label>
                        <input type="number" min={0} max={100} value={noteMinimaleQuiz} onChange={(e) => setNoteMinimaleQuiz(e.target.value)} />
                    </div>
                </div>
                <div className="offre-field">
                    <label>Nombre de tentatives max (vide = illimité)</label>
                    <input type="number" min={1} value={tentativesMax} onChange={(e) => setTentativesMax(e.target.value)} />
                </div>
                {!chapitreIdQuiz && quizFinalExiste && (
                    <p className="wizard-hint wizard-hint--attention">
                        ⚠️ Un quiz final existe déjà. En créer un second est possible mais inhabituel — vérifie que c'est voulu.
                    </p>
                )}
                <button className="btn-secondary" onClick={handleAjouterQuiz} disabled={ajoutEnCours || !titreQuiz.trim()}>
                    {ajoutEnCours ? "Ajout..." : "+ Ajouter le quiz"}
                </button>
            </div>

            <div className="wizard-actions">
                <button className="btn-secondary" onClick={surPrecedent}>
                    ← Précédent
                </button>
                <button className="btn-gold" onClick={surSuivant}>
                    Suivant →
                </button>
            </div>
            {!quizFinalExiste && quizList.length > 0 && (
                <p className="wizard-hint wizard-hint--attention">
                    ⚠️ Aucun quiz final défini — la certification ne pourra jamais se déclencher pour cette formation tant qu'il n'y en a pas un
                    (chapitreId vide).
                </p>
            )}
        </div>
    );
}

interface LigneReponse {
    ordre: number;
    texte: string;
    estBonneReponse: boolean;
}

function SousListeQuestions({ quizId, onChange }: { quizId: number; onChange: () => void }) {
    const [questions, setQuestions] = useState<QuestionQCMDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const [typeQuestion, setTypeQuestion] = useState<TypeQuestion>("REPONSE_UNIQUE");
    const [question, setQuestion] = useState("");
    const [points, setPoints] = useState("5");
    const [explication, setExplication] = useState("");
    const [reponses, setReponses] = useState<LigneReponse[]>([
        { ordre: 1, texte: "", estBonneReponse: false },
        { ordre: 2, texte: "", estBonneReponse: false },
    ]);
    const [ajoutEnCours, setAjoutEnCours] = useState(false);
    const [erreurLocale, setErreurLocale] = useState<string | null>(null);

    useEffect(() => {
        charger();
    }, [quizId]);

    async function charger() {
        setLoading(true);
        try {
            setQuestions(await listerQuestions(quizId));
        } finally {
            setLoading(false);
        }
    }

    function toggleBonneReponse(index: number) {
        setReponses((prev) =>
            prev.map((r, i) => {
                if (typeQuestion === "REPONSE_UNIQUE") {
                    return { ...r, estBonneReponse: i === index };
                }
                return i === index ? { ...r, estBonneReponse: !r.estBonneReponse } : r;
            })
        );
    }

    function ajouterLigneReponse() {
        setReponses((prev) => [...prev, { ordre: prev.length + 1, texte: "", estBonneReponse: false }]);
    }

    function supprimerLigneReponse(index: number) {
        setReponses((prev) => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, ordre: i + 1 })));
    }

    function validerAvantEnvoi(): string | null {
        const propositions = reponses.filter((r) => r.texte.trim());
        if (propositions.length < 2) return "Il faut au moins 2 propositions non vides.";
        const nombreBonnes = propositions.filter((r) => r.estBonneReponse).length;
        if (typeQuestion === "REPONSE_UNIQUE" && nombreBonnes !== 1) return "Réponse unique : coche exactement UNE bonne réponse.";
        if (typeQuestion === "REPONSE_MULTIPLE" && nombreBonnes < 1) return "Réponses multiples : coche au moins UNE bonne réponse.";
        return null;
    }

    async function handleAjouterQuestion() {
        const erreurValidation = validerAvantEnvoi();
        if (erreurValidation) {
            setErreurLocale(erreurValidation);
            return;
        }
        setErreurLocale(null);
        setAjoutEnCours(true);
        try {
            const payloadReponses: CreerReponseQCMPayload[] = reponses
                .filter((r) => r.texte.trim())
                .map((r, i) => ({ ordre: i + 1, texte: r.texte.trim(), estBonneReponse: r.estBonneReponse }));

            await creerQuestion(quizId, {
                ordre: questions.length + 1,
                typeQuestion,
                question: question.trim(),
                points: Number(points),
                explication: explication.trim() || undefined,
                reponses: payloadReponses,
            });

            setQuestion("");
            setPoints("5");
            setExplication("");
            setReponses([
                { ordre: 1, texte: "", estBonneReponse: false },
                { ordre: 2, texte: "", estBonneReponse: false },
            ]);
            await charger();
            onChange();
        } catch {
            setErreurLocale("Impossible d'ajouter cette question (vérifie le serveur).");
        } finally {
            setAjoutEnCours(false);
        }
    }

    async function handleSupprimer(id: number) {
        await supprimerQuestion(id);
        await charger();
        onChange();
    }

    return (
        <div className="questions-liste">
            {loading ? (
                <p className="wizard-hint">Chargement...</p>
            ) : (
                questions.map((q) => (
                    <div className="question-item" key={q.id}>
                        <div className="question-item__header">
                            <span className="question-item__type">{q.typeQuestion === "REPONSE_UNIQUE" ? "Réponse unique" : "Réponses multiples"}</span>
                            <span className="question-item__points">{q.points} pts</span>
                            <button className="lecon-item__supprimer" onClick={() => handleSupprimer(q.id)}>
                                ✕
                            </button>
                        </div>
                        <p className="question-item__texte">{q.question}</p>
                        <ul className="question-item__reponses">
                            {q.reponses.map((r) => (
                                <li key={r.id} className={r.estBonneReponse ? "question-item__reponse--correcte" : ""}>
                                    {r.estBonneReponse ? "✓ " : "· "}
                                    {r.texte}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}

            <div className="ajout-inline ajout-inline--leger">
                <p className="ajout-inline__titre">Ajouter une question</p>

                <div className="offre-field-row--3">
                    <div className="offre-field">
                        <label>Type de question</label>
                        <select
                            value={typeQuestion}
                            onChange={(e) => {
                                setTypeQuestion(e.target.value as TypeQuestion);
                                setReponses((prev) => prev.map((r) => ({ ...r, estBonneReponse: false })));
                            }}
                        >
                            <option value="REPONSE_UNIQUE">Réponse unique</option>
                            <option value="REPONSE_MULTIPLE">Réponses multiples</option>
                        </select>
                    </div>
                    <div className="offre-field">
                        <label>Points</label>
                        <input type="number" min={1} value={points} onChange={(e) => setPoints(e.target.value)} />
                    </div>
                </div>

                <div className="offre-field">
                    <label>Question</label>
                    <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Que signifie JVM ?" />
                </div>

                <div className="offre-field">
                    <label>Propositions ({typeQuestion === "REPONSE_UNIQUE" ? "coche la bonne" : "coche les bonnes"})</label>
                    {reponses.map((r, index) => (
                        <div className="ligne-reponse" key={index}>
                            <input
                                type={typeQuestion === "REPONSE_UNIQUE" ? "radio" : "checkbox"}
                                name={`bonne-reponse-${quizId}`}
                                checked={r.estBonneReponse}
                                onChange={() => toggleBonneReponse(index)}
                            />
                            <input
                                className="ligne-reponse__texte"
                                value={r.texte}
                                onChange={(e) => setReponses((prev) => prev.map((rr, i) => (i === index ? { ...rr, texte: e.target.value } : rr)))}
                                placeholder={`Proposition ${index + 1}`}
                            />
                            {reponses.length > 2 && (
                                <button className="lecon-item__supprimer" onClick={() => supprimerLigneReponse(index)}>
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="btn-secondary" onClick={ajouterLigneReponse} style={{ marginTop: 8 }}>
                        + Ajouter une proposition
                    </button>
                </div>

                <div className="offre-field">
                    <label>Explication (facultatif, affichée après réponse)</label>
                    <input value={explication} onChange={(e) => setExplication(e.target.value)} />
                </div>

                {erreurLocale && <div className="offre-message--error">{erreurLocale}</div>}

                <button className="btn-secondary" onClick={handleAjouterQuestion} disabled={ajoutEnCours || !question.trim()}>
                    {ajoutEnCours ? "Ajout..." : "+ Ajouter la question"}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// Étape 4 : Paramètres
// ============================================================

interface PropsEtape4 {
    gratuite: boolean;
    setGratuite: (v: boolean) => void;
    prix: string;
    setPrix: (v: string) => void;
    noteMinimale: string;
    setNoteMinimale: (v: string) => void;
    certificatActif: boolean;
    setCertificatActif: (v: boolean) => void;
    visible: boolean;
    setVisible: (v: boolean) => void;
    nombreMaxInscrits: string;
    setNombreMaxInscrits: (v: string) => void;
    dateDebut: string;
    setDateDebut: (v: string) => void;
    dateFin: string;
    setDateFin: (v: string) => void;
    prerequis: string;
    setPrerequis: (v: string) => void;
    competencesAcquises: string;
    setCompetencesAcquises: (v: string) => void;
    surPrecedent: () => void;
    surTerminer: () => void;
    enCours: boolean;
}

function EtapeParametres(props: PropsEtape4) {
    return (
        <div className="offre-form-card">
            <p className="offre-form-card__section-title">Paramètres de la formation</p>

            <div className="offre-field-row">
                <div className="offre-field">
                    <label>Type</label>
                    <select value={props.gratuite ? "gratuite" : "payante"} onChange={(e) => props.setGratuite(e.target.value === "gratuite")}>
                        <option value="gratuite">Gratuite</option>
                        <option value="payante">Payante</option>
                    </select>
                </div>
                {!props.gratuite && (
                    <div className="offre-field">
                        <label>Prix (FCFA)</label>
                        <input type="number" min={0} value={props.prix} onChange={(e) => props.setPrix(e.target.value)} />
                    </div>
                )}
            </div>

            <div className="offre-field-row">
                <div className="offre-field">
                    <label>Note minimale de validation (%)</label>
                    <input type="number" min={0} max={100} value={props.noteMinimale} onChange={(e) => props.setNoteMinimale(e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Nombre maximum d'inscrits (vide = illimité)</label>
                    <input type="number" min={1} value={props.nombreMaxInscrits} onChange={(e) => props.setNombreMaxInscrits(e.target.value)} />
                </div>
            </div>

            <div className="offre-field-row">
                <div className="offre-field">
                    <label>Date de début</label>
                    <input type="date" value={props.dateDebut} onChange={(e) => props.setDateDebut(e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Date de fin des inscriptions</label>
                    <input type="date" value={props.dateFin} onChange={(e) => props.setDateFin(e.target.value)} />
                </div>
            </div>

            <div className="offre-field">
                <label>Prérequis (séparés par des virgules)</label>
                <input value={props.prerequis} onChange={(e) => props.setPrerequis(e.target.value)} placeholder="Bases de Java, Notions HTTP" />
            </div>

            <div className="offre-field">
                <label>Compétences acquises (séparées par des virgules)</label>
                <input
                    value={props.competencesAcquises}
                    onChange={(e) => props.setCompetencesAcquises(e.target.value)}
                    placeholder="Spring Boot, REST API, JPA"
                />
            </div>

            <div className="offre-field-row">
                <label className="toggle-field">
                    <input type="checkbox" checked={props.certificatActif} onChange={(e) => props.setCertificatActif(e.target.checked)} />
                    Délivrer un certificat à la réussite
                </label>
                <label className="toggle-field">
                    <input type="checkbox" checked={props.visible} onChange={(e) => props.setVisible(e.target.checked)} />
                    Formation visible dans le catalogue
                </label>
            </div>

            {!props.visible && (
                <p className="wizard-hint wizard-hint--attention">
                    ⚠️ La formation restera masquée du catalogue candidat tant que cette case n'est pas cochée.
                </p>
            )}

            <div className="wizard-actions">
                <button className="btn-secondary" onClick={props.surPrecedent}>
                    ← Précédent
                </button>
                <button className="btn-gold" onClick={props.surTerminer} disabled={props.enCours}>
                    {props.enCours ? "Enregistrement..." : "Terminer et enregistrer"}
                </button>
            </div>
        </div>
    );
}