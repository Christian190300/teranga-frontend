import { useCallback, useEffect, useState } from "react";
import {
    type CandidatureDTO,
    LABELS_STATUT_CANDIDATURE,
    listerToutesCandidaturesAdmin,
    telechargerCvCandidatureAdmin,
    telechargerLettreMotivationCandidatureAdmin,
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
    const [ligneOuverte, setLigneOuverte] = useState<number | null>(null);
    const [telechargementEnCours, setTelechargementEnCours] = useState<string | null>(null);

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

    async function handleTelechargerCv(c: CandidatureDTO) {
        const cle = `cv-${c.id}`;
        setTelechargementEnCours(cle);
        try {
            await telechargerCvCandidatureAdmin(c.id, c.cvOriginalFilename ?? "cv.pdf");
        } catch {
            setErreur("Impossible de télécharger ce CV.");
        } finally {
            setTelechargementEnCours(null);
        }
    }

    async function handleTelechargerLettre(c: CandidatureDTO) {
        const cle = `lettre-${c.id}`;
        setTelechargementEnCours(cle);
        try {
            await telechargerLettreMotivationCandidatureAdmin(c.id, c.lettreMotivationOriginalFilename ?? "lettre-motivation.pdf");
        } catch {
            setErreur("Impossible de télécharger cette lettre.");
        } finally {
            setTelechargementEnCours(null);
        }
    }

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

                {chargement ? (
                    <div className="admin-table-wrap">
                        <div className="admin-table__empty" style={{ padding: 40 }}>
                            Chargement…
                        </div>
                    </div>
                ) : candidatures.length === 0 ? (
                    <div className="admin-table-wrap">
                        <div className="admin-table__empty" style={{ padding: 40 }}>
                            Aucune candidature pour le moment.
                        </div>
                    </div>
                ) : (
                    <div className="candidature-admin-list">
                        {candidatures.map((c) => {
                            const ouverte = ligneOuverte === c.id;
                            return (
                                <div className="candidature-row" key={c.id}>
                                    <button
                                        type="button"
                                        className="candidature-admin-row__toggle"
                                        onClick={() => setLigneOuverte(ouverte ? null : c.id)}
                                    >
                                        <div className="candidat-card">
                                            <div className="candidat-card__avatar">{initiales(c.candidatFirstName, c.candidatLastName)}</div>
                                            <div className="candidat-card__body">
                                                <p className="candidat-card__nom">
                                                    {c.candidatFirstName} {c.candidatLastName}
                                                </p>
                                                <p className="candidat-card__titre">{c.titreProfessionnel ?? c.candidatEmail}</p>
                                            </div>
                                        </div>

                                        <div className="candidature-admin-row__meta">
                                            <span className="candidature-row__meta">{c.offreTitre ?? "—"}</span>
                                            <span className={classeBadge(c.statut)}>{LABELS_STATUT_CANDIDATURE[c.statut]}</span>
                                            <span className="candidature-row__meta">{formatDate(c.dateCandidature)}</span>
                                            <span className={`candidature-admin-row__chevron${ouverte ? " candidature-admin-row__chevron--open" : ""}`}>
                                                ▾
                                            </span>
                                        </div>
                                    </button>

                                    {ouverte && (
                                        <div className="candidature-admin-row__details">
                                            <div className="candidat-card__facts">
                                                {c.candidatEmail && <span className="candidat-card__fact">{c.candidatEmail}</span>}
                                                {c.telephone && <span className="candidat-card__fact">{c.telephone}</span>}
                                                {(c.ville || c.pays) && (
                                                    <span className="candidat-card__fact">{[c.ville, c.pays].filter(Boolean).join(", ")}</span>
                                                )}
                                                {c.niveauExperience && <span className="candidat-card__fact">{c.niveauExperience}</span>}
                                                {c.anneesExperience !== null && (
                                                    <span className="candidat-card__fact">{c.anneesExperience} an(s) d'expérience</span>
                                                )}
                                            </div>

                                            {c.competences && c.competences.length > 0 && (
                                                <div className="candidat-card__facts">
                                                    {c.competences.map((comp) => (
                                                        <span className="candidat-card__fact" key={comp}>
                                                            {comp}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {c.langues && c.langues.length > 0 && (
                                                <div className="candidat-card__facts">
                                                    {c.langues.map((langue) => (
                                                        <span className="candidat-card__fact" key={langue}>
                                                            {langue}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {c.message && <p className="candidature-row__message">{c.message}</p>}

                                            <div className="candidature-row__actions">
                                                <button
                                                    type="button"
                                                    className="candidature-row__btn"
                                                    disabled={!c.cvPresent || telechargementEnCours === `cv-${c.id}`}
                                                    onClick={() => handleTelechargerCv(c)}
                                                >
                                                    {telechargementEnCours === `cv-${c.id}`
                                                        ? "Téléchargement..."
                                                        : c.cvPresent
                                                            ? `Télécharger le CV${c.cvOriginalFilename ? ` (${c.cvOriginalFilename})` : ""}`
                                                            : "Aucun CV disponible"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="candidature-row__btn"
                                                    disabled={!c.lettreMotivationPresente || telechargementEnCours === `lettre-${c.id}`}
                                                    onClick={() => handleTelechargerLettre(c)}
                                                >
                                                    {telechargementEnCours === `lettre-${c.id}`
                                                        ? "Téléchargement..."
                                                        : c.lettreMotivationPresente
                                                            ? "Télécharger la lettre de motivation"
                                                            : "Aucune lettre disponible"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

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