import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoEntreprise } from "../../components/common/LogoEntreprise";
import { IconCoin, IconMapPin } from "../../components/home/icons";
import { getCouleurContrat } from "./offreColors";
import { useAuth } from "../../context/AuthContext";
import {
    listerOffresPubliques,
    listerSecteursDisponibles,
    LABELS_TYPE_CONTRAT,
    type OffreDTO,
} from "../../api/offreService";
import "./offres.css";

const TAILLE_PAGE = 8;

function joursDepuisPublication(iso: string | null): number | null {
    if (!iso) return null;
    const timestamp = new Date(iso).getTime();
    if (isNaN(timestamp)) return null;

    const diffMs = Date.now() - timestamp;
    return Math.floor(diffMs / 86400000);
}

function formatAnciennete(jours: number | null): string {
    if (jours === null) return "";
    if (jours <= 0) return "Aujourd'hui";
    if (jours === 1) return "Hier";
    return `Il y a ${jours}j`;
}

function formatSalaire(offre: OffreDTO): string {
    if (!offre.salaireVisible || (!offre.salaireMin && !offre.salaireMax)) {
        return "Sur demande";
    }
    const devise = offre.devise ?? "FCFA";
    if (offre.salaireMin && offre.salaireMax) {
        return `${offre.salaireMin.toLocaleString()} - ${offre.salaireMax.toLocaleString()} ${devise}`;
    }
    return `${(offre.salaireMin ?? offre.salaireMax)?.toLocaleString()} ${devise}`;
}

/** Nettoie le HTML/Markdown de la description pour afficher un extrait propre */
function stripHtml(html?: string): string {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
}

export function OffresPubliquesPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // --- États des données ---
    const [offres, setOffres] = useState<OffreDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Filtres ---
    const [rechercheInput, setRechercheInput] = useState("");
    const [rechercheAppliquee, setRechercheAppliquee] = useState("");
    const [secteurs, setSecteurs] = useState<string[]>([]);
    const [secteurSelectionne, setSecteurSelectionne] = useState("");

    const estCandidat = currentUser?.role === "CANDIDAT";
    const filtresActifs = rechercheAppliquee !== "" || secteurSelectionne !== "";

    // Chargement des secteurs
    useEffect(() => {
        listerSecteursDisponibles()
            .then(setSecteurs)
            .catch(() => setSecteurs([]));
    }, []);

    // Chargement des offres
    useEffect(() => {
        async function charger() {
            setLoading(true);
            setError(null);
            try {
                const data = await listerOffresPubliques(page, TAILLE_PAGE, {
                    recherche: rechercheAppliquee,
                    secteurActivite: secteurSelectionne,
                });
                setOffres(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? data.content?.length ?? 0);
            } catch (err) {
                console.error("Erreur chargement offres :", err);
                setError("Impossible de charger les offres d'emploi pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [page, rechercheAppliquee, secteurSelectionne]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    // Handlers
    function lancerRecherche(e: React.FormEvent) {
        e.preventDefault();
        setPage(0);
        setRechercheAppliquee(rechercheInput.trim());
    }

    function handleChangerSecteur(e: React.ChangeEvent<HTMLSelectElement>) {
        setSecteurSelectionne(e.target.value);
        setPage(0);
    }

    function reinitialiserFiltres() {
        setRechercheInput("");
        setRechercheAppliquee("");
        setSecteurSelectionne("");
        setPage(0);
    }

    function handlePostuler(e: React.MouseEvent, jobId: number | string) {
        e.preventDefault();
        e.stopPropagation();
        if (currentUser) {
            navigate(`/offres/${jobId}`, { state: { ouvrirCandidature: true } });
        } else {
            navigate(`/connexion?redirect=/offres/${jobId}`);
        }
    }

    function allerPagePrecedente() {
        setPage((p) => p - 1);
    }

    function allerPageSuivante() {
        setPage((p) => p + 1);
    }

    return (
        <main className="home-page page-transition">
            <div className="home-container">
                <br />

                {/* HERO BANNER */}
                <section className="offres-hero">
                    <div className="offres-hero__inner">
                        <h1 className="offres-hero__title">
                            Trouvez votre futur job parmi{" "}
                            <span className="offres-hero__count">{totalElements.toLocaleString("fr-FR")}</span>{" "}
                            postes ouverts
                        </h1>

                        <form className="offres-filterbar" onSubmit={lancerRecherche}>
                            <div className="offres-filterbar__pill">
                                <svg className="offres-filterbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                    <path d="M20 20L16.65 16.65" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Intitulé de poste, mots-clés..."
                                    value={rechercheInput}
                                    onChange={(e) => setRechercheInput(e.target.value)}
                                    className="offres-filterbar__pill-input"
                                />
                            </div>

                            <div className="offres-filterbar__pill offres-filterbar__pill--select">
                                <select
                                    value={secteurSelectionne}
                                    onChange={handleChangerSecteur}
                                    className="offres-filterbar__pill-select"
                                >
                                    <option value="">Tous les secteurs</option>
                                    {secteurs.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <svg className="offres-filterbar__pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M6 9L12 15L18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <button type="submit" className="offres-filterbar__submit" aria-label="Rechercher">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="7" strokeWidth="2.2" />
                                    <path d="M20 20L16.65 16.65" strokeWidth="2.2" strokeLinecap="round" />
                                </svg>
                            </button>

                            {filtresActifs && (
                                <button
                                    type="button"
                                    className="offres-filterbar__reset"
                                    onClick={reinitialiserFiltres}
                                >
                                    Effacer les filtres
                                </button>
                            )}
                        </form>
                    </div>
                </section>

                {/* ERREURS */}
                {error && (
                    <div className="offres-alert offres-alert--error" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                {/* LISTE DES OFFRES */}
                <section className="offres-section">
                    {loading ? (
                        <div className="home-jobs-grid">
                            {Array.from({ length: TAILLE_PAGE }).map((_, i) => (
                                <div key={i} className="job-card job-card--skeleton" aria-hidden="true">
                                    <div className="job-card__header">
                                        <div className="skeleton-box skeleton-box--logo" />
                                        <div className="skeleton-box--content">
                                            <div className="skeleton-line skeleton-line--short" />
                                            <div className="skeleton-line skeleton-line--title" />
                                        </div>
                                    </div>
                                    <div className="skeleton-line skeleton-line--sub" />
                                    <div className="skeleton-line skeleton-line--footer" />
                                </div>
                            ))}
                        </div>
                    ) : offres.length === 0 ? (
                        <div className="offres-empty">
                            <div className="offres-empty__icon">🔍</div>
                            <h3>Aucune offre trouvée</h3>
                            <p>
                                {filtresActifs
                                    ? "Aucun résultat ne correspond à vos critères de recherche. Essayez de réinitialiser les filtres."
                                    : "Aucune offre n'est disponible actuellement. Revenez régulièrement !"}
                            </p>
                            {filtresActifs && (
                                <button
                                    type="button"
                                    className="home-btn home-btn--gold"
                                    onClick={reinitialiserFiltres}
                                >
                                    Voir toutes les offres
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="home-jobs-grid">
                                {offres.map((job) => {
                                    const couleur = getCouleurContrat(job.typeContrat);
                                    const jours = joursDepuisPublication(job.datePublication);
                                    const estRecente = jours !== null && jours <= 2;
                                    const lieu =
                                        [job.ville, job.region, job.pays].filter(Boolean).join(", ") ||
                                        "Sénégal";
                                    const competences = (job.competences ?? []).slice(0, 3);
                                    const descriptionPropre = stripHtml(job.description);

                                    return (
                                        <article key={job.id} className="job-card">
                                            {/* EN-TÊTE : Entreprise + Logo + Type de contrat */}
                                            <div className="job-card__header">
                                                <LogoEntreprise
                                                    recruteurId={job.recruteurId}
                                                    logoPresent={job.logoPresent}
                                                    nomEntreprise={job.nomEntreprise}
                                                    className="job-card__logo"
                                                />

                                                <div className="job-card__company-details">
                                                    <span className="job-card__company-name">
                                                        {job.nomEntreprise ?? "Entreprise confidentielle"}
                                                    </span>
                                                    <span className="job-card__sector">
                                                        {job.secteurActivite ?? "Général"}
                                                    </span>
                                                </div>

                                                <div className="job-card__header-badges">
                                                    {estRecente && <span className="job-card__badge-new">Nouveau</span>}
                                                    <span
                                                        className="job-card__contract-pill"
                                                        style={{
                                                            color: couleur?.text ?? "#0f172a",
                                                            backgroundColor: couleur?.bg ?? "#f1f5f9",
                                                        }}
                                                    >
                                                        {LABELS_TYPE_CONTRAT[job.typeContrat] ?? job.typeContrat}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* TITRE DE L'OFFRE */}
                                            <h3 className="job-card__title">
                                                <Link to={`/offres/${job.id}`}>{job.titre}</Link>
                                            </h3>

                                            {/* EXTRAIT DE LA DESCRIPTION (Sobriété & pertinence) */}
                                            {descriptionPropre && (
                                                <p className="job-card__excerpt">{descriptionPropre}</p>
                                            )}

                                            {/* CHIPS DE MÉTADONNÉES (Lieu, Salaire, Ancienneté) */}
                                            <div className="job-card__info-row">
                                                <span className="job-card__info-chip">
                                                    <IconMapPin />
                                                    {lieu}
                                                </span>
                                                <span className="job-card__info-chip job-card__info-chip--salary">
                                                    <IconCoin />
                                                    {formatSalaire(job)}
                                                </span>
                                                {jours !== null && (
                                                    <span className="job-card__time">
                                                        {formatAnciennete(jours)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* COMPÉTENCES & MODALITÉS */}
                                            {(competences.length > 0 || job.teletravail || job.hybride) && (
                                                <div className="job-card__skills-bar">
                                                    {job.teletravail && <span className="job-card__skill-tag">Télétravail</span>}
                                                    {job.hybride && <span className="job-card__skill-tag">Hybride</span>}
                                                    {competences.map((c) => (
                                                        <span className="job-card__skill-tag" key={c}>
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* PIED DE CARTE (Actions) */}
                                            <div className="job-card__footer">
                                                <Link to={`/offres/${job.id}`} className="job-card__more-link">
                                                    En savoir plus <span>→</span>
                                                </Link>

                                                {(!currentUser || estCandidat) && (
                                                    <button
                                                        type="button"
                                                        className="job-card__btn-apply"
                                                        onClick={(e) => handlePostuler(e, job.id)}
                                                    >
                                                        Postuler
                                                    </button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <nav className="offres-pagination" aria-label="Navigation des pages">
                                    <button
                                        type="button"
                                        className="home-btn home-btn--outline home-btn--dark"
                                        disabled={page === 0}
                                        onClick={allerPagePrecedente}
                                    >
                                        ← Précédent
                                    </button>
                                    <span className="offres-pagination__info">
                                        Page <strong>{page + 1}</strong> sur <strong>{totalPages}</strong>
                                    </span>
                                    <button
                                        type="button"
                                        className="home-btn home-btn--outline home-btn--dark"
                                        disabled={page + 1 >= totalPages}
                                        onClick={allerPageSuivante}
                                    >
                                        Suivant →
                                    </button>
                                </nav>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

export default OffresPubliquesPage;