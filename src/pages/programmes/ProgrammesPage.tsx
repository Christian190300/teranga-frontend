import { useEffect, useState } from "react";
import {
    listerProgrammesPublics,
    urlImageEtapePublique,
    urlImageProgrammePublique,
    type ProgrammeDTO,
} from "../../api/programmeService";
import "./programmes.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function CalendarIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 20c1.2-4 4.2-6 7-6s5.8 2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function EtapesTimeline({
                            etapes,
                            programmeId,
                            section,
                        }: {
    etapes: ProgrammeDTO["constatEtapes"];
    programmeId: number;
    section: "constat" | "programme";
}) {
    if (etapes.length === 0) return null;

    return (
        <ol className="prog-timeline">
            {etapes.map((etape, i) => (
                <li className="prog-timeline__item" key={i}>
                    <span className="prog-timeline__num">{i + 1}</span>
                    <div className="prog-timeline__body">
                        <p className="prog-timeline__title">{etape.titre}</p>
                        {etape.sousTitre && <p className="prog-timeline__sub">{etape.sousTitre}</p>}
                        {etape.imagePresente && (
                            <img
                                src={urlImageEtapePublique(programmeId, section, i)}
                                alt={etape.titre}
                                className="prog-timeline__img"
                            />
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}

function PointsList({ points }: { points: ProgrammeDTO["constatPoints"] }) {
    if (points.length === 0) return null;

    return (
        <ul className="prog-points">
            {points.map((pt, i) => (
                <li className="prog-points__item" key={i}>
                    <span className="prog-points__marker" aria-hidden="true" />
                    <div>
                        <p className="prog-points__title">{pt.titre}</p>
                        {pt.description && <p className="prog-points__desc">{pt.description}</p>}
                    </div>
                </li>
            ))}
        </ul>
    );
}

function ProgrammeCard({ programme }: { programme: ProgrammeDTO }) {
    return (
        <article className="prog-dossier">
            <div className="prog-dossier__hero">
                {programme.imagePresente && (
                    <div className="prog-dossier__media">
                        <img
                            src={urlImageProgrammePublique(programme.id)}
                            alt={programme.titre}
                            className="prog-dossier__img"
                        />
                    </div>
                )}
                <div className="prog-dossier__intro">
                    <h2 className="prog-dossier__title">{programme.titre}</h2>

                    <div className="prog-dossier__facts">
                        <span className="prog-dossier__fact">
                            <CalendarIcon />
                            Débute le {formatDate(programme.dateDebut)}
                            {programme.dateFin && ` — jusqu'au ${formatDate(programme.dateFin)}`}
                        </span>
                        {programme.formateur && (
                            <span className="prog-dossier__fact">
                                <UserIcon />
                                {programme.formateur}
                            </span>
                        )}
                    </div>

                    {programme.description && <p className="prog-dossier__desc">{programme.description}</p>}

                    {programme.lien && (
                        <a href={programme.lien} target="_blank" rel="noopener noreferrer" className="prog-dossier__cta">
                            Candidater à ce programme
                            <ArrowIcon />
                        </a>
                    )}
                </div>
            </div>

            {(programme.constatTitre || programme.programmeTitre) && (
                <div className="prog-dossier__body">
                    {programme.constatTitre && (
                        <section className="prog-dossier__column">
                            <p className="prog-dossier__eyebrow">Le constat</p>
                            <h3 className="prog-dossier__heading">{programme.constatTitre}</h3>
                            {programme.constatTexte && <p className="prog-dossier__text">{programme.constatTexte}</p>}

                            <EtapesTimeline etapes={programme.constatEtapes} programmeId={programme.id} section="constat" />
                            <PointsList points={programme.constatPoints} />
                        </section>
                    )}

                    {programme.programmeTitre && (
                        <section className="prog-dossier__column prog-dossier__column--accent">
                            <p className="prog-dossier__eyebrow">Le dispositif</p>
                            <h3 className="prog-dossier__heading">{programme.programmeTitre}</h3>
                            {programme.programmeTexte && <p className="prog-dossier__text">{programme.programmeTexte}</p>}

                            <EtapesTimeline etapes={programme.programmeEtapes} programmeId={programme.id} section="programme" />

                            {programme.programmeApports.length > 0 && (
                                <div className="prog-dossier__apports">
                                    <p className="prog-dossier__apports-label">Ce que vous en retirez</p>
                                    <PointsList points={programme.programmeApports} />
                                </div>
                            )}
                        </section>
                    )}
                </div>
            )}
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
            .catch(() => setError("Impossible de charger les programmes pour le moment."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="prog-page">
                <div className="prog-page__container">
                    <p className="prog-page__state">Chargement des programmes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="prog-page">
                <div className="prog-page__container">
                    <p className="prog-page__state">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="prog-page">
            <div className="prog-page__container">
                <header className="prog-page__header">
                    <h1 className="prog-page__title">Nos programmes</h1>
                    <p className="prog-page__lede">
                        {programmes.length > 1
                            ? `${programmes.length} programmes disponibles actuellement.`
                            : programmes.length === 1
                                ? "1 programme disponible actuellement."
                                : "Aucun programme disponible pour le moment."}
                    </p>
                </header>

                <div className="prog-list">
                    {programmes.map((p) => (
                        <ProgrammeCard programme={p} key={p.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}