import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listerProgrammesPublics, urlImageProgrammePublique, type ProgrammeDTO } from "../../api/programmeService";
import "./programmes.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
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
                <h1 className="prog-page__title">Nos programmes</h1>
                <p className="prog-page__subtitle">Des passerelles concrètes entre formation, expérience et emploi.</p>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="prog-page__loading">Chargement...</div>
            ) : programmes.length === 0 ? (
                <div className="prog-page__empty">Aucun programme disponible pour le moment.</div>
            ) : (
                <div className="prog-grid">
                    {programmes.map((p) => (
                        <Link to={`/programmes/${p.id}`} className="prog-tile" key={p.id}>
                            {p.imagePresente && (
                                <div className="prog-tile__image" style={{ backgroundImage: `url(${urlImageProgrammePublique(p.id)})` }} />
                            )}
                            <div className="prog-tile__body">
                                <h3 className="prog-tile__titre">{p.titre}</h3>
                                <p className="prog-tile__meta">
                                    Débute le {formatDate(p.dateDebut)}
                                    {p.formateur && ` · animé par ${p.formateur}`}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}