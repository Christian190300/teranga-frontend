import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import talent1 from "../../assets/talent-1.jpg";
import { IconUsers, IconBriefcase, IconGlobe, IconShieldCheck } from "./icons";
import { listerOffresPubliques } from "../../api/offreService";
import "./Hero.css";

interface Slide {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
}

const slides: Slide[] = [
    {
        eyebrow: "Talent Sénégal",
        titleLead: "Trouvez votre",
        titleAccent: "prochain emploi",
        subtitle: "Des centaines d'opportunités vérifiées vous attendent au Sénégal.",
    },
    {
        eyebrow: "Talent Sénégal",
        titleLead: "Construisez votre",
        titleAccent: "carrière",
        subtitle: "Rejoignez les entreprises qui recrutent activement les meilleurs talents.",
    },
    {
        eyebrow: "Talent Sénégal",
        titleLead: "Recrutez plus vite,",
        titleAccent: "recrutez plus juste",
        subtitle: "Accédez à un vivier de profils qualifiés, prêts à rejoindre votre équipe.",
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

    const current = slides[index];

    return (
        <>
            <section className="ts-hero">
                <div className="ts-hero__pattern" aria-hidden="true" />

                <div className="ts-hero__container">
                    {/* Colonne texte */}
                    <div className="ts-hero__text-col">
                        <span className="ts-hero__eyebrow">
                            <span className="ts-hero__eyebrow-line" />
                            {current.eyebrow}
                        </span>

                        <div className="ts-hero__text-block" key={index}>
                            <h1 className="ts-hero__title">
                                <span className="ts-hero__title-lead">{current.titleLead}</span>
                                <span className="ts-hero__title-accent">{current.titleAccent}</span>
                            </h1>
                            <p className="ts-hero__subtitle">{current.subtitle}</p>
                        </div>

                        <div className="ts-hero__actions">
                            <Link to="/inscription?role=candidat" className="ts-btn ts-btn--primary">
                                Trouver un emploi
                            </Link>
                            <Link to="/inscription?role=recruteur" className="ts-btn ts-btn--secondary">
                                <IconBriefcase />
                                Publier une offre
                            </Link>
                        </div>

                        <div className="ts-hero__dots">
                            {slides.map((slide, i) => (
                                <button
                                    key={slide.titleAccent}
                                    type="button"
                                    className={`ts-hero__dot ${i === index ? "is-active" : ""}`}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Message ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Colonne photo — une seule photo forte, pas de carrousel */}
                    <div className="ts-hero__media-col">
                        <div className="ts-hero__glow" aria-hidden="true" />
                        <div className="ts-hero__frame">
                            <img src={talent1} alt="Professionnel sénégalais en entretien" className="ts-hero__photo" />

                            <div className="ts-hero__badge">
                                <div className="ts-hero__badge-icon">
                                    <IconUsers />
                                </div>
                                <div>
                                    <div className="ts-hero__badge-value">500+</div>
                                    <div className="ts-hero__badge-label">Talents inscrits</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chiffres clés */}
            <section className="ts-stats">
                <div className="ts-stats__panel">
                    <div className="ts-stats__item">
                        <div className="ts-stats__icon">
                            <IconUsers />
                        </div>
                        <div>
                            <div className="ts-stats__value">500+</div>
                            <div className="ts-stats__label">Talents inscrits</div>
                        </div>
                    </div>

                    <div className="ts-stats__item">
                        <div className="ts-stats__icon">
                            <IconBriefcase />
                        </div>
                        <div>
                            <div className="ts-stats__value">
                                {totalOffres !== null ? totalOffres : "—"}
                            </div>
                            <div className="ts-stats__label">Offres actives</div>
                        </div>
                    </div>

                    <div className="ts-stats__item">
                        <div className="ts-stats__icon">
                            <IconGlobe />
                        </div>
                        <div>
                            <div className="ts-stats__value">50+</div>
                            <div className="ts-stats__label">Entreprises</div>
                        </div>
                    </div>

                    <div className="ts-stats__item">
                        <div className="ts-stats__icon">
                            <IconShieldCheck />
                        </div>
                        <div>
                            <div className="ts-stats__value">98%</div>
                            <div className="ts-stats__label">Taux de satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}