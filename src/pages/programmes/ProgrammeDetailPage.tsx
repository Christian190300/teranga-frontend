import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenirProgrammePublic, urlImageProgrammePublique, type ProgrammeDTO } from "../../api/programmeService";
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

    if (loading) return <div className="offre-detail__loading">Chargement...</div>;
    if (error || !programme) return <div className="offre-detail__error">{error ?? "Programme introuvable."}</div>;

    return (
        <div className="offre-detail">
            <Link to="/programmes" className="offre-detail__back">
                ← Tous les programmes
            </Link>

            <div className="offre-detail__header">
                {programme.imagePresente && (
                    <img
                        src={urlImageProgrammePublique(programme.id)}
                        alt={programme.titre}
                        className="prog-detail__cover"
                    />
                )}
                <h1 className="offre-detail__titre" style={{ color: "var(--navy-ink)" }}>
                    {programme.titre}
                </h1>
                <p className="offre-detail__lieu">
                    Débute le {formatDate(programme.dateDebut)}
                    {programme.dateFin && ` · jusqu'au ${formatDate(programme.dateFin)}`}
                    {programme.formateur && ` · animé par ${programme.formateur}`}
                </p>
            </div>

            {programme.description && (
                <div className="offre-detail__section">
                    <h2 className="offre-detail__section-title">Description</h2>
                    <p className="offre-detail__text">{programme.description}</p>
                </div>
            )}

            {programme.constatTitre && (
                <div className="offre-detail__section prog-bloc">
                    <h2 className="offre-detail__section-title">Le constat</h2>
                    <h3 className="prog-bloc__titre">{programme.constatTitre}</h3>
                    {programme.constatTexte && <p className="offre-detail__text">{programme.constatTexte}</p>}

                    {programme.constatEtapes.length > 0 && (
                        <div className="prog-bloc__etapes">
                            {programme.constatEtapes.map((etape, i) => (
                                <div className="prog-bloc__etape" key={i}>
                                    <span className="prog-bloc__etape-titre">{etape.titre}</span>
                                    {etape.sousTitre && <span className="prog-bloc__etape-sous">{etape.sousTitre}</span>}
                                </div>
                            ))}
                        </div>
                    )}

                    {programme.constatPoints.length > 0 && (
                        <div className="prog-bloc__points">
                            {programme.constatPoints.map((point, i) => (
                                <div className="prog-bloc__point" key={i}>
                                    <h4>{point.titre}</h4>
                                    {point.description && <p>{point.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {programme.programmeTitre && (
                <div className="offre-detail__section prog-bloc prog-bloc--accent">
                    <h2 className="offre-detail__section-title">Le programme</h2>
                    <h3 className="prog-bloc__titre">{programme.programmeTitre}</h3>
                    {programme.programmeTexte && <p className="offre-detail__text">{programme.programmeTexte}</p>}

                    {programme.programmeEtapes.length > 0 && (
                        <div className="prog-bloc__etapes">
                            {programme.programmeEtapes.map((etape, i) => (
                                <div className="prog-bloc__etape" key={i}>
                                    <span className="prog-bloc__etape-titre">{etape.titre}</span>
                                    {etape.sousTitre && <span className="prog-bloc__etape-sous">{etape.sousTitre}</span>}
                                </div>
                            ))}
                        </div>
                    )}

                    {programme.programmeApports.length > 0 && (
                        <div className="prog-bloc__points">
                            {programme.programmeApports.map((point, i) => (
                                <div className="prog-bloc__point" key={i}>
                                    <h4>{point.titre}</h4>
                                    {point.description && <p>{point.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {programme.lien && (
                <div className="offre-detail__cta">
                    <span className="offre-detail__cta-info">Pour en savoir plus ou candidater</span>
                    <a href={programme.lien} target="_blank" rel="noopener noreferrer" className="btn-gold">
                        Accéder au programme
                    </a>
                </div>
            )}
        </div>
    );
}