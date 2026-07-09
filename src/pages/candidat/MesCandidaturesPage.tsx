import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    listerMesCandidatures,
    retirerCandidature,
    LABELS_STATUT_CANDIDATURE,
    type CandidatureDTO,
} from "../../api/candidatureService";
import "../public/offres.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function classeBadge(statut: string): string {
    return `statut-badge statut-badge--${statut.toLowerCase()}`;
}

export function MesCandidaturesPage() {
    const [candidatures, setCandidatures] = useState<CandidatureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retraitEnCoursId, setRetraitEnCoursId] = useState<number | null>(null);

    useEffect(() => {
        charger();
    }, []);

    async function charger() {
        setLoading(true);
        try {
            const data = await listerMesCandidatures();
            setCandidatures(data);
        } catch {
            setError("Impossible de charger vos candidatures pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRetirer(id: number) {
        setRetraitEnCoursId(id);
        try {
            await retirerCandidature(id);
            setCandidatures((prev) => prev.filter((c) => c.id !== id));
        } catch {
            setError("Impossible de retirer cette candidature pour le moment.");
        } finally {
            setRetraitEnCoursId(null);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Mes candidatures</h1>
                    <p className="offres-page__subtitle">Suivez l'état de vos candidatures envoyées.</p>
                </div>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : candidatures.length === 0 ? (
                <div className="candidature-page__empty">
                    <p style={{ marginBottom: 16 }}>Vous n'avez encore postulé à aucune offre.</p>
                    <Link to="/offres" className="btn-primary">
                        Voir les offres disponibles
                    </Link>
                </div>
            ) : (
                candidatures.map((c) => (
                    <div className="candidature-row" key={c.id}>
                        <div className="candidature-row__top">
                            <div>
                                <p className="candidature-row__titre">{c.offreTitre ?? "Offre supprimée"}</p>
                                <p className="candidature-row__meta">Envoyée le {formatDate(c.dateCandidature)}</p>
                            </div>
                            <span className={classeBadge(c.statut)}>{LABELS_STATUT_CANDIDATURE[c.statut]}</span>
                        </div>

                        {c.message && <p className="candidature-row__message">{c.message}</p>}

                        <div className="candidature-row__actions">
                            {c.offreId && (
                                <Link to={`/offres/${c.offreId}`} className="btn-secondary">
                                    Voir l'offre
                                </Link>
                            )}
                            {c.statut !== "RETIREE" && (
                                <button
                                    className="btn-secondary btn-danger"
                                    onClick={() => handleRetirer(c.id)}
                                    disabled={retraitEnCoursId === c.id}
                                >
                                    {retraitEnCoursId === c.id ? "Retrait..." : "Retirer ma candidature"}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}