import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    listerFormationsPubliques,
    obtenirFormationPublique,
    sInscrire,
    obtenirImageFormationPublicUrl,
    LABELS_CATEGORIE,
    LABELS_NIVEAU_FORMATION,
    type FormationPublicDTO,
    type CategorieFormation,
    type NiveauFormation,
} from "../../api/formationPublicService";
import { useAuth } from "../../context/AuthContext";
import "../public/offres.css";
import "./formationPublique.css";

function formatDuree(minutes: number | null): string {
    if (!minutes) return "Durée non précisée";
    if (minutes < 60) return `${minutes} min`;
    const heures = Math.floor(minutes / 60);
    const reste = minutes % 60;
    return reste > 0 ? `${heures} h ${reste} min` : `${heures} h`;
}

function formatPrix(formation: FormationPublicDTO): string {
    if (formation.gratuite) return "Gratuite";
    return formation.prix != null ? `${formation.prix.toLocaleString()} FCFA` : "Payante";
}

export function FormationsPubliquesPage() {
    const { currentUser } = useAuth();
    const estCandidat = currentUser?.role === "CANDIDAT";

    const [formations, setFormations] = useState<FormationPublicDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [recherche, setRecherche] = useState("");
    const [filtreCategorie, setFiltreCategorie] = useState<CategorieFormation | "">("");
    const [filtreNiveau, setFiltreNiveau] = useState<NiveauFormation | "">("");

    const [modalFormationId, setModalFormationId] = useState<number | null>(null);
    const [modalFormation, setModalFormation] = useState<FormationPublicDTO | null>(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [inscriptionEnCours, setInscriptionEnCours] = useState(false);
    const [inscriptionReussie, setInscriptionReussie] = useState(false);
    const [erreurInscription, setErreurInscription] = useState<string | null>(null);

    useEffect(() => {
        charger();
    }, []);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") fermerModal();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    async function charger() {
        setLoading(true);
        try {
            const data = await listerFormationsPubliques();
            setFormations(data);
        } catch {
            setError("Impossible de charger les formations pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    const formationsFiltrees = useMemo(() => {
        return formations.filter((f) => {
            if (filtreCategorie && f.categorie !== filtreCategorie) return false;
            if (filtreNiveau && f.niveau !== filtreNiveau) return false;
            if (recherche.trim()) {
                const q = recherche.trim().toLowerCase();
                const cible = `${f.titre} ${f.formateur ?? ""} ${f.description ?? ""}`.toLowerCase();
                if (!cible.includes(q)) return false;
            }
            return true;
        });
    }, [formations, recherche, filtreCategorie, filtreNiveau]);

    async function ouvrirModal(id: number) {
        setModalFormationId(id);
        setInscriptionReussie(false);
        setErreurInscription(null);
        setLoadingModal(true);
        try {
            const data = await obtenirFormationPublique(id);
            setModalFormation(data);
        } catch {
            setModalFormation(null);
        } finally {
            setLoadingModal(false);
        }
    }

    function fermerModal() {
        setModalFormationId(null);
        setModalFormation(null);
        setErreurInscription(null);
    }

    async function handleInscription() {
        if (!modalFormation) return;
        setInscriptionEnCours(true);
        setErreurInscription(null);
        try {
            await sInscrire(modalFormation.id);
            setInscriptionReussie(true);
            setFormations((prev) => prev.map((f) => (f.id === modalFormation.id ? { ...f, dejaInscrit: true } : f)));
        } catch (err) {
            const messageKey = (err as any)?.response?.data?.message as string | undefined;
            const messages: Record<string, string> = {
                "error.dejaInscrit": "Vous êtes déjà inscrit à cette formation.",
                "error.nonVisible": "Cette formation n'est plus disponible.",
                "error.inscriptionFermee": "Les inscriptions à cette formation sont terminées.",
                "error.placesEpuisees": "Le nombre maximum d'inscrits est atteint pour cette formation.",
            };
            setErreurInscription(messages[messageKey ?? ""] ?? "Impossible de vous inscrire pour le moment.");
        } finally {
            setInscriptionEnCours(false);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Formations</h1>
                    <p className="offres-page__subtitle">Développez vos compétences et obtenez une certification reconnue.</p>
                </div>
            </div>

            <div className="formation-filtres">
                <input
                    className="formation-filtres__recherche"
                    placeholder="Rechercher une formation, un formateur..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value as CategorieFormation | "")}>
                    <option value="">Toutes les catégories</option>
                    {Object.entries(LABELS_CATEGORIE).map(([valeur, libelle]) => (
                        <option key={valeur} value={valeur}>
                            {libelle}
                        </option>
                    ))}
                </select>
                <select value={filtreNiveau} onChange={(e) => setFiltreNiveau(e.target.value as NiveauFormation | "")}>
                    <option value="">Tous les niveaux</option>
                    {Object.entries(LABELS_NIVEAU_FORMATION).map(([valeur, libelle]) => (
                        <option key={valeur} value={valeur}>
                            {libelle}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement des formations...</div>
            ) : formationsFiltrees.length === 0 ? (
                <div className="offres-page__empty">Aucune formation ne correspond à ta recherche.</div>
            ) : (
                <div className="offres-grid">
                    {formationsFiltrees.map((formation) => (
                        <div className="formation-tile" key={formation.id} role="button" tabIndex={0} onClick={() => ouvrirModal(formation.id)}>
                            <div className="formation-tile__image-wrapper">
                                {formation.imagePresente ? (
                                    <img src={obtenirImageFormationPublicUrl(formation.id)} alt={formation.titre} className="formation-tile__image" />
                                ) : (
                                    <div className="formation-tile__image formation-tile__image--placeholder">🎓</div>
                                )}
                                <span className={`formation-tile__prix ${formation.gratuite ? "formation-tile__prix--gratuite" : ""}`}>
                                    {formatPrix(formation)}
                                </span>
                            </div>

                            <div className="formation-tile__body">
                                <div className="formation-tile__tags">
                                    <span className="offre-tile__tag">{LABELS_CATEGORIE[formation.categorie]}</span>
                                    <span className="offre-tile__tag offre-tile__tag--gold">{LABELS_NIVEAU_FORMATION[formation.niveau]}</span>
                                </div>

                                <p className="formation-tile__titre">{formation.titre}</p>
                                {formation.formateur && <p className="formation-tile__formateur">Par {formation.formateur}</p>}

                                <div className="formation-tile__footer">
                                    <span className="formation-tile__meta">⏱ {formatDuree(formation.dureeMinutes)}</span>
                                    <span className="formation-tile__meta">👥 {formation.nombreInscrits} inscrit(s)</span>
                                </div>

                                {formation.dejaInscrit && <span className="formation-tile__deja-inscrit">✓ Déjà inscrit</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalFormationId && (
                <div className="offre-modal-overlay" onClick={fermerModal}>
                    <div className="offre-modal" onClick={(e) => e.stopPropagation()}>
                        {loadingModal ? (
                            <div className="offre-modal__loading">Chargement de la formation...</div>
                        ) : !modalFormation ? (
                            <div className="offre-modal__empty">
                                <p>Cette formation est introuvable ou n'est plus disponible.</p>
                                <button className="btn-secondary" onClick={fermerModal} style={{ marginTop: 16 }}>
                                    Fermer
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="offre-modal__header formation-modal__header">
                                    <button className="offre-modal__close" onClick={fermerModal} aria-label="Fermer">
                                        ✕
                                    </button>
                                    {modalFormation.imagePresente && (
                                        <img
                                            src={obtenirImageFormationPublicUrl(modalFormation.id)}
                                            alt={modalFormation.titre}
                                            className="formation-modal__image"
                                        />
                                    )}
                                    <div className="offre-detail__tags">
                                        <span className="offre-detail__tag offre-detail__tag--gold">{LABELS_CATEGORIE[modalFormation.categorie]}</span>
                                        <span className="offre-detail__tag">{LABELS_NIVEAU_FORMATION[modalFormation.niveau]}</span>
                                        {modalFormation.langue && <span className="offre-detail__tag">{modalFormation.langue}</span>}
                                    </div>
                                    <h1 className="offre-detail__titre">{modalFormation.titre}</h1>
                                    {modalFormation.formateur && <p className="offre-detail__entreprise">Par {modalFormation.formateur}</p>}
                                </div>

                                <div className="offre-modal__body">
                                    {estCandidat && (modalFormation.dejaInscrit || inscriptionReussie) && (
                                        <div className="candidature-form__success">
                                            ✓ Vous êtes inscrit à cette formation.{" "}
                                            <Link to="/candidat/formation" className="offre-detail__cta-info">
                                                Accéder à mon espace de formation →
                                            </Link>
                                        </div>
                                    )}

                                    {modalFormation.description && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Description</p>
                                            <p className="offre-detail__text">{modalFormation.description}</p>
                                        </div>
                                    )}

                                    {modalFormation.prerequis && modalFormation.prerequis.length > 0 && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Prérequis</p>
                                            <ul className="offre-detail__list">
                                                {modalFormation.prerequis.map((p) => (
                                                    <li key={p}>{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {modalFormation.competencesAcquises && modalFormation.competencesAcquises.length > 0 && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Compétences acquises</p>
                                            <div className="offre-detail__chips">
                                                {modalFormation.competencesAcquises.map((c) => (
                                                    <span className="offre-detail__chip" key={c}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="offre-detail__section">
                                        <p className="offre-detail__section-title">Informations</p>
                                        <div className="offre-detail__facts">
                                            <div>
                                                <div className="offre-detail__fact-label">Durée estimée</div>
                                                <div className="offre-detail__fact-value">{formatDuree(modalFormation.dureeMinutes)}</div>
                                            </div>
                                            <div>
                                                <div className="offre-detail__fact-label">Chapitres</div>
                                                <div className="offre-detail__fact-value">{modalFormation.nombreChapitres}</div>
                                            </div>
                                            <div>
                                                <div className="offre-detail__fact-label">Inscrits</div>
                                                <div className="offre-detail__fact-value">{modalFormation.nombreInscrits}</div>
                                            </div>
                                            <div>
                                                <div className="offre-detail__fact-label">Langue</div>
                                                <div className="offre-detail__fact-value">{modalFormation.langue ?? "—"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {modalFormation.videoPresentationUrl && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Présentation</p>
                                            <a
                                                href={modalFormation.videoPresentationUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="offre-detail__cta-info"
                                            >
                                                ▶ Voir la vidéo de présentation
                                            </a>
                                        </div>
                                    )}

                                    {erreurInscription && <div className="offre-message--error">{erreurInscription}</div>}

                                    {!estCandidat && !currentUser && (
                                        <p className="candidature-form__hint">
                                            <Link to="/connexion" className="offre-detail__cta-info">
                                                Connectez-vous
                                            </Link>{" "}
                                            en tant que candidat pour vous inscrire à cette formation.
                                        </p>
                                    )}
                                </div>

                                <div className="offre-modal__footer">
                                    <span className="offre-detail__fact-value">{formatPrix(modalFormation)}</span>
                                    {estCandidat && !modalFormation.dejaInscrit && !inscriptionReussie && (
                                        <button className="btn-gold" onClick={handleInscription} disabled={inscriptionEnCours}>
                                            {inscriptionEnCours ? "Inscription..." : "S'inscrire"}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}