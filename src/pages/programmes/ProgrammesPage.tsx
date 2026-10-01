import { useEffect, useState } from "react";
import {
    listerProgrammesPublics,
    urlImageEtapePublique,
    urlImageProgrammePublique,
    type ProgrammeDTO,
} from "../../api/programmeService";
import "./programmes.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Affiche correctement les retours à la ligne du texte.
 * Gère :
 * - \n
 * - \\n
 * - \r\n
 * - les paragraphes séparés par une ligne vide
 */
function formatTexte(texte: string) {
    return texte
        .replace(/\\n/g, "\n")
        .replace(/\r\n/g, "\n")
        .split(/\n\s*\n/)
        .filter((paragraphe) => paragraphe.trim())
        .map((paragraphe, index) => (
            <p key={index} className="prog-bloc__desc">
                {paragraphe.trim()}
            </p>
        ));
}

function CalendarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
                x="3.5"
                y="5"
                width="17"
                height="15.5"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M8 3v3.5M16 3v3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
                cx="12"
                cy="8"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M5 20c1.2-4 4.2-6 7-6s5.8 2 7 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ProgrammeCard({ programme }: { programme: ProgrammeDTO }) {
    return (
        <article className="prog-card">
            {/* HERO BANNER */}
            <div className="prog-hero">
                {programme.imagePresente && (
                    <div className="prog-hero__media">
                        <img
                            src={urlImageProgrammePublique(programme.id)}
                            alt={programme.titre}
                            className="prog-hero__img"
                        />
                    </div>
                )}

                <div className="prog-hero__body">
                    <h2 className="prog-hero__title">{programme.titre}</h2>

                    <div className="prog-hero__meta">
                        <span className="prog-hero__meta-item">
                            <CalendarIcon />
                            Débute le {formatDate(programme.dateDebut)}
                            {programme.dateFin &&
                                ` · jusqu'au ${formatDate(programme.dateFin)}`}
</span>

{programme.formateur && (
    <span className="prog-hero__meta-item">
                                <UserIcon />
        {programme.formateur}
                            </span>
)}
</div>

{programme.description && (
    <p className="prog-hero__desc">
        {programme.description}
    </p>
)}

{programme.lien && (
    <div className="prog-hero__cta">
        <a
            href={programme.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
        >
            Candidater à ce programme
        </a>
    </div>
)}
</div>
</div>

{/* CONTENU PRINCIPAL */}
<div className="prog-content-grid">

    {/* BLOC 1 : LE CONSTAT */}
    {programme.constatTitre && (
        <div className="prog-bloc">
            <div className="prog-bloc__header">
                            <span className="prog-bloc__label">
                                Analyse
                            </span>

                <h3 className="prog-bloc__titre">
                    {programme.constatTitre}
                </h3>
            </div>

            {programme.constatTexte &&
                formatTexte(programme.constatTexte)}

            {/* Étapes du constat */}
            {programme.constatEtapes.length > 0 && (
                <div className="prog-etapes-grid">
                    {programme.constatEtapes.map((etape, i) => (
                        <div
                            className="prog-etape-card"
                            key={i}
                        >
                            <div className="prog-etape-card__head">
                                            <span className="prog-etape-card__num">
                                                {i + 1}
                                            </span>

                                <div className="prog-etape-card__text">
                                                <span className="prog-etape-card__title">
                                                    {etape.titre}
                                                </span>

                                    {etape.sousTitre && (
                                        <span className="prog-etape-card__sub">
                                                        {etape.sousTitre}
                                                    </span>
                                    )}
                                </div>
                            </div>

                            {etape.imagePresente && (
                                <img
                                    src={urlImageEtapePublique(
                                        programme.id,
                                        "constat",
                                        i
                                    )}
                                    alt={etape.titre}
                                    className="prog-etape-card__img"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Points clés du constat */}
            {programme.constatPoints.length > 0 && (
                <div className="prog-points-grid">
                    {programme.constatPoints.map((pt, i) => (
                        <div
                            className="prog-point-card"
                            key={i}
                        >
                            <h4>{pt.titre}</h4>

                            {pt.description && (
                                <p>{pt.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )}

    {/* BLOC 2 : LE PROGRAMME */}
    {programme.programmeTitre && (
        <div className="prog-bloc prog-bloc--accent">
            <div className="prog-bloc__header">
                            <span className="prog-bloc__label">
                                Dispositif
                            </span>

                <h3 className="prog-bloc__titre">
                    {programme.programmeTitre}
                </h3>
            </div>

            {/* DESCRIPTION DU PROGRAMME */}
            {programme.programmeTexte && (
                <div className="prog-bloc__desc">
                    {programme.programmeTexte
                        .replace(/\\n/g, "\n")
                        .split(/\n/)
                        .map((ligne, index) => (
                            <div key={index}>
                                {ligne || <br />}
                            </div>
                        ))}
                </div>
            )}

            {/* Étapes du programme */}
            {programme.programmeEtapes.length > 0 && (
                <div className="prog-etapes-grid">
                    {programme.programmeEtapes.map((etape, i) => (
                        <div
                            className="prog-etape-card"
                            key={i}
                        >
                            <div className="prog-etape-card__head">
                                            <span className="prog-etape-card__num">
                                                {i + 1}
                                            </span>

                                <div className="prog-etape-card__text">
                                                <span className="prog-etape-card__title">
                                                    {etape.titre}
                                                </span>

                                    {etape.sousTitre && (
                                        <span className="prog-etape-card__sub">
                                                        {etape.sousTitre}
                                                    </span>
                                    )}
                                </div>
                            </div>

                            {etape.imagePresente && (
                                <img
                                    src={urlImageEtapePublique(
                                        programme.id,
                                        "programme",
                                        i
                                    )}
                                    alt={etape.titre}
                                    className="prog-etape-card__img"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Apports du programme */}
            {programme.programmeApports.length > 0 && (
                <div className="prog-points-grid">
                    {programme.programmeApports.map((pt, i) => (
                        <div
                            className="prog-point-card"
                            key={i}
                        >
                            <h4>{pt.titre}</h4>

                            {pt.description && (
                                <p>{pt.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )}
</div>
</article>
);
}

export function ProgrammesPage() {
    const [programmes, setProgrammes] = useState<ProgrammeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listerProgrammesPublics()
            .then(setProgrammes)
            .catch(() =>
                setError(
                    "Impossible de charger les programmes pour le moment."
                )
            )
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="prog-page">
                <div className="prog-page__container">
                    Chargement...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="prog-page">
                <div className="prog-page__container">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="prog-page">
            <div className="prog-page__container">
                <header className="prog-page__header">
                    <h1 className="prog-page__title">
                        Nos programmes
                    </h1>

                    <p className="prog-page__lede">
                        {programmes.length > 1
                            ? `${programmes.length} programmes disponibles actuellement.`
                            : "1 programme disponible actuellement."}
                    </p>
                </header>

                <div className="prog-list">
                    {programmes.map((programme) => (
                        <ProgrammeCard
                            programme={programme}
                            key={programme.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}