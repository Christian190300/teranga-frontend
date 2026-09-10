// pages/programmes/ProgrammesPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listerProgrammesPublics, urlImageProgrammePublique, type ProgrammeDTO } from "../../api/programmeService";
import "./programmes.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function CalendarIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4.5 20c1.3-3.6 4.3-5.5 7.5-5.5s6.2 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ProgrammeCardSkeleton() {
    return (
        <div className="prog-tile prog-tile--skeleton">
            <div className="prog-tile__image prog-tile__image--skeleton" />
            <div className="prog-tile__body">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--meta" />
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

    return (
        <div className="prog-page">
            <div className="prog-page__header">
                <span className="prog-page__eyebrow">Programmes</span>
                <h1 className="prog-page__title">Nos programmes</h1>
                <p className="prog-page__subtitle">Des passerelles concrètes entre formation, expérience et emploi.</p>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="prog-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProgrammeCardSkeleton key={i} />
                    ))}
                </div>
            ) : programmes.length === 0 ? (
                <div className="prog-page__empty">
                    <div className="prog-page__empty-icon">
                        <CalendarIcon />
                    </div>
                    <p>Aucun programme disponible pour le moment.</p>
                </div>
            ) : (
                <div className="prog-grid">
                    {programmes.map((p) => (
                        <Link to={`/programmes/${p.id}`} className="prog-tile" key={p.id}>
                            <div
                                className="prog-tile__image"
                                style={p.imagePresente ? { backgroundImage: `url(${urlImageProgrammePublique(p.id)})` } : undefined}
                            >
                                {!p.imagePresente && <span className="prog-tile__image-fallback">{p.titre.charAt(0)}</span>}
                                <span className="prog-tile__date-badge">
                                    <CalendarIcon />
                                    {formatDate(p.dateDebut)}
                                </span>
                            </div>

                            <div className="prog-tile__body">
                                <h3 className="prog-tile__titre">{p.titre}</h3>
                                {p.formateur && (
                                    <p className="prog-tile__meta">
                                        <UserIcon />
                                        {p.formateur}
                                    </p>
                                )}
                            </div>

                            <div className="prog-tile__footer">
                                <span>Voir le programme</span>
                                <ArrowIcon />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}