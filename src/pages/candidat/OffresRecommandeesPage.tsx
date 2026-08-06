import { useEffect, useState } from "react";
import { obtenirOffresRecommandees } from "../../api/matchingService";
import type { MatchOffreDTO } from "../../api/matchingService";
import { OffreMatchCard } from "../../components/matching/OffreMatchCard";
import "../../components/matching/matching.css";

export function OffresRecommandeesPage() {
    const [matches, setMatches] = useState<MatchOffreDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function charger() {
            try {
                const data = await obtenirOffresRecommandees();
                setMatches(data);
            } catch {
                setError("Impossible de charger les offres recommandées. Complétez votre profil pour de meilleurs résultats.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, []);

    return (
        <div className="matching-page">
            <div className="matching-page__header">
                <div>
                    <span className="matching-page__eyebrow">Sélection personnalisée</span>
                    <h1 className="matching-page__title">Offres recommandées pour vous</h1>
                    <p className="matching-page__subtitle">
                        Classées selon la correspondance avec votre profil, vos compétences et votre expérience.
                    </p>
                </div>
            </div>

            {error && <div className="matching-message matching-message--error">{error}</div>}

            {loading ? (
                <div className="matching-list">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div className="match-card match-card--skeleton" key={i} />
                    ))}
                </div>
            ) : matches.length === 0 && !error ? (
                <div className="matching-empty">
                    <div className="matching-empty__icon" aria-hidden="true">
                        🎯
                    </div>
                    <p className="matching-empty__title">Aucune recommandation pour l'instant</p>
                    <p className="matching-empty__text">
                        Complétez votre profil (compétences, expérience, préférences) pour recevoir des suggestions
                        d'offres adaptées.
                    </p>
                </div>
            ) : (
                <div className="matching-list">
                    {matches.map((m) => (
                        <OffreMatchCard key={m.offre.id} match={m} />
                    ))}
                </div>
            )}
        </div>
    );
}