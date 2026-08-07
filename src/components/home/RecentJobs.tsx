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

    useEffect(() => {
        async function charger() {
            try {
                const resultat = await listerOffresPubliques(0, 3);

                const offres = [...(resultat.content ?? [])].sort(
                    (a, b) =>
                        new Date(b.datePublication ?? 0).getTime() -
                        new Date(a.datePublication ?? 0).getTime()
                );

                setJobs(offres);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des offres :",
                    error
                );
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
                    to="/offres"
                    className="home-btn home-btn--text"
                >
                    Voir toutes les offres →
                </Link>
            </div>


            <div className="home-jobs-grid">

                {loading ? (

                    <p>
                        Chargement des offres...
                    </p>

                ) : jobs.length === 0 ? (

                    <p>
                        Aucune offre disponible actuellement.
                    </p>

                ) : (

                    jobs.map((job) => (

                        <Link
                            key={job.id}
                            to={`/offres/${job.id}`}
                            className="home-job-card"
                        >

                            <div className="home-job-card__top">

                                <div className="home-job-card__icon">
                                    <IconBriefcase />
                                </div>


                                <span className="home-pill">
                                    {LABELS_TYPE_CONTRAT[job.typeContrat]}
                                </span>

                            </div>



                            <div>

                                <h3>
                                    {job.titre}
                                </h3>


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


                        </Link>

                    ))

                )}

            </div>

        </section>
    );
}