import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenirProgrammePublic, urlImageProgrammePublique, type ProgrammeDTO } from "../api/programmeService";
import "./programmes.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function ProgrammeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [programme, setProgramme] = useState<ProgrammeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        obtenirProgrammePublic(Number(id))
            .then(setProgramme)
            .catch(() => setError("Ce programme est introuvable ou n'est plus disponible."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="prog-detail__loading">Chargement...</div>;
    }

    if (error || !programme) {
        return (
            <div className="prog-detail__loading">
                {error ?? "Programme introuvable."}
                <div style={{ marginTop: 16 }}>
                    <Link to="/programmes" className="prog-detail__retour">
                        ← Tous les programmes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="prog-detail">
            <Link to="/programmes" className="prog-detail__retour">
                ← Tous les programmes
            </Link>

            <div className="prog-detail__media">
                {programme.imagePresente ? (
                    <img src={urlImageProgrammePublique(programme.id)} alt={programme.titre} className="prog-detail__image" />
                ) : (
                    <div className="prog-detail__image prog-detail__image--placeholder" />
                )}
                <div className="prog-detail__scrim" />
                <div className="prog-detail__media-content">
                    <p className="prog-detail__eyebrow">Programme d'insertion professionnelle</p>
                    <h1 className="prog-detail__titre">{programme.titre}</h1>
                    <p className="prog-detail__date">
                        Débute le {formatDate(programme.dateDebut)}
                        {programme.dateFin && ` · jusqu'au ${formatDate(programme.dateFin)}`}
                    </p>
                </div>
            </div>

            <div className="prog-detail__body">
                {programme.formateur && (
                    <div className="prog-detail__chips">
                        <span className="prog-detail__chip">
                            <span className="prog-detail__chip-label">Animé par</span>
                            {programme.formateur}
                        </span>
                    </div>
                )}

                {programme.description && (
                    <div className="prog-detail__section">
                        <p className="prog-detail__section-label">À propos</p>
                        {programme.description
                            .split("\n")
                            .map((ligne) => ligne.trim())
                            .filter((ligne) => ligne.length > 0)
                            .map((ligne, index) => (
                                <p className="prog-detail__desc" key={index}>
                                    {ligne}
                                </p>
                            ))}
                    </div>
                )}

                {programme.lien && (
                    <div className="prog-detail__cta">
                        <a href={programme.lien} target="_blank" rel="noopener noreferrer" className="prog-detail__lien">
                            Accéder au programme →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}