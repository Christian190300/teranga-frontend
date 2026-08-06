import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenirOffresRecommandees } from "../../api/matchingService";
import type { MatchOffreDTO } from "../../api/matchingService";
import { ScoreCompatibilite } from "../../components/matching/ScoreCompatibilite";

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
            <div className="offre-form-card">
                {matches.map((m) => (
                    <Link
                        key={m.offre.id}
                        to={`/offres/${m.offre.id}`}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 0",
                            borderBottom: "1px solid #eee",
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <div>
                            <strong>{m.offre.titre}</strong>
                            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                {m.offre.ville}, {m.offre.pays} · {m.offre.typeContrat}
                            </p>
                        </div>
                        <ScoreCompatibilite score={m.score} />
                    </Link>
                ))}
            </div>
        </div>
    );
}