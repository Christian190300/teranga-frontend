import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    listerCandidaturesRecues,
    changerStatutCandidature,
    telechargerCvCandidature,
    telechargerLettreMotivationCandidature,
    LABELS_STATUT_CANDIDATURE,
    type CandidatureDTO,
    type StatutCandidature,
} from "../../api/candidatureService";
import "../public/offres.css";

const STATUTS_MODIFIABLES: StatutCandidature[] = ["ENVOYEE", "VUE", "ACCEPTEE", "REFUSEE"];
const FILTRES = ["TOUTES", ...STATUTS_MODIFIABLES] as const;
type Filtre = (typeof FILTRES)[number];

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function classeBadge(statut: string): string {
    return `statut-badge statut-badge--${statut.toLowerCase()}`;
}

function initiales(prenom: string | null, nom: string | null): string {
    return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";
}

export function CandidaturesRecuesPage() {
    const [candidatures, setCandidatures] = useState<CandidatureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [majEnCoursId, setMajEnCoursId] = useState<number | null>(null);
    const [filtre, setFiltre] = useState<Filtre>("TOUTES");

    useEffect(() => {
        charger();
    }, []);

    async function charger() {
        setLoading(true);
        try {
            const data = await listerCandidaturesRecues();
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

    const candidaturesFiltrees = filtre === "TOUTES" ? candidatures : candidatures.filter((c) => c.statut === filtre);

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Candidatures reçues</h1>
                    <p className="offres-page__subtitle">Toutes les candidatures reçues, toutes offres confondues.</p>
                </div>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {!loading && candidatures.length > 0 && (
                <div className="offre-tile__tags" style={{ marginBottom: 24 }}>
                    {FILTRES.map((f) => (
                        <button
                            key={f}
                            className={f === filtre ? "btn-gold" : "btn-secondary"}
                            style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                            onClick={() => setFiltre(f)}
                        >
                            {f === "TOUTES" ? "Toutes" : LABELS_STATUT_CANDIDATURE[f]}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : candidatures.length === 0 ? (
                <div className="candidature-page__empty">Aucune candidature reçue pour le moment.</div>
            ) : candidaturesFiltrees.length === 0 ? (
                <div className="candidature-page__empty">Aucune candidature avec ce statut.</div>
            ) : (
                candidaturesFiltrees.map((c) => (
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
                                </div>
                            </div>
                            <span className={classeBadge(c.statut)}>{LABELS_STATUT_CANDIDATURE[c.statut]}</span>
                        </div>

                        {c.message && <p className="candidature-row__message">{c.message}</p>}

                        <div className="candidature-row__actions">
                            <span className="candidature-row__meta">
                                Pour <strong>{c.offreTitre ?? "Offre supprimée"}</strong> — postulé le {formatDate(c.dateCandidature)}
                            </span>

                            {c.offreId && (
                                <Link to={`/recruteur/offres/${c.offreId}/candidatures`} className="btn-secondary">
                                    Voir toutes les candidatures de cette offre
                                </Link>
                            )}

                            {c.cvPresent && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => telechargerCvCandidature(c.id, c.cvOriginalFilename ?? "cv.pdf")}
                                >
                                    📄 CV{c.cvOriginalFilename ? ` — ${c.cvOriginalFilename}` : ""}
                                </button>
                            )}
                            {c.lettreMotivationPresente && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => telechargerLettreMotivationCandidature(c.id, c.lettreMotivationOriginalFilename ?? "lettre-motivation.pdf")}
                                >
                                    📎 Lettre de motivation
                                </button>
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