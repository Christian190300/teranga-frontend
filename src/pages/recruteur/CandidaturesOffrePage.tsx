import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    listerCandidaturesPourOffre,
    changerStatutCandidature,
    LABELS_STATUT_CANDIDATURE,
    type CandidatureDTO,
    type StatutCandidature,
} from "../../api/candidatureService";
import "../public/offres.css";

const STATUTS_MODIFIABLES: StatutCandidature[] = ["ENVOYEE", "VUE", "ACCEPTEE", "REFUSEE"];

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function classeBadge(statut: string): string {
    return `statut-badge statut-badge--${statut.toLowerCase()}`;
}

function initiales(prenom: string | null, nom: string | null): string {
    return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";
}

export function CandidaturesOffrePage() {
    const { offreId } = useParams<{ offreId: string }>();

    const [candidatures, setCandidatures] = useState<CandidatureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [majEnCoursId, setMajEnCoursId] = useState<number | null>(null);

    useEffect(() => {
        charger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offreId]);

    async function charger() {
        if (!offreId) return;
        setLoading(true);
        try {
            const data = await listerCandidaturesPourOffre(Number(offreId));
            setCandidatures(data);
        } catch {
            setError("Impossible de charger les candidatures pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    async function handleChangerStatut(candidatureId: number, statut: StatutCandidature) {
        setMajEnCoursId(candidatureId);
        try {
            const updated = await changerStatutCandidature(candidatureId, statut);
            setCandidatures((prev) => prev.map((c) => (c.id === candidatureId ? updated : c)));
        } catch {
            setError("Impossible de mettre à jour le statut pour le moment.");
        } finally {
            setMajEnCoursId(null);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Candidatures reçues</h1>
                    <p className="offres-page__subtitle">
                        {candidatures[0]?.offreTitre ? `Pour l'offre : ${candidatures[0].offreTitre}` : "Candidats ayant postulé à cette offre."}
                    </p>
                </div>
                <Link to="/recruteur/offres" className="btn-secondary">
                    ← Mes offres
                </Link>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : candidatures.length === 0 ? (
                <div className="candidature-page__empty">Aucune candidature reçue pour cette offre pour le moment.</div>
            ) : (
                candidatures.map((c) => (
                    <div className="candidature-row" key={c.id}>
                        <div className="candidature-row__top">
                            <div className="candidat-card">
                                <div className="candidat-card__avatar">{initiales(c.candidatFirstName, c.candidatLastName)}</div>
                                <div className="candidat-card__body">
                                    <p className="candidat-card__nom">
                                        {c.candidatFirstName} {c.candidatLastName}
                                    </p>
                                    <p className="candidat-card__titre">{c.titreProfessionnel ?? c.candidatEmail}</p>
                                    <div className="candidat-card__facts">
                                        {c.ville && <span className="candidat-card__fact">{c.ville}</span>}
                                        {c.niveauExperience && <span className="candidat-card__fact">{c.niveauExperience}</span>}
                                        {c.anneesExperience !== null && <span className="candidat-card__fact">{c.anneesExperience} an(s) d'exp.</span>}
                                        {c.telephone && <span className="candidat-card__fact">{c.telephone}</span>}
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
                                </div>
                            </div>
                            <span className={classeBadge(c.statut)}>{LABELS_STATUT_CANDIDATURE[c.statut]}</span>
                        </div>

                        {c.message && <p className="candidature-row__message">{c.message}</p>}

                        <div className="candidature-row__actions">
                            <span className="candidature-row__meta">Postulé le {formatDate(c.dateCandidature)}</span>

                            {c.cvPresent && (
                                <span className="btn-secondary" style={{ cursor: "default" }}>
                  📄 CV{c.cvOriginalFilename ? ` — ${c.cvOriginalFilename}` : ""}
                </span>
                            )}
                            {c.lettreMotivationPresente && (
                                <span className="btn-secondary" style={{ cursor: "default" }}>
                  📎 Lettre de motivation
                </span>
                            )}

                            <select
                                value={c.statut}
                                onChange={(e) => handleChangerStatut(c.id, e.target.value as StatutCandidature)}
                                disabled={majEnCoursId === c.id}
                            >
                                {STATUTS_MODIFIABLES.map((s) => (
                                    <option key={s} value={s}>
                                        {LABELS_STATUT_CANDIDATURE[s]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}