import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconCoin, IconMapPin } from "./icons";
import { LogoEntreprise } from "../common/LogoEntreprise";
import { getCouleurContrat } from "../../pages/offres/offreColors";

import {
    LABELS_TYPE_CONTRAT,
    type OffreDTO,
    listerOffresPubliques,
} from "../../api/offreService";

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
                            return (
                                <article
                                    key={job.id}
                                    className="job-badge"
                                    style={
                                        {
                                            "--job-color": couleur.bar,
                                            "--job-color-soft": couleur.bg,
                                        } as React.CSSProperties
                                    }
                                >
                                    <div className="job-badge__stripe" />

                                    <div className="job-badge__head">
                                        <LogoEntreprise
                                            recruteurId={job.recruteurId}
                                            logoPresent={job.logoPresent}
                                            nomEntreprise={job.nomEntreprise}
                                            className="job-badge__logo"
                                        />
                                        <span className="job-badge__pill">{LABELS_TYPE_CONTRAT[job.typeContrat]}</span>
                                    </div>

                                    <div className="job-badge__body">
                                        <h3>{job.titre}</h3>
                                        <p className="job-badge__company">{job.nomEntreprise ?? "Entreprise"}</p>
                                    </div>

                                    <div className="job-badge__meta">
                                        <span>
                                            <IconMapPin />
                                            {job.ville ?? job.region ?? job.pays ?? "Non précisé"}
                                        </span>
                                        <span className="job-badge__meta-sep">•</span>
                                        <span>
                                            <IconCoin />
                                            {job.salaireVisible
                                                ? `${job.salaireMin ?? "-"} - ${job.salaireMax ?? "-"} ${job.devise ?? ""}`
                                                : "Salaire non communiqué"}
                                        </span>
                                    </div>

                                    <div className="job-badge__actions">
                                        <Link to={`/offres/${job.id}`} className="job-badge__btn job-badge__btn--ghost">
                                            Voir détail
                                        </Link>
                                        <button className="job-badge__btn job-badge__btn--gold" onClick={handlePostuler}>
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