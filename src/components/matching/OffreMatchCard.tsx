import { Link } from "react-router-dom";
import type { MatchOffreDTO } from "../../api/matchingService";
import { obtenirLogoEntreprisePublicUrl } from "../../api/profileService";
import { LABELS_TYPE_CONTRAT } from "../../api/offreService";
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

interface OffreMatchCardProps {
    match: MatchOffreDTO;
}

export function OffreMatchCard({ match }: OffreMatchCardProps) {
    const { offre, score } = match;
    const localisation = [offre.ville, offre.pays].filter(Boolean).join(", ");
    const publieeLe = formatDate(offre.datePublication);

    return (
        <div className="match-card">
            <div className="match-card__body">
                <div className="match-card__logo">
                    {offre.logoPresent ? (
                        <img src={obtenirLogoEntreprisePublicUrl(offre.recruteurId)} alt={offre.nomEntreprise ?? "Entreprise"} />
                    ) : (
                        <div className="match-card__avatar">{initiales(offre.nomEntreprise)}</div>
                    )}
                </div>

                <div className="match-card__infos">
                    <h3 className="match-card__titre">{offre.titre}</h3>
                    {offre.nomEntreprise && <p className="match-card__entreprise">{offre.nomEntreprise}</p>}
                    <p className="match-card__meta">
                        <span>{LABELS_TYPE_CONTRAT[offre.typeContrat]}</span>
                        {publieeLe && <span>{publieeLe}</span>}
                    </p>
                    {offre.description && <p className="match-card__description">{offre.description}</p>}
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
                <Link to={`/offres/${offre.id}`} className="btn-primary btn-rounded">
                    Voir le détail
                </Link>
            </div>
        </div>
    );
}