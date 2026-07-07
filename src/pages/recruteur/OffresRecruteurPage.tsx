import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    listerMesOffres,
    publierOffre,
    fermerOffre,
    supprimerOffre,
    type OffreDTO,
} from "../../api/offreService";
import { StatutOffreBadge } from "../../components/common/StatutOffreBadge";
import "../offres/offres.css";

function formatSalaire(offre: OffreDTO): string | null {
    if (!offre.salaireVisible || (!offre.salaireMin && !offre.salaireMax)) return null;
    const devise = offre.devise ?? "FCFA";
    if (offre.salaireMin && offre.salaireMax) return `${offre.salaireMin.toLocaleString()} - ${offre.salaireMax.toLocaleString()} ${devise}`;
    return `${(offre.salaireMin ?? offre.salaireMax)?.toLocaleString()} ${devise}`;
}

export function OffresRecruteurPage() {
    const [offres, setOffres] = useState<OffreDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionEnCours, setActionEnCours] = useState<number | null>(null);

    async function charger() {
        setLoading(true);
        try {
            const data = await listerMesOffres();
            setOffres(data);
        } catch {
            setError("Impossible de charger vos offres pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        charger();
    }, []);

    async function handlePublier(id: number) {
        setActionEnCours(id);
        try {
            const updated = await publierOffre(id);
            setOffres((prev) => prev.map((o) => (o.id === id ? updated : o)));
        } catch {
            setError("Impossible de publier cette offre.");
        } finally {
            setActionEnCours(null);
        }
    }

    async function handleFermer(id: number) {
        setActionEnCours(id);
        try {
            const updated = await fermerOffre(id);
            setOffres((prev) => prev.map((o) => (o.id === id ? updated : o)));
        } catch {
            setError("Impossible de fermer cette offre.");
        } finally {
            setActionEnCours(null);
        }
    }

    async function handleSupprimer(id: number) {
        if (!window.confirm("Supprimer définitivement cette offre ?")) return;
        setActionEnCours(id);
        try {
            await supprimerOffre(id);
            setOffres((prev) => prev.filter((o) => o.id !== id));
        } catch {
            setError("Impossible de supprimer cette offre.");
        } finally {
            setActionEnCours(null);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Mes offres</h1>
                    <p className="offres-page__subtitle">Gérez vos offres publiées et vos brouillons.</p>
                </div>
                <Link to="/recruteur/offres/nouvelle" className="btn-primary">
                    + Publier une offre
                </Link>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement de vos offres...</div>
            ) : offres.length === 0 ? (
                <div className="offres-page__empty">Vous n'avez encore publié aucune offre.</div>
            ) : (
                offres.map((offre) => {
                    const salaire = formatSalaire(offre);
                    const enCours = actionEnCours === offre.id;
                    return (
                        <div className="offre-card" key={offre.id}>
                            <div className="offre-card__top">
                                <div>
                                    <p className="offre-card__titre">{offre.titre}</p>
                                    <p className="offre-card__entreprise">
                                        {[offre.ville, offre.pays].filter(Boolean).join(", ") || "Localisation non précisée"}
                                    </p>
                                </div>
                                <StatutOffreBadge statut={offre.statut} />
                            </div>

                            <div className="offre-card__meta">
                                <span className="offre-card__meta-item">{offre.typeContrat}</span>
                                {offre.teletravail && <span className="offre-card__meta-item">Télétravail</span>}
                                {offre.hybride && <span className="offre-card__meta-item">Hybride</span>}
                                {salaire && <span className="offre-card__meta-item">{salaire}</span>}
                            </div>

                            <div className="offre-card__actions">
                                <Link to={`/recruteur/offres/${offre.id}/modifier`} className="btn-secondary">
                                    Modifier
                                </Link>
                                {(offre.statut === "BROUILLON" || offre.statut === "FERMEE") && (
                                    <button className="btn-secondary" disabled={enCours} onClick={() => handlePublier(offre.id)}>
                                        Publier
                                    </button>
                                )}
                                {offre.statut === "PUBLIEE" && (
                                    <button className="btn-secondary" disabled={enCours} onClick={() => handleFermer(offre.id)}>
                                        Fermer
                                    </button>
                                )}
                                <button className="btn-secondary btn-danger" disabled={enCours} onClick={() => handleSupprimer(offre.id)}>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}