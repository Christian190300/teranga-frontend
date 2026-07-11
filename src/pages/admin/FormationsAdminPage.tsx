import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    listerFormationsAdmin,
    supprimerFormation,
    LABELS_CATEGORIE,
    LABELS_NIVEAU_FORMATION,
    type FormationDTO,
} from "../../api/formationAdminService";
import "../public/offres.css";
import "./formationAdmin.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function FormationsAdminPage() {
    const [formations, setFormations] = useState<FormationDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [suppressionEnCoursId, setSuppressionEnCoursId] = useState<number | null>(null);

    useEffect(() => {
        charger();
    }, []);

    async function charger() {
        setLoading(true);
        try {
            const data = await listerFormationsAdmin();
            setFormations(data);
        } catch {
            setError("Impossible de charger les formations pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSupprimer(id: number, titre: string) {
        if (!window.confirm(`Supprimer définitivement la formation « ${titre} » ? Cette action est irréversible.`)) {
            return;
        }
        setSuppressionEnCoursId(id);
        try {
            await supprimerFormation(id);
            setFormations((prev) => prev.filter((f) => f.id !== id));
        } catch {
            setError("Impossible de supprimer cette formation pour le moment.");
        } finally {
            setSuppressionEnCoursId(null);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Mes formations</h1>
                    <p className="offres-page__subtitle">Gérez le catalogue de formations Teranga Sénégal.</p>
                </div>
                <Link to="/admin/formations/nouvelle" className="btn-primary">
                    + Nouvelle formation
                </Link>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : formations.length === 0 ? (
                <div className="candidature-page__empty">
                    <p style={{ marginBottom: 16 }}>Aucune formation créée pour le moment.</p>
                    <Link to="/admin/formations/nouvelle" className="btn-primary">
                        Créer ma première formation
                    </Link>
                </div>
            ) : (
                formations.map((formation) => (
                    <div className="formation-admin-row" key={formation.id}>
                        <div className="formation-admin-row__top">
                            <div>
                                <p className="formation-admin-row__titre">{formation.titre}</p>
                                <p className="formation-admin-row__meta">
                                    {LABELS_CATEGORIE[formation.categorie]} · {LABELS_NIVEAU_FORMATION[formation.niveau]}
                                    {formation.formateur ? ` · ${formation.formateur}` : ""}
                                </p>
                            </div>
                            <div className="formation-admin-row__badges">
                                <span className={`statut-badge ${formation.visible ? "statut-badge--publiee" : "statut-badge--brouillon"}`}>
                                    {formation.visible ? "Visible" : "Masquée"}
                                </span>
                                <span className="statut-badge statut-badge--envoyee">
                                    {formation.gratuite ? "Gratuite" : `${formation.prix} FCFA`}
                                </span>
                            </div>
                        </div>

                        <div className="formation-admin-row__stats">
                            <div className="formation-admin-row__stat">
                                <span className="formation-admin-row__stat-valeur">{formation.nombreChapitres}</span>
                                <span className="formation-admin-row__stat-label">chapitre(s)</span>
                            </div>
                            <div className="formation-admin-row__stat">
                                <span className="formation-admin-row__stat-valeur">{formation.nombreInscrits}</span>
                                <span className="formation-admin-row__stat-label">inscrit(s)</span>
                            </div>
                            <div className="formation-admin-row__stat">
                                <span className="formation-admin-row__stat-valeur">{formation.dureeMinutes ?? "—"}</span>
                                <span className="formation-admin-row__stat-label">minute(s)</span>
                            </div>
                            <div className="formation-admin-row__stat">
                                <span className="formation-admin-row__stat-valeur">{formatDate(formation.dateCreation)}</span>
                                <span className="formation-admin-row__stat-label">créée le</span>
                            </div>
                        </div>

                        <div className="offre-card__actions">
                            <Link to={`/admin/formations/${formation.id}/modifier`} className="btn-secondary">
                                Modifier
                            </Link>
                            <button
                                className="btn-secondary btn-danger"
                                onClick={() => handleSupprimer(formation.id, formation.titre)}
                                disabled={suppressionEnCoursId === formation.id}
                            >
                                {suppressionEnCoursId === formation.id ? "Suppression..." : "Supprimer"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}