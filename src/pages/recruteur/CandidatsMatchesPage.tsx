import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenirCandidatsPourOffre } from "../../api/matchingService";
import type { MatchCandidatDTO } from "../../api/matchingService";
import { ScoreCompatibilite } from "../../components/matching/ScoreCompatibilite";

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
            <div className="offre-form-card">
                {matches.map((m) => (
                    <div
                        key={m.profilCandidat.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 0",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <div>
                            <strong>{m.profilCandidat.titreProfessionnel || "Candidat"}</strong>
                            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                {m.profilCandidat.ville}, {m.profilCandidat.pays} · {m.profilCandidat.anneesExperience ?? 0} an(s) d'expérience
                            </p>
                        </div>
                        <ScoreCompatibilite score={m.score} />
                    </div>
                ))}
            </div>
        </div>
    );
}