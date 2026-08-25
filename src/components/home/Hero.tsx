import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconUsers, IconBriefcase, IconGlobe, IconShieldCheck } from "./icons";
import { listerOffresPubliques } from "../../api/offreService";
import "./Hero.css";

const TICKER_ITEMS = [
    "Développeur Full-Stack — Dakar",
    "Comptable Senior — Thiès",
    "Chef de Projet Digital — Dakar",
    "Ingénieur Génie Civil — Saint-Louis",
    "Chargé(e) de Recrutement — Dakar",
    "Responsable Marketing — Mbour",
    "Data Analyst — Dakar",
    "Technicien Réseaux — Ziguinchor",
];

export function Hero() {
    const [totalOffres, setTotalOffres] = useState<number | null>(null);

    useEffect(() => {
        listerOffresPubliques(0, 1)
            .then((data) => {
                setTotalOffres(data.totalElements ?? data.content?.length ?? 0);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération du nombre d'offres :", err);
            });
    }, []);

    return (
        <>
            <section className="ts-hero">
                <div className="ts-hero__inner">
                    <span className="ts-hero__eyebrow">
                        <span className="ts-hero__eyebrow-line" />
                        Talent Sénégal
                    </span>

                    <h1 className="ts-hero__title">
                        Le talent sénégalais,
                        <br />
                        <span className="ts-hero__title-accent">directement au bon endroit.</span>
                    </h1>

                    <p className="ts-hero__subtitle">
                        Des profils vérifiés, des offres vérifiées, et une mise en relation
                        pensée pour aller vite — que vous recrutiez ou que vous cherchiez.
                    </p>

                    <div className="ts-hero__actions">
                        <Link to="/inscription?role=candidat" className="ts-btn ts-btn--primary">
                            Trouver un emploi
                        </Link>
                        <Link to="/inscription?role=recruteur" className="ts-btn ts-btn--secondary">
                            <IconBriefcase />
                            Publier une offre
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bandeau d'offres — signature vivante de la plateforme */}
            <div className="ts-ticker">
                <div className="ts-ticker__track">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span className="ts-ticker__item" key={i}>
                            <span className="ts-ticker__dot" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>

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