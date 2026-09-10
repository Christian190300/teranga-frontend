import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    changerStatutProgramme,
    listerProgrammesAdmin,
    supprimerProgramme,
    urlImageProgrammeAdmin,
    type ProgrammeDTO,
    type StatutProgramme,
} from "../../api/programmeService";
import "./programmesAdmin.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function ProgrammesAdminPage() {
    const [programmes, setProgrammes] = useState<ProgrammeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enCours, setEnCours] = useState<number | null>(null);

    function charger() {
        setLoading(true);
        listerProgrammesAdmin()
            .then(setProgrammes)
            .catch(() => setError("Impossible de charger les programmes."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        charger();
    }, []);

    async function handlePublier(id: number, statutActuel: StatutProgramme) {
        const nouveauStatut: StatutProgramme = statutActuel === "PUBLIEE" ? "BROUILLON" : "PUBLIEE";
        setEnCours(id);
        try {
            const maj = await changerStatutProgramme(id, nouveauStatut);
            setProgrammes((prev) => prev.map((p) => (p.id === id ? maj : p)));
        } catch {
            setError("Impossible de changer le statut de ce programme.");
        } finally {
            setEnCours(null);
        }
    }

    async function handleSupprimer(id: number) {
        if (!window.confirm("Supprimer définitivement ce programme ? Cette action est irréversible.")) return;
        setEnCours(id);
        try {
            await supprimerProgramme(id);
            setProgrammes((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setError("Impossible de supprimer ce programme.");
        } finally {
            setEnCours(null);
        }
    }

    return (
        <div className="prog-admin-page">
            <div className="prog-admin-page__head">
                <div>
                    <h1 className="prog-admin-page__title">Programmes</h1>
                    <p className="prog-admin-page__count">{programmes.length} programme{programmes.length > 1 ? "s" : ""}</p>
                </div>
                <Link to="/admin/programmes/nouveau" className="btn-primary">
                    Nouveau programme
                </Link>
            </div>

            {error && <div className="mod-alert">{error}</div>}

            {loading ? (
                <div className="mod-state">Chargement...</div>
            ) : programmes.length === 0 ? (
                <div className="mod-state">Aucun programme pour le moment.</div>
            ) : (
                <div className="prog-admin-list">
                    {programmes.map((p) => (
                        <div key={p.id} className="prog-admin-row">
                            <div className="prog-admin-row__thumb">
                                {p.imagePresente ? (
                                    <img src={urlImageProgrammeAdmin(p.id)} alt="" />
                                ) : (
                                    <span className="prog-admin-row__thumb-empty">Aucune image</span>
                                )}
                            </div>

                            <div className="prog-admin-row__body">
                                <h3 className="prog-admin-row__titre">{p.titre}</h3>
                                <p className="prog-admin-row__meta">
                                    Débute le {formatDate(p.dateDebut)}
                                    {p.formateur && ` · ${p.formateur}`}
                                </p>
                            </div>

                            <span className={`statut-badge statut-badge--${p.statut === "PUBLIEE" ? "publiee" : "brouillon"}`}>
                                {p.statut === "PUBLIEE" ? "Publié" : "Brouillon"}
                            </span>

                            <div className="prog-admin-row__actions">
                                <button
                                    className="btn-secondary"
                                    disabled={enCours === p.id}
                                    onClick={() => handlePublier(p.id, p.statut)}
                                >
                                    {p.statut === "PUBLIEE" ? "Dépublier" : "Publier"}
                                </button>
                                <Link to={`/admin/programmes/${p.id}/modifier`} className="btn-secondary">
                                    Modifier
                                </Link>
                                <button
                                    className="btn-secondary btn-danger"
                                    disabled={enCours === p.id}
                                    onClick={() => handleSupprimer(p.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}