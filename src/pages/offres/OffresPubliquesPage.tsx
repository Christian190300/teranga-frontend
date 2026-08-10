import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    listerOffresPubliques,
    listerSecteursDisponibles,
    LABELS_TYPE_CONTRAT,
    LABELS_NIVEAU_EXPERIENCE,
    type OffreDTO,
} from "../../api/offreService";
import { useAuth } from "../../context/AuthContext";
import { LogoEntreprise } from "../../components/common/LogoEntreprise";
import { IconCoin, IconMapPin } from "../../components/home/icons";
import { getCouleurContrat } from "./offreColors";
import "./offres.css";

const TAILLE_PAGE = 8;

function joursDepuisPublication(iso: string | null): number | null {
    if (!iso) return null;
    const diffMs = Date.now() - new Date(iso).getTime();
    return Math.floor(diffMs / 86400000);
}

function formatAnciennete(jours: number | null): string {
    if (jours === null) return "";
    if (jours <= 0) return "Publiée aujourd'hui";
    if (jours === 1) return "Publiée hier";
    return `Publiée il y a ${jours} j`;
}

function formatSalaire(offre: OffreDTO): string {
    if (!offre.salaireVisible) return "Salaire non communiqué";
    return `${offre.salaireMin ?? "-"} - ${offre.salaireMax ?? "-"} ${offre.devise ?? ""}`;
}

export function OffresPubliquesPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

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

    useEffect(() => {
        listerSecteursDisponibles()
            .then(setSecteurs)
            .catch(() => setSecteurs([]));
    }, []);

    useEffect(() => {
        async function charger() {
            setLoading(true);
            try {
                const data = await listerOffresPubliques(page, TAILLE_PAGE, {
                    recherche: rechercheAppliquee,
                    secteurActivite: secteurSelectionne,
                });
                setOffres(data.content);
                setTotalPages(data.totalPages);
            } catch {
                setError("Impossible de charger les offres pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [page, rechercheAppliquee, secteurSelectionne]);

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

    function handlePostuler(e: React.MouseEvent, id: number) {
        e.preventDefault();
        e.stopPropagation();
        if (!estCandidat) {
            navigate("/connexion");
            return;
        }
        navigate(`/offres/${id}`, { state: { ouvrirCandidature: true } });
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Offres d'emploi</h1>
                    <p className="offres-page__subtitle">Découvrez les opportunités disponibles au Sénégal.</p>
                </div>
            </div>

            <form className="offres-filtres" onSubmit={lancerRecherche}>
                <div className="offres-filtres__search">
                    <svg className="offres-filtres__search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                    <svg className="offres-filtres__select-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="offres-filtres__actions">
                    <button type="submit" className="btn-gold">
                        Rechercher
                    </button>
                    {filtresActifs && (
                        <button type="button" className="btn-secondary" onClick={reinitialiserFiltres}>
                            Réinitialiser
                        </button>
                    )}
                </div>
            </form>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-skeleton-grid">
                    {Array.from({ length: TAILLE_PAGE }).map((_, i) => (
                        <div key={i} className="offre-skeleton" />
                    ))}
                </div>
            ) : offres.length === 0 ? (
                <div className="offres-page__empty">
                    <div className="offres-page__empty-icon" />
                    <p className="offres-page__empty-title">
                        {filtresActifs ? "Aucune offre ne correspond à votre recherche." : "Aucune offre disponible pour le moment."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="home-jobs-grid offres-jobs-grid">
                        {offres.map((offre) => {
                            const couleur = getCouleurContrat(offre.typeContrat);
                            const jours = joursDepuisPublication(offre.datePublication);
                            const estRecente = jours !== null && jours <= 2;
                            const lieu = [offre.ville, offre.region, offre.pays].filter(Boolean).join(", ") || "Non précisé";
                            const competences = (offre.competences ?? []).slice(0, 3);

                            return (
                                <article
                                    key={offre.id}
                                    className="job-pass"
                                    style={{ "--job-color": couleur.bar } as React.CSSProperties}
                                    onClick={() => navigate(`/offres/${offre.id}`)}
                                >
                                    {estRecente && <span className="job-pass__new">Nouveau</span>}

                                    <div className="job-pass__top">
                                        <LogoEntreprise
                                            recruteurId={offre.recruteurId}
                                            logoPresent={offre.logoPresent}
                                            nomEntreprise={offre.nomEntreprise}
                                            className="job-pass__logo"
                                        />
                                        <div className="job-pass__id">
                                            <p className="job-pass__eyebrow">
                                                {offre.secteurActivite ?? "Secteur non précisé"}
                                                {jours !== null && <> · {formatAnciennete(jours)}</>}
                                            </p>
                                            <h3>{offre.titre}</h3>
                                            <p className="job-pass__company">{offre.nomEntreprise ?? "Entreprise"}</p>
                                        </div>
                                    </div>

                                    <div className="job-pass__tags">
                                        <span className="job-pass__tag job-pass__tag--solid">
                                            {LABELS_TYPE_CONTRAT[offre.typeContrat]}
                                        </span>
                                        {offre.teletravail && <span className="job-pass__tag">Télétravail</span>}
                                        {offre.hybride && <span className="job-pass__tag">Hybride</span>}
                                        {offre.niveauExperience && (
                                            <span className="job-pass__tag">{LABELS_NIVEAU_EXPERIENCE[offre.niveauExperience]}</span>
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
                                            {formatSalaire(offre)}
                                        </span>
                                    </div>

                                    <div className="job-pass__actions">
                                        <Link
                                            to={`/offres/${offre.id}`}
                                            className="job-pass__btn job-pass__btn--ghost"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Voir détail
                                        </Link>
                                        {offre.statut === "PUBLIEE" && (
                                            <button
                                                className="job-pass__btn job-pass__btn--gold"
                                                onClick={(e) => handlePostuler(e, offre.id)}
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
                        <div className="offres-pagination">
                            <button className="btn-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                                Précédent
                            </button>
                            <span className="offres-pagination__info">
                                Page {page + 1} / {totalPages}
                            </span>
                            <button className="btn-secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}