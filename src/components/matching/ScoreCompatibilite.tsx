interface ScoreCompatibiliteProps {
    score: number;
}

function couleurScore(score: number): string {
    if (score >= 75) return "#16a34a";
    if (score >= 50) return "#d97706";
    return "#dc2626";
}

export function ScoreCompatibilite({ score }: ScoreCompatibiliteProps) {
    const arrondi = Math.round(score);
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 12px",
                borderRadius: 999,
                backgroundColor: `${couleurScore(score)}1a`,
                color: couleurScore(score),
                fontWeight: 600,
                fontSize: 14,
            }}
            title="Score de compatibilité"
        >
            {arrondi}% de compatibilité
        </div>
    );
}