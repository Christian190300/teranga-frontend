// pages/programmes/ProgrammesPage.tsx
import { useEffect, useState } from "react";
import {
    listerProgrammesPublics,
    urlImageProgrammePublique,
    type ProgrammeDTO,
} from "../../api/programmeService";
import "./programmes.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function CalendarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 20c1.2-4 4.2-6 7-6s5.8 2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

/**
 * Bloc réutilisable pour "Le constat" / "Le programme" : reprend la
 * structure déjà utilisée sur la page de détail (mêmes classes prog-bloc*),
 * pour rester cohérent visuellement.
 */
function ProgrammeBloc({
                           titre,
                           texte,
                           etapes,
                           points,
                           accent,
                       }: {
    titre: string;
    texte?: string | null;
    etapes: { titre: string; sousTitre?: string | null }[];
    points: { titre: string; description?: string | null }[];
    accent?: boolean;
}) {
    return (
        <div className={`prog-bloc${accent ? " prog-bloc--accent" : ""}`}>
            <h3 className="prog-bloc__titre">{titre}</h3>
            {texte && <p className="prog-section__text">{texte}</p>}

            {etapes.length > 0 && (
                <div className="prog-bloc__etapes">
                    {etapes.map((etape, i) => (
                        <div className="prog-bloc__etape" key={i}>
                            <span className="prog-bloc__etape-titre">{etape.titre}</span>
                            {etape.sousTitre && <span className="prog-bloc__etape-sous">{etape.sousTitre}</span>}
                        </div>
                    ))}
                </div>
            )}

            {points.length > 0 && (
                <div className="prog-bloc__points">
                    {points.map((point, i) => (
                        <div className="prog-bloc__point" key={i}>
                            <h4>{point.titre}</h4>
                            {point.description && <p>{point.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProgrammeSection({ programme }: { programme: ProgrammeDTO }) {
    const aDesBlocs = Boolean(programme.constatTitre || programme.programmeTitre);

    return (
        <article className="prog-section">
            {programme.imagePresente && (
                <img
                    src={urlImageProgrammePublique(programme.id)}
                    alt={programme.titre}
                    className="prog-section__cover"
                />
            )}

            <div className="prog-section__body">
                <header className="prog-section__header">
                    <h2 className="prog-section__title">{programme.titre}</h2>
                    <div className="prog-section__meta">
                        <span className="prog-section__meta-item">
                            <CalendarIcon />
                            Débute le {formatDate(programme.dateDebut)}
                            {programme.dateFin && ` · jusqu'au ${formatDate(programme.dateFin)}`}
                        </span>
                        {programme.formateur && (
                            <span className="prog-section__meta-item">
                                <UserIcon />
                                {programme.formateur}
                            </span>
                        )}
                    </div>
                </header>

                {programme.description && <p className="prog-section__text">{programme.description}</p>}

                {aDesBlocs && (
                    <div className="prog-section__grid">
                        {programme.constatTitre && (
                            <ProgrammeBloc
                                titre={programme.constatTitre}
                                texte={programme.constatTexte}
                                etapes={programme.constatEtapes}
                                points={programme.constatPoints}
                            />
                        )}
                        {programme.programmeTitre && (
                            <ProgrammeBloc
                                titre={programme.programmeTitre}
                                texte={programme.programmeTexte}
                                etapes={programme.programmeEtapes}
                                points={programme.programmeApports}
                                accent
                            />
                        )}
                    </div>
                )}

                {programme.lien && (
                    <div className="prog-section__cta">
                        <a href={programme.lien} target="_blank" rel="noopener noreferrer" className="btn-gold">
                            Candidater à ce programme
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
}

function ProgrammesSkeleton() {
    return (
        <div className="prog-page">
            <div className="prog-skeleton">
                <div className="prog-skeleton__block prog-skeleton__block--wide" />
                <div className="prog-skeleton__block prog-skeleton__block--title" />
                <div className="prog-skeleton__block prog-skeleton__block--lede" />
            </div>
        </div>
    );
}

export function ProgrammesPage() {
    const [programmes, setProgrammes] = useState<ProgrammeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listerProgrammesPublics()
            .then(setProgrammes)
            .catch(() => setError("Impossible de charger les programmes pour le moment."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <ProgrammesSkeleton />;

    if (error) {
        return (
            <div className="prog-page">
                <div className="prog-message prog-message--error">{error}</div>
            </div>
        );
    }

    if (programmes.length === 0) {
        return (
            <div className="prog-page">
                <div className="prog-empty">
                    <div className="prog-empty__icon">
                        <CalendarIcon />
                    </div>
                    <p>Aucun programme disponible pour le moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="prog-page">
            <header className="prog-page__header">
                <h1 className="prog-page__title">Nos programmes</h1>
                <p className="prog-page__lede">
                    {programmes.length > 1
                        ? `${programmes.length} programmes disponibles actuellement.`
                        : "1 programme disponible actuellement."}
                </p>
            </header>

            <div className="prog-list">
                {programmes.map((p) => (
                    <ProgrammeSection programme={p} key={p.id} />
                ))}
            </div>
        </div>
    );
}