import { useCallback, useEffect, useState } from "react";
import {
    type CandidatureDTO,
    LABELS_STATUT_CANDIDATURE,
    listerToutesCandidaturesAdmin,
} from "../../api/candidatureService";
import "./UserAdminPage.css";
import "./CandidaturesAdminPage.css";

const PAGE_SIZE = 20;

function initiales(prenom: string | null, nom: string | null): string {
    return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";
}

function classeBadge(statut: CandidatureDTO["statut"]): string {
    return `statut-badge statut-badge--${statut.toLowerCase()}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function CandidaturesAdminPage() {
    const [candidatures, setCandidatures] = useState<CandidatureDTO[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const charger = useCallback(async (pageDemandee: number) => {
        setChargement(true);
        setErreur(null);
        try {
            const resultat = await listerToutesCandidaturesAdmin(pageDemandee, PAGE_SIZE);
            setCandidatures(resultat.candidatures);
            setTotal(resultat.total);
        } catch {
            setErreur("Impossible de charger les candidatures. Réessaie dans un instant.");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger(page);
    }, [page, charger]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Candidatures</h1>
                        <p className="admin-page__subtitle">
                            Toutes les candidatures envoyées sur la plateforme, tous recruteurs confondus.
                        </p>
                    </div>
                </div>

                <div className="admin-toolbar">
                    <span className="admin-toolbar__count">{total} candidature(s) au total</span>
                </div>

                {erreur && <div className="admin-alert">{erreur}</div>}

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Candidat</th>
                            <th>Offre</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Ville</th>
                        </tr>
                        </thead>
                        <tbody>
                        {chargement ? (
                            <tr>
                                <td colSpan={5} className="admin-table__empty">
                                    Chargement…
                                </td>
                            </tr>
                        ) : candidatures.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="admin-table__empty">
                                    Aucune candidature pour le moment.
                                </td>
                            </tr>
                        ) : (
                            candidatures.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="admin-table__user">
                                            <div className="admin-table__avatar">
                                                {initiales(c.candidatFirstName, c.candidatLastName)}
                                            </div>
                                            <div>
                                                <div className="admin-table__name">
                                                    {c.candidatFirstName} {c.candidatLastName}
                                                </div>
                                                <div className="admin-table__username">{c.candidatEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{c.offreTitre ?? "—"}</td>
                                    <td>
                                        <span className={classeBadge(c.statut)}>{LABELS_STATUT_CANDIDATURE[c.statut]}</span>
                                    </td>
                                    <td>{formatDate(c.dateCandidature)}</td>
                                    <td>{c.ville ?? "—"}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <button className="admin-btn admin-btn--ghost" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                        Précédent
                    </button>
                    <span className="admin-pagination__label">
                        Page {page + 1} / {totalPages}
                    </span>
                    <button className="admin-btn admin-btn--ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}