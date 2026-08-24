import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconCoin, IconMapPin } from "./icons";
import { LogoEntreprise } from "../common/LogoEntreprise";
import { getCouleurContrat } from "../../pages/offres/offreColors";

import {
    LABELS_TYPE_CONTRAT,
    LABELS_NIVEAU_EXPERIENCE,
    type OffreDTO,
    listerOffresPubliques,
} from "../../api/offreService";

function joursDepuisPublication(iso: string | null): number | null {
    if (!iso) return null;
    const timestamp = new Date(iso).getTime();
    if (isNaN(timestamp)) return null;

    const diffMs = Date.now() - timestamp;
    return Math.floor(diffMs / 86400000);
}

function formatAnciennete(jours: number | null): string {
    if (jours === null) return "";
    if (jours <= 0) return "Publiée aujourd'hui";
    if (jours === 1) return "Publiée hier";
    return `Publiée il y a ${jours} j`;
}

/** Extraire et nettoyer la description avec fallback (description -> profilRecherche -> missions) */
function extraireTexteDescription(job: OffreDTO): string {
    const sourceTexte =
        job.description ||
        job.profilRecherche ||
        (job.missions && job.missions.length > 0 ? job.missions[0] : "");

    if (!sourceTexte) return "";

    return sourceTexte.replace(/<[^>]*>?/gm, "").trim();
}

export function RecentJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<OffreDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [favoris, setFavoris] = useState<Set<number>>(new Set());

    const chargerOffres = async () => {
        setLoading(true);
        setHasError(false);
        try {
            const resultat = await listerOffresPubliques(0, 5);
            const offres = [...(resultat.content ?? [])]
                .sort(
                    (a, b) =>
                        new Date(b.datePublication ?? 0).getTime() -
                        new Date(a.datePublication ?? 0).getTime()
                )
                .slice(0, 5);
            setJobs(offres);
        } catch (error) {
            console.error("Erreur lors du chargement des offres :", error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerOffres();
    }, []);

    function handlePostuler(e: React.MouseEvent, jobId: number | string) {
        e.preventDefault();
        e.stopPropagation();
        // Redirige vers la connexion en conservant l'intention d'action
        navigate(`/connexion?redirect=/offres/${jobId}`);
    }

    function toggleFavori(e: React.MouseEvent, jobId: number) {
        e.preventDefault();
        e.stopPropagation();
        setFavoris((prev) => {
            const next = new Set(prev);
            if (next.has(jobId)) next.delete(jobId);
            else next.add(jobId);
            return next;
        });
    }

    return (
        <section className="home-section home-container">
            <div className="home-section__head">
                <div>
                    <h2 className="home-section__title">Opportunités récentes</h2>
                    <p className="home-section__subtitle">
                        Les derniers postes publiés par les entreprises qui recrutent.
                    </p>
                </div>
            </div>

            <div className="home-jobs-grid">
                {loading ? (
                    // Skeleton UI placeholders
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="job-pass job-pass--skeleton" aria-hidden="true">
                            <div className="skeleton-line skeleton-line--title" />
                            <div className="skeleton-line skeleton-line--text" />
                        </div>
                    ))
                ) : hasError ? (
                    <div className="home-jobs-error">
                        <p>Impossible de charger les offres pour le moment.</p>
                        <button onClick={chargerOffres} className="btn-retry">
                            Réessayer
                        </button>
                    </div>
                ) : jobs.length === 0 ? (
                    <p className="home-jobs-empty">Aucune offre disponible actuellement.</p>
                ) : (
                    <>
                        {jobs.map((job) => {
                            const couleur = getCouleurContrat(job.typeContrat);
                            const jours = joursDepuisPublication(job.datePublication);
                            const estRecente = jours !== null && jours <= 2;
                            const lieu =
                                [job.ville, job.region, job.pays].filter(Boolean).join(", ") ||
                                "Non précisé";
                            const competences = (job.competences ?? []).slice(0, 3);
                            const descriptionPropre = extraireTexteDescription(job);

                            return (
                                <article
                                    key={job.id}
                                    className="job-pass"
                                    style={{ "--job-color": couleur?.bar ?? "#0b1d3a", position: "relative" } as React.CSSProperties}
                                >
                                    {estRecente && <span className="job-pass__new">Nouveau</span>}

                                    <button
                                        type="button"
                                        onClick={(e) => toggleFavori(e, job.id)}
                                        aria-label="Ajouter aux favoris"
                                        style={{
                                            position: "absolute",
                                            top: 12,
                                            right: 12,
                                            background: "white",
                                            border: "1px solid #e2e2df",
                                            borderRadius: "50%",
                                            width: 32,
                                            height: 32,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            zIndex: 2,
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill={favoris.has(job.id) ? "#c59b27" : "none"}
                                            stroke="#c59b27"
                                            strokeWidth="2"
                                        >
                                            <path d="M6 3h12v18l-6-4-6 4V3z" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <div className="job-pass__top">
                                        <LogoEntreprise
                                            recruteurId={job.recruteurId}
                                            logoPresent={job.logoPresent}
                                            nomEntreprise={job.nomEntreprise}
                                            className="job-pass__logo"
                                        />
                                        <div className="job-pass__id">
                                            <p className="job-pass__eyebrow">
                                                {job.secteurActivite ?? "Secteur non précisé"}
                                                {jours !== null && <> · {formatAnciennete(jours)}</>}
                                            </p>
                                            <h3>{job.titre}</h3>
                                            <p className="job-pass__company">
                                                {job.nomEntreprise ?? "Entreprise"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* EXTRAIT DE DESCRIPTION SUR 1 LIGNE */}
                                    {descriptionPropre ? (
                                        <p className="job-pass__description">
                                            {descriptionPropre}
                                        </p>
                                    ) : (
                                        <p className="job-pass__description job-pass__description--empty">
                                            Aucune description disponible.
                                        </p>
                                    )}

                                    <div className="job-pass__tags">
                                        <span
                                            className="job-pass__tag job-pass__tag--solid"
                                            style={{
                                                backgroundColor: couleur?.bar ?? "#0b1d3a",
                                                color: "#ffffff",
                                            }}
                                        >
                                            {LABELS_TYPE_CONTRAT[job.typeContrat] ?? job.typeContrat}
                                        </span>
                                        {job.teletravail && <span className="job-pass__tag">Télétravail</span>}
                                        {job.hybride && <span className="job-pass__tag">Hybride</span>}
                                        {job.niveauExperience && (
                                            <span className="job-pass__tag">
                                                {LABELS_NIVEAU_EXPERIENCE[job.niveauExperience]}
                                            </span>
                                        )}
                                    </div>

                                    {competences.length > 0 && (
                                        <div className="job-pass__skills">
                                            {competences.map((c) => (
                                                <span className="job-pass__skill" key={c}>
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="job-pass__footer">
                                        <span className="job-pass__meta">
                                            <IconMapPin />
                                            {lieu}
                                        </span>
                                        <span className="job-pass__meta job-pass__meta--salaire">
                                            <IconCoin />
                                            {job.salaireVisible
                                                ? `${job.salaireMin ?? "-"} - ${job.salaireMax ?? "-"} ${job.devise ?? ""}`
                                                : "Sur demande"}
                                        </span>
                                    </div>

                                    <div className="job-pass__actions">
                                        <Link
                                            to={`/offres/${job.id}`}
                                            className="job-pass__btn job-pass__btn--ghost"
                                            style={{ border: "1px solid #cbd5e1" }}
                                        >
                                            Voir détail
                                        </Link>
                                        <button
                                            className="job-pass__btn job-pass__btn--gold"
                                            style={{ border: "1px solid #c59b27" }}
                                            onClick={(e) => handlePostuler(e, job.id)}
                                        >
                                            Postuler
                                        </button>
                                    </div>
                                </article>
                            );
                        })}

                        <Link to="/offres" className="home-job-more-card">
                            <span>Voir plus d'offres</span>
                            <strong aria-hidden="true">→</strong>
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
}