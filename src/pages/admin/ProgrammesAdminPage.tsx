// pages/programmesAdmin/ProgrammesAdminPage.tsx
import { useEffect, useMemo, useState } from "react";
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

type Filtre = "TOUS" | "PUBLIEE" | "BROUILLON";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
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

function LayersIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="m3.5 12 8.5 4.5 8.5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="m3.5 16.5 8.5 4.5 8.5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
    );
}

function CheckCircleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="m8.5 12.5 2.3 2.3 4.7-5.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DraftDotIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 3.5h9l3 3V20.5H6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M15 3.5V7h3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function EmptyIllustration() {
    return (
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="6" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M8.5 14.5h7M8.5 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

export function ProgrammesAdminPage() {
    const [programmes, setProgrammes] = useState<ProgrammeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enCours, setEnCours] = useState<number | null>(null);
    const [recherche, setRecherche] = useState("");
    const [filtre, setFiltre] = useState<Filtre>("TOUS");
    const [aSupprimer, setASupprimer] = useState<ProgrammeDTO | null>(null);

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

    const stats = useMemo(
        () => ({
            total: programmes.length,
            publies: programmes.filter((p) => p.statut === "PUBLIEE").length,
            brouillons: programmes.filter((p) => p.statut !== "PUBLIEE").length,
        }),
        [programmes]
    );

    const programmesFiltres = useMemo(() => {
        return programmes
            .filter((p) => (filtre === "TOUS" ? true : p.statut === filtre))
            .filter((p) => {
                const q = recherche.trim().toLowerCase();
                if (!q) return true;
                return p.titre.toLowerCase().includes(q) || (p.formateur ?? "").toLowerCase().includes(q);
            });
    }, [programmes, filtre, recherche]);

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

    async function confirmerSuppression() {
        if (!aSupprimer) return;
        const id = aSupprimer.id;
        setEnCours(id);
        try {
            await supprimerProgramme(id);
            setProgrammes((prev) => prev.filter((p) => p.id !== id));
            setASupprimer(null);
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
                    <span className="prog-admin-page__eyebrow">Contenu public</span>
                    <h1 className="prog-admin-page__title">Programmes</h1>
                    <p className="prog-admin-page__subtitle">Gère les programmes affichés sur le site public.</p>
                </div>
                <Link to="/admin/programmes/nouveau" className="btn-primary">
                    <PlusIcon />
                    Nouveau programme
                </Link>
            </div>

            <div className="prog-stats">
                <div className="prog-stat-card">
                    <span className="prog-stat-card__icon prog-stat-card__icon--navy">
                        <LayersIcon />
                    </span>
                    <div>
                        <span className="prog-stat-card__value">{stats.total}</span>
                        <span className="prog-stat-card__label">Programme{stats.total > 1 ? "s" : ""} au total</span>
                    </div>
                </div>
                <div className="prog-stat-card">
                    <span className="prog-stat-card__icon prog-stat-card__icon--green">
                        <CheckCircleIcon />
                    </span>
                    <div>
                        <span className="prog-stat-card__value">{stats.publies}</span>
                        <span className="prog-stat-card__label">Publiés</span>
                    </div>
                </div>
                <div className="prog-stat-card">
                    <span className="prog-stat-card__icon prog-stat-card__icon--muted">
                        <DraftDotIcon />
                    </span>
                    <div>
                        <span className="prog-stat-card__value">{stats.brouillons}</span>
                        <span className="prog-stat-card__label">Brouillons</span>
                    </div>
                </div>
            </div>

            <div className="prog-toolbar">
                <div className="prog-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Rechercher un programme ou un formateur..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />
                </div>
                <div className="prog-chips">
                    <button
                        type="button"
                        className={`prog-chip ${filtre === "TOUS" ? "prog-chip--active" : ""}`}
                        onClick={() => setFiltre("TOUS")}
                    >
                        Tous <span>{stats.total}</span>
                    </button>
                    <button
                        type="button"
                        className={`prog-chip ${filtre === "PUBLIEE" ? "prog-chip--active" : ""}`}
                        onClick={() => setFiltre("PUBLIEE")}
                    >
                        Publiés <span>{stats.publies}</span>
                    </button>
                    <button
                        type="button"
                        className={`prog-chip ${filtre === "BROUILLON" ? "prog-chip--active" : ""}`}
                        onClick={() => setFiltre("BROUILLON")}
                    >
                        Brouillons <span>{stats.brouillons}</span>
                    </button>
                </div>
            </div>

            {error && <div className="mod-alert">{error}</div>}

            {loading ? (
                <div className="prog-admin-list">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div className="prog-admin-row prog-admin-row--skeleton" key={i}>
                            <div className="prog-admin-row__thumb prog-skel" />
                            <div className="prog-admin-row__body">
                                <div className="prog-skel prog-skel--line" style={{ width: "60%" }} />
                                <div className="prog-skel prog-skel--line" style={{ width: "35%" }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : programmesFiltres.length === 0 ? (
                <div className="prog-empty">
                    <div className="prog-empty__icon">
                        <EmptyIllustration />
                    </div>
                    <h3>Aucun programme trouvé</h3>
                    <p>
                        {recherche || filtre !== "TOUS"
                            ? "Essaie une autre recherche ou réinitialise les filtres."
                            : "Crée ton premier programme pour qu'il apparaisse ici."}
                    </p>
                    {!recherche && filtre === "TOUS" && (
                        <Link to="/admin/programmes/nouveau" className="btn-primary">
                            <PlusIcon />
                            Créer un programme
                        </Link>
                    )}
                </div>
            ) : (
                <div className="prog-admin-list">
                    {programmesFiltres.map((p) => (
                        <div key={p.id} className="prog-admin-row">
                            <div className="prog-admin-row__thumb">
                                {p.imagePresente ? (
                                    <img src={urlImageProgrammeAdmin(p.id)} alt="" />
                                ) : (
                                    <span className="prog-admin-row__thumb-empty">{p.titre.charAt(0)}</span>
                                )}
                            </div>

                            <div className="prog-admin-row__body">
                                <h3 className="prog-admin-row__titre">{p.titre}</h3>
                                <div className="prog-admin-row__meta">
                                    <span>
                                        <CalendarIcon />
                                        {formatDate(p.dateDebut)}
                                    </span>
                                    {p.formateur && (
                                        <span>
                                            <UserIcon />
                                            {p.formateur}
                                        </span>
                                    )}
                                </div>
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
                                    onClick={() => setASupprimer(p)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {aSupprimer && (
                <div className="prog-modal-backdrop" onClick={() => setASupprimer(null)}>
                    <div className="prog-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Supprimer ce programme ?</h3>
                        <p>« {aSupprimer.titre} » sera définitivement supprimé. Cette action est irréversible.</p>
                        <div className="prog-modal__actions">
                            <button className="btn-secondary" onClick={() => setASupprimer(null)}>
                                Annuler
                            </button>
                            <button
                                className="btn-secondary btn-danger"
                                disabled={enCours === aSupprimer.id}
                                onClick={confirmerSuppression}
                            >
                                {enCours === aSupprimer.id ? "Suppression..." : "Supprimer définitivement"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}