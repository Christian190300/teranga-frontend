import { Link } from "react-router-dom";
import type { MatchCandidatDTO } from "../../api/matchingService";
import { ScoreGauge } from "./ScoreGauge";
import "./matching.css";

function initiales(texte: string | null): string {
    if (!texte) return "?";
    const mots = texte.trim().split(/\s+/).slice(0, 2);
    return mots.map((m) => m[0]?.toUpperCase() ?? "").join("") || "?";
}

function formatDate(dateIso: string | null): string | null {
    if (!dateIso) return null;
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("fr-FR");
}

interface CandidatMatchCardProps {
    match: MatchCandidatDTO;
}

export function CandidatMatchCard({ match }: CandidatMatchCardProps) {
    const { profilCandidat, score } = match;
    const localisation = [profilCandidat.ville, profilCandidat.pays].filter(Boolean).join(", ");
    const majLe = formatDate(profilCandidat.dateMaj);

    return (
        <div className="match-card">
            <div className="match-card__body">
                <div className="match-card__avatar">{initiales(profilCandidat.titreProfessionnel)}</div>

                <div className="match-card__infos">
                    <h3 className="match-card__titre">{profilCandidat.titreProfessionnel || "Candidat"}</h3>
                    <p className="match-card__meta">
                        {profilCandidat.anneesExperience != null && (
                            <span>{profilCandidat.anneesExperience} an(s) d'expérience</span>
                        )}
                        {majLe && <span>Profil mis à jour le {majLe}</span>}
                    </p>
                    {profilCandidat.aPropos && (
                        <p className="match-card__description">{profilCandidat.aPropos}</p>
                    )}
                    {localisation && (
                        <p className="match-card__region">
                            <strong>Région de :</strong> {localisation}
                        </p>
                    )}
                </div>

                <div className="match-card__score">
                    <ScoreGauge score={score} />
                </div>
            </div>

            <div className="match-card__footer">
                <Link to={`/recruteur/candidats/${profilCandidat.id}`} className="btn-primary btn-rounded">
                    Voir le profil
                </Link>
            </div>
        </div>
    );
}