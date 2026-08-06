import { useEffect, useState } from "react";
import { obtenirOffresRecommandees } from "../../api/matchingService";
import type { MatchOffreDTO } from "../../api/matchingService";
import { OffreMatchCard } from "../../components/matching/OffreMatchCard";

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

    if (loading) return <div>Chargement des recommandations...</div>;
    if (error) return <div className="offre-message--error">{error}</div>;

    return (
        <div className="offres-page">
            <h1 className="offres-page__title">Offres recommandées pour vous</h1>
            {matches.length === 0 && <p>Aucune offre disponible pour le moment.</p>}
            {matches.map((m) => (
                <OffreMatchCard key={m.offre.id} match={m} />
            ))}
        </div>
    );
}