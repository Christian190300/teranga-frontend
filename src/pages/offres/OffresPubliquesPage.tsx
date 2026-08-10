import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoEntreprise } from "../../components/common/LogoEntreprise";
import { IconCoin, IconMapPin } from "../../components/home/icons"; // Ajuste le chemin selon ton projet
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
    if (jours <= 0) return "Publiée aujourd'hui";
    if (jours === 1) return "Publiée hier";
    return `Publiée il y a ${jours} j`;
}

function formatSalaire(offre: OffreDTO): string {
    if (!offre.salaireVisible || (!offre.salaireMin && !offre.salaireMax)) {
        return "Salaire non communiqué";
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

    // Chargement initial des secteurs
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
                setError("Impossible de charger les offres pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [page, rechercheAppliquee, secteurSelectionne]);

    // Handlers filtres
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
        <div className="offres-page home-container">
            {/* EN-TÊTE DE LA PAGE */}
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Offres d'emploi</h1>
                    <p className="offres-page__subtitle">
                        Découvrez les opportunités disponibles au Sénégal.
                    </p>
                </div>
            </div>

            {/* BARRE DE FILTRES */}
            <form className="offres-filtres" onSubmit={lancerRecherche}>
                <div className="offres-filtres__search">
                    <svg
                        className="offres-filtres__search-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path
                            d="M20 20L16.65 16.65"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher un poste, une ville..."
                        value={rechercheInput}
                        onChange={(e) => setRechercheInput(e.target.value)}
                        className="offres-filtres__search-input"
                    />
                </div>

                <div className="offres-filtres__select-wrap">
                    <select
                        value={secteurSelectionne}
                        onChange={handleChangerSecteur}
                        className="offres-filtres__select"
                    >
                        <option value="">Tous les secteurs</option>
                        {secteurs.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <svg
                        className="offres-filtres__select-arrow"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="offres-filtres__actions">
                    <button type="submit" className="btn-gold">
                        Rechercher
                    </button>
                    {filtresActifs && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={reinitialiserFiltres}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
            </form>

            {/* GESTION DES ERREURS */}
            {error && <div className="offre-message--error">{error}</div>}

            {/* GRILLE / SKELETON / ETAT VIDE */}
            {loading ? (
                <div className="home-jobs-grid">
                    {Array.from({ length: TAILLE_PAGE }).map((_, i) => (
                        <div key={i} className="job-pass job-pass--skeleton" aria-hidden="true">
                            <div className="skeleton-line skeleton-line--title" />
                            <div className="skeleton-line skeleton-line--text" />
                        </div>
                    ))}
                </div>
            ) : offres.length === 0 ? (
                <div className="home-jobs-empty">
                    <p>
                        {filtresActifs
                            ? "Aucune offre ne correspond à votre recherche."
                            : "Aucune offre disponible pour le moment."}
                    </p>
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
                                "Non précisé";
                            const competences = (job.competences ?? []).slice(0, 3);

                            return (
                                <article
                                    key={job.id}
                                    className="job-pass"
                                    style={
                                        {
                                            "--job-color": couleur?.bar ?? "var(--navy)",
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
                                                {job.secteurActivite ?? "Secteur non précisé"}
                                                {jours !== null && <> · {formatAnciennete(jours)}</>}
                                            </p>
                                            <h3>{job.titre}</h3>
                                            <p className="job-pass__company">
                                                {job.nomEntreprise ?? "Entreprise"}
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

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="offres-pagination" style={{ marginTop: "2rem" }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                disabled={page === 0}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Précédent
                            </button>
                            <span className="offres-pagination__info">
                                Page {page + 1} / {totalPages}
                            </span>
                            <button
                                type="button"
                                className="btn-secondary"
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OffresPubliquesPage;