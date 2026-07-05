import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import talent1 from "../../assets/talent-1.jpg";
import talent2 from "../../assets/talent-2.jpg";
import talent3 from "../../assets/talent-3.jpg";
import { IconUsers, IconBriefcase, IconGlobe, IconShieldCheck } from "./icons";

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
                Révélez votre <span>potentiel</span>.
                <br />
                Trouvez l'<span>excellence</span>.
            </>
        ),
        subtitle:
            "Connectez-vous avec les entreprises les plus innovantes et les talents les plus prometteurs du Sénégal.",
    },
    {
        image: talent2,
        title: (
            <>
                Construisez votre <span>carrière</span>.
                <br />
                Rejoignez les meilleurs <span>talents</span>.
            </>
        ),
        subtitle:
            "Des centaines d'offres vérifiées, publiées par des entreprises qui recrutent activement.",
    },
    {
        image: talent3,
        title: (
            <>
                Recrutez plus <span>vite</span>.
                <br />
                Recrutez plus <span>juste</span>.
            </>
        ),
        subtitle:
            "Accédez à un vivier de profils qualifiés et vérifiés, prêts à rejoindre votre équipe.",
    },
];

const AUTOPLAY_DELAY = 6000;

export function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % slides.length);
        }, AUTOPLAY_DELAY);
        return () => clearInterval(timer);
    }, []);

    function goToPrevious() {
        setIndex((current) => (current - 1 + slides.length) % slides.length);
    }

    function goToNext() {
        setIndex((current) => (current + 1) % slides.length);
    }

    const current = slides[index];

    return (
        <>
            <section className="home-hero">
                <div className="home-hero__slides">
                    {slides.map((slide, i) => (
                        <div
                            key={slide.image}
                            className={`home-hero__slide ${i === index ? "is-active" : ""}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                    ))}
                    <div className="home-hero__overlay" />
                </div>

                <button
                    type="button"
                    className="home-hero__arrow home-hero__arrow--prev"
                    onClick={goToPrevious}
                    aria-label="Image précédente"
                >
                    ‹
                </button>
                <button
                    type="button"
                    className="home-hero__arrow home-hero__arrow--next"
                    onClick={goToNext}
                    aria-label="Image suivante"
                >
                    ›
                </button>

                <div className="home-hero__content home-container">
                    {/* key={index} force un nouveau montage à chaque changement de slide,
                        ce qui relance proprement l'animation d'apparition du texte. */}
                    <div className="home-hero__text-block" key={index}>
                        <h1 className="home-hero__title">{current.title}</h1>
                        <p className="home-hero__subtitle">{current.subtitle}</p>
                        <div className="home-hero__actions">
                            <Link to="/inscription?role=candidat" className="home-btn home-btn--gold">
                                Créer mon profil
                            </Link>
                            <Link to="/offres" className="home-btn home-btn--outline">
                                Découvrir les offres
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="home-hero__dots">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.image}
                            type="button"
                            className={`home-hero__dot ${i === index ? "is-active" : ""}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Aller à l'image ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Chiffres clés — panneau unique qui chevauche le bas du hero */}
            <section className="home-stats-section home-container">
                <div className="home-stats-panel">
                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconUsers />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">0+</div>
                            <div className="home-stats-panel__label">Talents inscrits</div>
                        </div>
                    </div>
                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconBriefcase />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">203+</div>
                            <div className="home-stats-panel__label">Offres actives</div>
                        </div>
                    </div>
                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconGlobe />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">21+</div>
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
            <br/>
            <br/>
        </>
    );

}