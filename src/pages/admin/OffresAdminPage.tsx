import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listerToutesOffresAdmin, supprimerOffre, LABELS_TYPE_CONTRAT, type OffreDTO } from "../../api/offreService";
import { StatutOffreBadge } from "../../components/common/StatutOffreBadge";
import "./offresAdmin.css";

const TAILLE_PAGE = 15;

const OPTIONS_TRI = [
    { valeur: "dateCreation,desc", label: "Plus récentes d'abord" },
    { valeur: "dateCreation,asc", label: "Plus anciennes d'abord" },
    { valeur: "titre,asc", label: "Titre (A → Z)" },
    { valeur: "titre,desc", label: "Titre (Z → A)" },
    { valeur: "nombreVues,desc", label: "Plus vues d'abord" },
    { valeur: "nombreVues,asc", label: "Moins vues d'abord" },
] as const;

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

    const [recherche, setRecherche] = useState("");
    const [rechercheDebattue, setRechercheDebattue] = useState("");
    const [tri, setTri] = useState<string>(OPTIONS_TRI[0].valeur);

    useEffect(() => {
        const handle = setTimeout(() => setRechercheDebattue(recherche.trim()), 350);
        return () => clearTimeout(handle);
    }, [recherche]);

    async function charger(p: number, rechercheActuelle: string, triActuel: string) {
        setLoading(true);
        try {
            const data = await listerToutesOffresAdmin(p, TAILLE_PAGE, {
                recherche: rechercheActuelle || undefined,
                sort: triActuel,
            });
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
        setPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rechercheDebattue, tri]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        charger(page, rechercheDebattue, tri);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rechercheDebattue, tri]);

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

    // Répartition par statut sur la page courante — repère rapide, pas un total exact
    // (l'API ne renvoie pas de comptage global par statut pour l'instant).
    const repartition = useMemo(() => {
        const compte: Record<string, number> = {};
        for (const o of offres) {
            compte[o.statut] = (compte[o.statut] ?? 0) + 1;
        }
        return compte;
    }, [offres]);

    return (
        <div className="mod-page">
            <div className="mod-page__head">
                <div>
                    <h1 className="mod-page__title">Modération des offres</h1>
                    <p className="mod-page__count">{totalElements} offre{totalElements > 1 ? "s" : ""} au total</p>
                </div>
                {offres.length > 0 && (
                    <div className="mod-page__breakdown">
                        {Object.entries(repartition).map(([statut, n]) => (
                            <span key={statut} className="mod-page__breakdown-item">
                                <span className={`mod-dot mod-dot--${statut.toLowerCase()}`} />
                                {n} {statut.toLowerCase()}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mod-toolbar">
                <input
                    className="mod-toolbar__search"
                    placeholder="Rechercher par titre ou ville..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <select className="mod-toolbar__sort" value={tri} onChange={(e) => setTri(e.target.value)}>
                    {OPTIONS_TRI.map((option) => (
                        <option key={option.valeur} value={option.valeur}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="mod-alert">{error}</div>}

            {loading ? (
                <div className="mod-state">Chargement des offres...</div>
            ) : offres.length === 0 ? (
                <div className="mod-state">Aucune offre ne correspond à ta recherche.</div>
            ) : (
                <>
                    <div className="mod-grid">
                        {offres.map((offre) => {
                            const lieu = [offre.ville, offre.pays].filter(Boolean).join(", ");
                            return (
                                <Link to={`/offres/${offre.id}`} className="mod-card" key={offre.id}>
                                    <div className="mod-card__top">
                                        <span className="mod-card__logo">{initiales(offre.nomEntreprise)}</span>
                                        <div className="mod-card__heading">
                                            <span className="mod-card__titre">{offre.titre}</span>
                                            <span className="mod-card__entreprise">
                                                {offre.nomEntreprise ?? "Entreprise inconnue"}
                                                {offre.source && <span className="mod-card__source"> · importée ({offre.source})</span>}
                                            </span>
                                        </div>
                                        <StatutOffreBadge statut={offre.statut} />
                                    </div>

                                    <div className="mod-card__meta">
                                        <span className="mod-card__meta-item">
                                            <span className="mod-card__meta-label">Lieu</span>
                                            {lieu || "—"}
                                        </span>
                                        <span className="mod-card__meta-item">
                                            <span className="mod-card__meta-label">Contrat</span>
                                            {LABELS_TYPE_CONTRAT[offre.typeContrat]}
                                        </span>
                                        <span className="mod-card__meta-item">
                                            <span className="mod-card__meta-label">Vues</span>
                                            {(offre.nombreVues ?? 0).toLocaleString()}
                                        </span>
                                        <span className="mod-card__meta-item">
                                            <span className="mod-card__meta-label">Recruteur</span>
                                            {offre.recruteurId ? `${offre.recruteurId.slice(0, 8)}…` : "Import auto"}
                                        </span>
                                    </div>

                                    <div className="mod-card__footer">
                                        <button
                                            className="mod-delete"
                                            disabled={suppressionEnCours === offre.id}
                                            onClick={(e) => handleSupprimer(e, offre.id)}
                                        >
                                            {suppressionEnCours === offre.id ? "..." : "Supprimer"}
                                        </button>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="mod-pagination">
                            <button className="mod-page-btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                                Précédent
                            </button>
                            <span className="mod-pagination__info">
                                Page {page + 1} / {totalPages}
                            </span>
                            <button className="mod-page-btn" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}