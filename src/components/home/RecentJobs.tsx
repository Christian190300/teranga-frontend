import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconBriefcase, IconCoin, IconMapPin } from "./icons";
import {
    LABELS_TYPE_CONTRAT,
    type OffreDTO,
    listerOffresPubliques,
} from "../../api/offreService";

export function RecentJobs() {
    const [jobs, setJobs] = useState<OffreDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const estConnecte = !!localStorage.getItem("access_token");

    useEffect(() => {
        async function charger() {
            try {
                const resultat = await listerOffresPubliques(0, 3);

                // Tri par date de publication décroissante
                const offres = [...resultat.content].sort(
                    (a, b) =>
                        new Date(b.datePublication ?? 0).getTime() -
                        new Date(a.datePublication ?? 0).getTime()
                );

                setJobs(offres);
            } catch (error) {
                console.error("Erreur lors du chargement des offres :", error);
            } finally {
                setLoading(false);
            }
        }

        charger();
    }, []);

    return (
        <section className="home-section home-container">
            <div className="home-section__head">
                <div>
                    <h2 className="home-section__title">
                        Opportunités récentes
                    </h2>

                    <p className="home-section__subtitle">
                        Les derniers postes publiés par les entreprises qui recrutent.
                    </p>
                </div>

                <Link
                    to={estConnecte ? "/offres" : "/connexion"}
                    className="home-btn home-btn--text"
                >
                    Voir toutes les offres →
                </Link>
            </div>

            <div className="home-jobs-grid">
                {loading ? (
                    <p>Chargement des offres...</p>
                ) : (
                    jobs.map((job) => (
                        <article className="home-job-card" key={job.id}>
                            <div className="home-job-card__top">
                                <div className="home-job-card__icon">
                                    <IconBriefcase />
                                </div>

                                <span className="home-pill">
                                    {LABELS_TYPE_CONTRAT[job.typeContrat]}
                                </span>
                            </div>

                            <div>
                                <h3>{job.titre}</h3>

                                <p className="home-job-card__company">
                                    {job.nomEntreprise ?? "Entreprise"}
                                </p>
                            </div>

                            <div className="home-job-card__meta">
                                <span>
                                    <IconMapPin />
                                    {job.ville ??
                                        job.region ??
                                        job.pays ??
                                        "Non précisé"}
                                </span>

                                <span>
                                    <IconCoin />
                                    {job.salaireVisible
                                        ? `${job.salaireMin ?? "-"} - ${
                                            job.salaireMax ?? "-"
                                        } ${job.devise ?? ""}`
                                        : "Salaire non communiqué"}
                                </span>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}