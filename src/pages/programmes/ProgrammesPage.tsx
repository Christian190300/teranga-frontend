// pages/programmes/ProgrammesPage.tsx
import { Link } from "react-router-dom";
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

function ProgrammeCard({ programme }: { programme: ProgrammeDTO }) {
    return (
        <Link to={`/programmes/${programme.id}`} className="prog-card">
            {programme.imagePresente && (
                <img
                    src={urlImageProgrammePublique(programme.id)}
                    alt={programme.titre}
                    className="prog-card__image"
                />
            )}
            <div className="prog-card__body">
                <h2 className="prog-card__title">{programme.titre}</h2>
                <span className="prog-card__meta">
                    <CalendarIcon />
                    Débute le {formatDate(programme.dateDebut)}
                </span>
                <span className="prog-card__link">Découvrir le programme →</span>
            </div>
        </Link>
    );
}

function ProgrammesSkeleton() {
    return (
        <div className="prog-skeleton">
            <div className="prog-skeleton__block prog-skeleton__block--wide" />
            <div className="prog-skeleton__block prog-skeleton__block--title" />
            <div className="prog-skeleton__block prog-skeleton__block--lede" />
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
        <div className="prog-list">
            {programmes.map((p) => (
                <ProgrammeCard programme={p} key={p.id} />
            ))}
        </div>
    );
}