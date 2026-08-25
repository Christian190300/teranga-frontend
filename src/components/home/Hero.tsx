import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import talent1 from "../../assets/talent-1.jpg";
import talent2 from "../../assets/talent-2.jpg";
import talent3 from "../../assets/talent-3.jpg";
import { IconUsers, IconBriefcase, IconGlobe, IconShieldCheck } from "./icons";
import { listerOffresPubliques } from "../../api/offreService";
import "./Hero.css";

interface Slide {
    image: string;
    title: React.ReactNode;
    subtitle: string;
}

const slides: Slide[] = [
    {
        image: talent1,
        title: (
            <>
                Trouvez votre prochain <span>emploi</span>
            </>
        ),
        subtitle:
            "Des centaines d'opportunités vérifiées vous attendent au Sénégal.",
    },
    {
        image: talent2,
        title: (
            <>
                Construisez votre <span>carrière</span>
            </>
        ),
        subtitle:
            "Rejoignez les entreprises qui recrutent activement les meilleurs talents.",
    },
    {
        image: talent3,
        title: (
            <>
                Recrutez plus vite, recrutez plus <span>juste</span>
            </>
        ),
        subtitle:
            "Accédez à un vivier de profils qualifiés, prêts à rejoindre votre équipe.",
    },
];

const AUTOPLAY_DELAY = 6000;

export function Hero() {
    const [index, setIndex] = useState(0);
    const [totalOffres, setTotalOffres] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % slides.length);
        }, AUTOPLAY_DELAY);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        listerOffresPubliques(0, 1)
            .then((data) => {
                setTotalOffres(data.totalElements ?? data.content?.length ?? 0);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération du nombre d'offres :", err);
            });
    }, []);

    function goTo(i: number) {
        setIndex(i);
    }

    const current = slides[index];

    return (
        <>
            <section className="home-hero">
                <div className="home-hero__container home-container">
                    {/* Colonne texte */}
                    <div className="home-hero__text-col">
                        <span className="home-hero__eyebrow">Talent Sénégal</span>

                        <div className="home-hero__text-block" key={index}>
                            <h1 className="home-hero__title">{current.title}</h1>
                            <p className="home-hero__subtitle">{current.subtitle}</p>
                        </div>

                        <div className="home-hero__actions">
                            <Link to="/inscription?role=candidat" className="home-btn home-btn--primary">
                                Trouver un emploi
                            </Link>
                            <Link to="/inscription?role=recruteur" className="home-btn home-btn--secondary">
                                <IconBriefcase />
                                Publier une offre
                            </Link>
                        </div>

                        <div className="home-hero__dots">
                            {slides.map((slide, i) => (
                                <button
                                    key={slide.image}
                                    type="button"
                                    className={`home-hero__dot ${i === index ? "is-active" : ""}`}
                                    onClick={() => goTo(i)}
                                    aria-label={`Aller à l'image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Colonne photo */}
                    <div className="home-hero__media-col">
                        <div className="home-hero__frame">
                            {slides.map((slide, i) => (
                                <div
                                    key={slide.image}
                                    className={`home-hero__photo ${i === index ? "is-active" : ""}`}
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                />
                            ))}
                            <div className="home-hero__frame-accent" aria-hidden="true" />

                            <div className="home-hero__badge">
                                <div className="home-hero__badge-icon">
                                    <IconUsers />
                                </div>
                                <div>
                                    <div className="home-hero__badge-value">500+</div>
                                    <div className="home-hero__badge-label">Talents inscrits</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chiffres clés */}
            <section className="home-stats-section home-container">
                <div className="home-stats-panel">
                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconUsers />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">500+</div>
                            <div className="home-stats-panel__label">Talents inscrits</div>
                        </div>
                    </div>

                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconBriefcase />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">
                                {totalOffres !== null ? totalOffres : "—"}
                            </div>
                            <div className="home-stats-panel__label">Offres actives</div>
                        </div>
                    </div>

                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconGlobe />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">50+</div>
                            <div className="home-stats-panel__label">Entreprises</div>
                        </div>
                    </div>

                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconShieldCheck />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">98%</div>
                            <div className="home-stats-panel__label">Taux de satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>
            <br />
            <br />
        </>
    );
}