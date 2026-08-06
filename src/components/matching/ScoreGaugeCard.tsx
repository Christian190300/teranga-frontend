interface ScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

function couleurScore(score: number): string {
    if (score >= 75) return "#16a34a";
    if (score >= 50) return "#ea580c";
    return "#dc2626";
}

/**
 * Jauge circulaire de compatibilité — anneau progressif autour d'un pourcentage central.
 * Remplace le pill ScoreCompatibilite dans les vues "cartes" (candidats matchés, offres recommandées).
 */
export function ScoreGauge({ score, size = 110, strokeWidth = 10 }: ScoreGaugeProps) {
    const arrondi = Math.round(score);
    const rayon = (size - strokeWidth) / 2;
    const circonference = 2 * Math.PI * rayon;
    const offset = circonference * (1 - arrondi / 100);
    const couleur = couleurScore(arrondi);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${arrondi}% de compatibilité`}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={rayon}
                fill="none"
                stroke={`${couleur}33`}
                strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={rayon}
                fill="none"
                stroke={couleur}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circonference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.22}
                fontWeight={700}
                fill="#1f2937"
            >
                {arrondi}%
            </text>
        </svg>
    );
}