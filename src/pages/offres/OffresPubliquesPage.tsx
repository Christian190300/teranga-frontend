import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    listerOffresPubliques,
    listerSecteursDisponibles,
    LABELS_TYPE_CONTRAT,
    type OffreDTO,
} from "../../api/offreService";
import { useAuth } from "../../context/AuthContext";
import { LogoEntreprise } from "../../components/common/LogoEntreprise";
import { getCouleurContrat } from "./offreColors";
import "./offres.css";

const TAILLE_PAGE = 8;

function formatSalaire(offre: OffreDTO): string | null {
    if (!offre.salaireVisible || (!offre.salaireMin && !offre.salaireMax)) return null;
    const devise = offre.devise ?? "FCFA";
    if (offre.salaireMin && offre.salaireMax) return `${offre.salaireMin.toLocaleString()} - ${offre.salaireMax.toLocaleString()} ${devise}`;
    return `${(offre.salaireMin ?? offre.salaireMax)?.toLocaleString()} ${devise}`;
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

    function ouvrirDetail(id: number) {
        navigate(`/offres/${id}`);
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
                    <div className="offres-grid">
                        {offres.map((offre) => {
                            const couleur = getCouleurContrat(offre.typeContrat);
                            const lieu = [offre.ville, offre.pays].filter(Boolean).join(", ");
                            const salaire = formatSalaire(offre);
                            return (
                                <div
                                    key={offre.id}
                                    role="button"
                                    tabIndex={0}
                                    className="offre-tile"
                                    style={
                                        {
                                            "--offre-color": couleur.bar,
                                            "--offre-color-soft": couleur.bg,
                                        } as React.CSSProperties
                                    }
                                    onClick={() => ouvrirDetail(offre.id)}
                                    onKeyDown={(e) => e.key === "Enter" && ouvrirDetail(offre.id)}
                                >
                                    <div className="offre-tile__top">
                                        <LogoEntreprise
                                            recruteurId={offre.recruteurId}
                                            logoPresent={offre.logoPresent}
                                            nomEntreprise={offre.nomEntreprise}
                                            className="offre-tile__logo"
                                        />
                                        <div className="offre-tile__entreprise">
                                            <p className="offre-tile__nom-entreprise">{offre.nomEntreprise || "Entreprise inconnue"}</p>
                                        </div>
                                    </div>

                                    <p className="offre-tile__titre">{offre.titre}</p>
                                    <p className="offre-tile__lieu">{lieu || "Lieu non précisé"}</p>

                                    <div className="offre-tile__tags">
                                        <span className="offre-tile__tag">{LABELS_TYPE_CONTRAT[offre.typeContrat]}</span>
                                        {offre.teletravail && <span className="offre-tile__tag offre-tile__tag--gold">Télétravail</span>}
                                        {offre.hybride && <span className="offre-tile__tag offre-tile__tag--gold">Hybride</span>}
                                    </div>

                                    <div className="offre-tile__footer">
                                        {salaire ? (
                                            <span className="offre-tile__salaire">{salaire}</span>
                                        ) : (
                                            <span className="offre-tile__salaire-vide">Salaire non communiqué</span>
                                        )}
                                    </div>

                                    <div className="offre-tile__actions">
                                        <button
                                            className="btn-secondary offre-tile__voir-detail"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                ouvrirDetail(offre.id);
                                            }}
                                        >
                                            Voir détail
                                        </button>
                                        {estCandidat && offre.statut === "PUBLIEE" && (
                                            <button
                                                className="btn-gold offre-tile__postuler"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    ouvrirDetail(offre.id);
                                                }}
                                            >
                                                Postuler
                                            </button>
                                        )}
                                    </div>
                                </div>
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