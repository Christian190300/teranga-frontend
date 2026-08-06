import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenirCandidatsPourOffre } from "../../api/matchingService";
import type { MatchCandidatDTO } from "../../api/matchingService";
import { CandidatMatchCard } from "../../components/matching/CandidatMatchCard";

export function CandidatsMatchesPage() {
    const { id } = useParams<{ id: string }>();
    const [matches, setMatches] = useState<MatchCandidatDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function charger() {
            try {
                const data = await obtenirCandidatsPourOffre(Number(id));
                setMatches(data);
            } catch {
                setError("Impossible de charger les candidats.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [id]);

    if (loading) return <div>Chargement des candidats...</div>;
    if (error) return <div className="offre-message--error">{error}</div>;

    return (
        <div className="offres-page">
            <h1 className="offres-page__title">Candidats correspondants</h1>
            {matches.length === 0 && <p>Aucun candidat dans la base pour le moment.</p>}
            {matches.map((m) => (
                <CandidatMatchCard key={m.profilCandidat.id} match={m} />
            ))}
        </div>
    );
}