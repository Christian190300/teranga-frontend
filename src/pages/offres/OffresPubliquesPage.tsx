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

/** Nettoie le texte et gère les replis (description -> profilRecherche -> missions) */
function extraireTexteDescription(job: OffreDTO): string {
    const sourceTexte =
        job.description ||
        job.profilRecherche ||
        (job.missions && job.missions.length > 0 ? job.missions[0] : "");

    if (!sourceTexte) return "";

    return sourceTexte.replace(/<[^>]*>?/gm, "").trim();
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
    const [triSelectionne, setTriSelectionne] = useState<"recent" | "ancien">("recent");

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
                    tri: triSelectionne,
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
    }, [page, rechercheAppliquee, secteurSelectionne, triSelectionne]);

    // Remonte en haut de page à chaque changement de page (pagination)
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

    function handleChangerTri(e: React.ChangeEvent<HTMLSelectElement>) {
        setTriSelectionne(e.target.value as "recent" | "ancien");
        setPage(0);
    }

    function reinitialiserFiltres() {
        setRechercheInput("");
        setRechercheAppliquee("");
        setSecteurSelectionne("");
        setTriSelectionne("recent");
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
                                    placeholder="Mots-clés"
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

                            <div className="offres-filterbar__pill offres-filterbar__pill--select">
                                <select
                                    value={triSelectionne}
                                    onChange={handleChangerTri}
                                    className="offres-filterbar__pill-select"
                                >
                                    <option value="recent">Plus récentes</option>
                                    <option value="ancien">Plus anciennes</option>
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

                {error && (
                    <div className="offres-alert offres-alert--error" role="alert">
                        <span>{error}</span>
                    </div>
                )}

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
                                    const descriptionPropre = extraireTexteDescription(job);

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

                                            {descriptionPropre ? (
                                                <p className="job-pass__description">
                                                    {descriptionPropre}
                                                </p>
                                            ) : (
                                                <p className="job-pass__description job-pass__description--empty">
                                                    Aucune description disponible.
                                                </p>
                                            )}

                                            <div className="job-pass__tags">
                                                <span
                                                    className="job-pass__tag job-pass__tag--solid"
                                                    style={{
                                                        backgroundColor: couleur?.bar ?? "var(--job-color, #0b1d3a)",
                                                        color: "#ffffff",
                                                    }}
                                                >
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