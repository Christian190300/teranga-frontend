import "./AboutPage.css";
import {
    FaBullseye,
    FaUsers,
    FaAward,
    FaHeart,
} from "react-icons/fa";

interface AboutCard {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const cards: AboutCard[] = [
    {
        icon: <FaBullseye />,
        title: "Notre mission",
        description:
            "Connecter les talents sénégalais avec les meilleures opportunités professionnelles et faciliter le recrutement pour les entreprises.",
    },
    {
        icon: <FaUsers />,
        title: "Inclusion",
        description:
            "Nous croyons en l'égalité des chances et travaillons à rendre le marché de l'emploi accessible à tous les talents, peu importe leur origine.",
    },
    {
        icon: <FaAward />,
        title: "Excellence",
        description:
            "Nous nous engageons à fournir une plateforme de qualité qui répond aux besoins des talents et des recruteurs avec professionnalisme.",
    },
    {
        icon: <FaHeart />,
        title: "Impact social",
        description:
            "Notre objectif est de contribuer au développement économique du Sénégal en facilitant l'insertion professionnelle des jeunes talents.",
    },
];

export const AboutPage = () => {
    return (
        <main className="about-page">
            <div className="about-container">
                {/* En-tête */}
                <section className="about-header">
                    <h1>À propos de Talent Sénégal</h1>

                    <p>
                        Talent Sénégal est la plateforme de référence pour connecter les
                        talents sénégalais avec les meilleures opportunités
                        professionnelles. Nous facilitons la rencontre entre les
                        chercheurs d'emploi qualifiés et les entreprises qui recrutent.
                    </p>
                </section>

                {/* Cartes */}
                <section className="about-grid">
                    {cards.map((card, index) => (
                        <article className="about-card" key={index}>
                            <div className="about-icon">{card.icon}</div>

                            <h3>{card.title}</h3>

                            <p>{card.description}</p>
                        </article>
                    ))}
                </section>

                {/* Histoire */}
                <section className="about-history">
                    <h2>Notre histoire</h2>

                    <p>
                        Fondée en 2024, Talent Sénégal est née de la volonté de faciliter
                        l'accès à l'emploi pour les jeunes talents sénégalais et de
                        simplifier le processus de recrutement pour les entreprises.
                    </p>

                    <p>
                        Nous avons constaté que de nombreux talents qualifiés peinaient à
                        trouver des opportunités correspondant à leurs compétences, tandis
                        que les entreprises avaient du mal à identifier les bons profils.
                        Talent Sénégal est la solution à ce double défi.
                    </p>

                    <p>
                        Aujourd'hui, nous sommes fiers de compter des milliers de talents
                        inscrits et des centaines d'entreprises partenaires qui font
                        confiance à notre plateforme pour leurs besoins en recrutement.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default AboutPage;