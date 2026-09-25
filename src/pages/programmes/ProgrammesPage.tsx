// pages/programmes/ProgrammesPage.tsx
import { useEffect, useState } from "react";
import { listerProgrammesPublics, urlImageProgrammePublique, type ProgrammeDTO } from "../../api/programmeService";
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
            <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4.5 20c1.3-3.6 4.3-5.5 7.5-5.5s6.2 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

/** Parcours en badges numérotés reliés par une ligne — utilisé dans le hero (vertical) et dans "Le programme" (horizontal). */
function StepPath({
                      steps,
                      orientation,
                  }: {
    steps: { titre: string; sousTitre?: string | null }[];
    orientation: "vertical" | "horizontal";
}) {
    if (steps.length === 0) return null;
    return (
        <div className={orientation === "vertical" ? "prog-hero__path" : "prog-flow"}>
            {steps.map((etape, i) => {
                const isLast = i === steps.length - 1;
                if (orientation === "vertical") {
                    return (
                        <div className="prog-hero__step" key={i}>
                            <div className="prog-hero__step-marker">
                                <span className="prog-hero__step-num">{i + 1}</span>
                                {!isLast && <span className="prog-hero__step-line" />}
                            </div>
                            <div className={`prog-hero__step-text${isLast ? " prog-hero__step-text--last" : ""}`}>
                                <p className="prog-hero__step-title">{etape.titre}</p>
                                {etape.sousTitre && <p className="prog-hero__step-sub">{etape.sousTitre}</p>}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className={`prog-flow__step${isLast ? " prog-flow__step--last" : ""}`} key={i}>
                        <span className="prog-flow__num">{i + 1}</span>
                        <p className="prog-flow__title">{etape.titre}</p>
                        {etape.sousTitre && <p className="prog-flow__sub">{etape.sousTitre}</p>}
                    </div>
                );
            })}
        </div>
    );
}

function PointsList({ points }: { points: { titre: string; description?: string | null }[] }) {    if (points.length === 0) return null;
    return (
        <div className="prog-points">
            {points.map((p, i) => (
                <div className="prog-points__item" key={i}>
                    <span className="prog-points__index">{String(i + 1).padStart(2, "0")}</span>
                    <div className="prog-points__body">
                        <h4>{p.titre}</h4>
                        {p.description && <p>{p.description}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProgrammeShowcase({ programme }: { programme: ProgrammeDTO }) {
    const hasImage = programme.imagePresente;

    return (
        <article className="prog-showcase">
            {/* HERO */}
            <section
                className={`prog-hero${hasImage ? " prog-hero--photo" : ""}`}
                style={hasImage ? { backgroundImage: `url(${urlImageProgrammePublique(programme.id)})` } : undefined}
            >
                <div className="prog-hero__inner">
                    <div className="prog-hero__content">
                        <h1 className="prog-hero__title">{programme.titre}</h1>
                        {programme.description && <p className="prog-hero__lede">{programme.description}</p>}

                        <div className="prog-hero__meta">
                            <span className="prog-hero__meta-item">
                                <CalendarIcon />
                                Début le {formatDate(programme.dateDebut)}
                                {programme.dateFin && ` — fin le ${formatDate(programme.dateFin)}`}
                            </span>
                            {programme.formateur && (
                                <span className="prog-hero__meta-item">
                                    <UserIcon />
                                    Animé par {programme.formateur}
                                </span>
                            )}
                        </div>

                        {programme.lien && (
                            <a href={programme.lien} target="_blank" rel="noopener noreferrer" className="btn-gold prog-hero__cta">
                                Rejoindre le programme
                            </a>
                        )}
                    </div>

                    {programme.constatEtapes.length > 0 && (
                        <div className="prog-hero__visual">
                            <StepPath steps={programme.constatEtapes} orientation="vertical" />
                        </div>
                    )}
                </div>
            </section>

            {/* LE CONSTAT */}
            {(programme.constatTitre || programme.constatPoints.length > 0) && (
                <section className="prog-section">
                    <div className="prog-section__inner">
                        <span className="prog-section__label">Le constat</span>
                        {programme.constatTitre && <h2 className="prog-section__title">{programme.constatTitre}</h2>}
                        {programme.constatTexte && <p className="prog-section__body">{programme.constatTexte}</p>}
                        <PointsList points={programme.constatPoints} />
                    </div>
                </section>
            )}

            {/* LE PROGRAMME */}
            {(programme.programmeTitre || programme.programmeEtapes.length > 0 || programme.programmeApports.length > 0) && (
                <section className="prog-section prog-section--alt">
                    <div className="prog-section__inner">
                        <span className="prog-section__label">Le programme</span>
                        {programme.programmeTitre && <h2 className="prog-section__title">{programme.programmeTitre}</h2>}
                        {programme.programmeTexte && <p className="prog-section__body">{programme.programmeTexte}</p>}
                        <StepPath steps={programme.programmeEtapes} orientation="horizontal" />
                        <PointsList points={programme.programmeApports} />
                    </div>
                </section>
            )}

            {/* CTA */}
            {programme.lien && (
                <section className="prog-cta">
                    <div className="prog-cta__inner">
                        <h2 className="prog-cta__title">Envie d'y participer ?</h2>
                        <p className="prog-cta__text">
                            Découvrez comment rejoindre « {programme.titre} » et faire le premier pas vers votre expérience professionnelle.
                        </p>
                        <a href={programme.lien} target="_blank" rel="noopener noreferrer" className="btn-gold">
                            En savoir plus
                        </a>
                    </div>
                </section>
            )}
        </article>
    );
}

function ProgrammesSkeleton() {
    return (
        <div className="prog-skeleton">
            <div className="prog-skeleton__block prog-skeleton__block--title" />
            <div className="prog-skeleton__block prog-skeleton__block--lede" />
            <div className="prog-skeleton__block prog-skeleton__block--wide" />
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

    if (error) return <div className="prog-message prog-message--error">{error}</div>;

    if (programmes.length === 0) {
        return (
            <div className="prog-empty">
                <div className="prog-empty__icon">
                    <CalendarIcon />
                </div>
                <p>Aucun programme disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="prog-page">
            {programmes.map((p) => (
                <ProgrammeShowcase programme={p} key={p.id} />
            ))}
        </div>
    );
}