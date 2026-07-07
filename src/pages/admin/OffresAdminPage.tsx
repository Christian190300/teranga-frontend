import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listerToutesOffresAdmin, supprimerOffre, LABELS_TYPE_CONTRAT, type OffreDTO } from "../../api/offreService";
import { StatutOffreBadge } from "../../components/common/StatutOffreBadge";
import "../offres/offres.css";

const TAILLE_PAGE = 9;

function initiales(nom: string | null): string {
    if (!nom) return "?";
    return nom.slice(0, 2).toUpperCase();
}

export function OffresAdminPage() {
    const [offres, setOffres] = useState<OffreDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [suppressionEnCours, setSuppressionEnCours] = useState<number | null>(null);

    async function charger(p: number) {
        setLoading(true);
        try {
            const data = await listerToutesOffresAdmin(p, TAILLE_PAGE);
            setOffres(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setError("Impossible de charger les offres pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        charger(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    async function handleSupprimer(e: React.MouseEvent, id: number) {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Supprimer définitivement cette offre ? Cette action est irréversible.")) return;
        setSuppressionEnCours(id);
        try {
            await supprimerOffre(id);
            setOffres((prev) => prev.filter((o) => o.id !== id));
            setTotalElements((prev) => prev - 1);
        } catch {
            setError("Impossible de supprimer cette offre.");
        } finally {
            setSuppressionEnCours(null);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Modération des offres</h1>
                    <p className="offres-page__subtitle">{totalElements} offre(s) au total, tous statuts confondus.</p>
                </div>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement des offres...</div>
            ) : offres.length === 0 ? (
                <div className="offres-page__empty">Aucune offre pour le moment.</div>
            ) : (
                <>
                    <div className="offres-grid">
                        {offres.map((offre) => {
                            const lieu = [offre.ville, offre.pays].filter(Boolean).join(", ");
                            return (
                                <Link to={`/offres/${offre.id}`} className="offre-tile" key={offre.id}>
                                    <div className="offre-tile__top">
                                        <div className="offre-tile__logo">{initiales(offre.nomEntreprise)}</div>
                                        <div className="offre-tile__entreprise" style={{ flex: 1 }}>
                                            <p className="offre-tile__nom-entreprise">{offre.nomEntreprise ?? "Entreprise inconnue"}</p>
                                            <p className="offre-tile__titre">{offre.titre}</p>
                                        </div>
                                        <StatutOffreBadge statut={offre.statut} />
                                    </div>

                                    <p className="offre-tile__lieu">{lieu || "Lieu non précisé"}</p>

                                    <div className="offre-tile__tags">
                                        <span className="offre-tile__tag">{LABELS_TYPE_CONTRAT[offre.typeContrat]}</span>
                                    </div>

                                    <div className="offre-tile__footer">
                                        <span className="offre-tile__date">Recruteur : {offre.recruteurId.slice(0, 8)}…</span>
                                        <button
                                            className="btn-secondary btn-danger"
                                            disabled={suppressionEnCours === offre.id}
                                            onClick={(e) => handleSupprimer(e, offre.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </Link>
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