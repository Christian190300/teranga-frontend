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
    LABELS_NIVEAU_EXPERIENCE,
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

export function OffresPubliquesPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // --- États des données ---
    const [offres, setOffres] = useState<OffreDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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
            } catch (err) {
                console.error("Erreur chargement offres :", err);
                setError("Impossible de charger les offres d'emploi pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [page, rechercheAppliquee, secteurSelectionne]);

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

    return (
        <main className="home-page page-transition">
            <div className="home-container">
                {/* HERO BANNER & EN-TÊTE */}
                <section className="offres-hero">
                    <div className="offres-hero__content">
                        <span className="home-pill">Opportunités au Sénégal</span>
                        <h1 className="offres-hero__title">
                            Trouvez le poste qui propulse votre <span>carrière</span>.
                        </h1>
                        <p className="offres-hero__subtitle">
                            Accédez aux meilleures offres recrutant à Dakar et dans toutes les régions du Sénégal.
                        </p>
                    </div>

                    {/* BARRE DE FILTRES RECONFIGURÉE */}
                    <form className="offres-filterbar" onSubmit={lancerRecherche}>
                        <div className="offres-filterbar__group">
                            <svg className="offres-filterbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                <path d="M20 20L16.65 16.65" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Intitulé de poste, ville, compétence..."
                                value={rechercheInput}
                                onChange={(e) => setRechercheInput(e.target.value)}
                                className="offres-filterbar__input"
                            />
                        </div>

                        <div className="offres-filterbar__divider" />

                        <div className="offres-filterbar__group">
                            <select
                                value={secteurSelectionne}
                                onChange={handleChangerSecteur}
                                className="offres-filterbar__select"
                            >
                                <option value="">Tous les secteurs d'activité</option>
                                {secteurs.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <svg className="offres-filterbar__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 9L12 15L18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="offres-filterbar__actions">
                            <button type="submit" className="home-btn home-btn--gold">
                                Rechercher
                            </button>
                            {filtresActifs && (
                                <button
                                    type="button"
                                    className="home-btn home-btn--outline home-btn--dark"
                                    onClick={reinitialiserFiltres}
                                >
                                    Effacer
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* GESTION DES ERREURS */}
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
                                <div key={i} className="job-pass job-pass--skeleton" aria-hidden="true">
                                    <div className="job-pass__top">
                                        <div className="skeleton-box skeleton-box--logo" />
                                        <div className="skeleton-box--content">
                                            <div className="skeleton-line skeleton-line--short" />
                                            <div className="skeleton-line skeleton-line--title" />
                                            <div className="skeleton-line skeleton-line--sub" />
                                        </div>
                                    </div>
                                    <div className="skeleton-line skeleton-line--tags" />
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

                                    return (
                                        <article
                                            key={job.id}
                                            className="job-pass"
                                            style={
                                                {
                                                    "--job-color": couleur?.bar ?? "var(--hp-gold)",
                                                } as React.CSSProperties
                                            }
                                        >
                                            {estRecente && <span className="job-pass__new">Nouveau</span>}

                                            <div className="job-pass__top">
                                                <LogoEntreprise
                                                    recruteurId={job.recruteurId}
                                                    logoPresent={job.logoPresent}
                                                    nomEntreprise={job.nomEntreprise}
                                                    className="job-pass__logo"
                                                />
                                                <div className="job-pass__id">
                                                    <p className="job-pass__eyebrow">
                                                        {job.secteurActivite ?? "Général"}
                                                        {jours !== null && <> · {formatAnciennete(jours)}</>}
                                                    </p>
                                                    <h3>{job.titre}</h3>
                                                    <p className="job-pass__company">
                                                        {job.nomEntreprise ?? "Entreprise confidentielle"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="job-pass__tags">
                                                <span className="job-pass__tag job-pass__tag--solid">
                                                    {LABELS_TYPE_CONTRAT[job.typeContrat] ?? job.typeContrat}
                                                </span>
                                                {job.teletravail && <span className="job-pass__tag">Télétravail</span>}
                                                {job.hybride && <span className="job-pass__tag">Hybride</span>}
                                                {job.niveauExperience && (
                                                    <span className="job-pass__tag">
                                                        {LABELS_NIVEAU_EXPERIENCE[job.niveauExperience] ?? job.niveauExperience}
                                                    </span>
                                                )}
                                            </div>

                                            {competences.length > 0 && (
                                                <div className="job-pass__skills">
                                                    {competences.map((c) => (
                                                        <span className="job-pass__skill" key={c}>
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="job-pass__footer">
                                                <span className="job-pass__meta">
                                                    <IconMapPin />
                                                    {lieu}
                                                </span>
                                                <span className="job-pass__meta job-pass__meta--salaire">
                                                    <IconCoin />
                                                    {formatSalaire(job)}
                                                </span>
                                            </div>

                                            <div className="job-pass__actions">
                                                <Link
                                                    to={`/offres/${job.id}`}
                                                    className="job-pass__btn job-pass__btn--ghost"
                                                >
                                                    Voir détail
                                                </Link>
                                                {(!currentUser || estCandidat) && (
                                                    <button
                                                        type="button"
                                                        className="job-pass__btn job-pass__btn--gold"
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

                            {/* PAGINATION ELEGANTE */}
                            {totalPages > 1 && (
                                <nav className="offres-pagination" aria-label="Navigation des pages">
                                    <button
                                        type="button"
                                        className="home-btn home-btn--outline home-btn--dark"
                                        disabled={page === 0}
                                        onClick={() => setPage((p) => p - 1)}
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
                                        onClick={() => setPage((p) => p + 1)}
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