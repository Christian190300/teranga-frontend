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
    const diffMs = Date.now() - new Date(iso).getTime();
    return Math.floor(diffMs / 86400000);
}

function formatAnciennete(jours: number | null): string {
    if (jours === null) return "";
    if (jours <= 0) return "Publiée aujourd'hui";
    if (jours === 1) return "Publiée hier";
    return `Publiée il y a ${jours} j`;
}

export function RecentJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<OffreDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function charger() {
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
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, []);

    function handlePostuler(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        navigate("/connexion");
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
                    <p>Chargement des offres...</p>
                ) : jobs.length === 0 ? (
                    <p>Aucune offre disponible actuellement.</p>
                ) : (
                    <>
                        {jobs.map((job) => {
                            const couleur = getCouleurContrat(job.typeContrat);
                            const jours = joursDepuisPublication(job.datePublication);
                            const estRecente = jours !== null && jours <= 2;
                            const lieu = [job.ville, job.region, job.pays].filter(Boolean).join(", ") || "Non précisé";
                            const competences = (job.competences ?? []).slice(0, 3);

                            return (
                                <article
                                    key={job.id}
                                    className="job-pass"
                                    style={{ "--job-color": couleur.bar } as React.CSSProperties}
                                >
                                    {estRecente && <span className="job-pass__new">Nouveau</span>}

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
                                            <p className="job-pass__company">{job.nomEntreprise ?? "Entreprise"}</p>
                                        </div>
                                    </div>

                                    <div className="job-pass__tags">
                                        <span className="job-pass__tag job-pass__tag--solid">
                                            {LABELS_TYPE_CONTRAT[job.typeContrat]}
                                        </span>
                                        {job.teletravail && <span className="job-pass__tag">Télétravail</span>}
                                        {job.hybride && <span className="job-pass__tag">Hybride</span>}
                                        {job.niveauExperience && (
                                            <span className="job-pass__tag">{LABELS_NIVEAU_EXPERIENCE[job.niveauExperience]}</span>
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
                                                : "Salaire non communiqué"}
                                        </span>
                                    </div>

                                    <div className="job-pass__actions">
                                        <Link to={`/offres/${job.id}`} className="job-pass__btn job-pass__btn--ghost">
                                            Voir détail
                                        </Link>
                                        <button className="job-pass__btn job-pass__btn--gold" onClick={handlePostuler}>
                                            Postuler
                                        </button>
                                    </div>
                                </article>
                            );
                        })}

                        <Link to="/offres" className="home-job-more-card">
                            <span>Voir plus d'offres</span>
                            <strong>→</strong>
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
}