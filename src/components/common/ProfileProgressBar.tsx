// src/components/common/ProfileProgressBar.tsx
import "./ProfileProgressBar.css";

interface ProfileProgressBarProps {
    score: number; // Valeur de 0 à 100
    showDetails?: boolean;
}

export function ProfileProgressBar({ score, showDetails = true }: ProfileProgressBarProps) {
    // Calcul de la couleur selon le score
    const getColorClass = (val: number) => {
        if (val < 40) return "progress-bar--danger";
        if (val < 80) return "progress-bar--warning";
        return "progress-bar--success";
    };

    const getStatusLabel = (val: number) => {
        if (val < 40) return "Profil incomplet";
        if (val < 80) return "Profil intermédiaire";
        return "Profil optimisé";
    };

    return (
        <div className="profile-progress-container">
            <div className="profile-progress-header">
                <span className="profile-progress-title">Complétion du profil</span>
                <span className={`profile-progress-badge ${getColorClass(score)}`}>
                    {score}%
                </span>
            </div>

            <div className="profile-progress-track">
                <div
                    className={`profile-progress-fill ${getColorClass(score)}`}
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
            </div>

            {showDetails && (
                <p className="profile-progress-status">
                    Statut : <strong>{getStatusLabel(score)}</strong>
                </p>
            )}
        </div>
    );
}