import { Link } from "react-router-dom";
import { IconBriefcase, IconCoin, IconMapPin } from "./icons";

interface JobPreview {
    title: string;
    company: string;
    location: string;
    salary: string;
    accent: "navy" | "gold";
}

// Données de démonstration — à remplacer par un appel à l'API /api/offres quand ce module existera.
const jobs: JobPreview[] = [
    { title: "Chargée d'affaires", company: "Nouvelle Entreprise", location: "Nord Foire", salary: "Salaire à négocier", accent: "navy" },
    { title: "Gestionnaire de projet", company: "Agence numérique Dakar", location: "Dakar", salary: "1200k – 1800k FCFA", accent: "gold" },
    { title: "Spécialiste Contenu", company: "Agence numérique Dakar", location: "Dakar", salary: "1000k – 1500k FCFA", accent: "navy" },
];

export function RecentJobs() {
    return (
        <section className="home-section home-container">
            <div className="home-section__head">
                <div>
                    <h2 className="home-section__title">Opportunités récentes</h2>
                    <p className="home-section__subtitle">Les derniers postes publiés par les entreprises qui recrutent.</p>
                </div>
                <Link to="/offres" className="home-btn home-btn--text">
                    Voir toutes les offres →
                </Link>
            </div>

            <div className="home-jobs-grid">
                {jobs.map((job) => (
                    <article className={`home-job-card ${job.accent === "gold" ? "home-job-card--gold" : ""}`} key={job.title}>
                        <div className="home-job-card__top">
                            <div className="home-job-card__icon">
                                <IconBriefcase />
                            </div>
                            <span className="home-pill">Ouvert</span>
                        </div>

                        <div>
                            <h3>{job.title}</h3>
                            <p className="home-job-card__company">{job.company}</p>
                        </div>

                        <div className="home-job-card__meta">
              <span>
                <IconMapPin /> {job.location}
              </span>
                            <span>
                <IconCoin /> {job.salary}
              </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}