import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import talent1 from "../../assets/talent-1.jpg";
import { IconUsers, IconBriefcase, IconGlobe, IconShieldCheck } from "./icons";
import { listerOffresPubliques } from "../../api/offreService";

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
            <section className="home-hero">
                <div className="home-hero__slides">
                    <div className="home-hero__slide is-active" style={{ backgroundImage: `url(${talent1})` }} />
                    <div className="home-hero__overlay" />
                </div>

                <div className="home-hero__content home-container">
                    <div className="home-hero__text-block">
                        <h1 className="home-hero__title">
                            TROUVEZ
                            <br />
                            VOTRE PROCHAIN
                            <br />
                            <span>EMPLOI</span>
                        </h1>
                        <p className="home-hero__subtitle">
                            Des centaines d'opportunités vous attendent au Sénégal.
                        </p>
                        <div className="home-hero__actions">
                            <Link to="/offres" className="home-btn home-btn--gold">
                                Trouver un emploi
                            </Link>
                            <Link to="/inscription?role=recruteur" className="home-btn home-btn--outline">
                                Publier une offre
                            </Link>
                        </div>
                    </div>
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
                            <div className="home-stats-panel__value">500+</div>
                            <div className="home-stats-panel__label">Talents inscrits</div>
                            <div style={{ fontSize: 13, color: "#8A8780", marginTop: 2 }}>
                                Des professionnels prêts à l'emploi
                            </div>
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
                            <div style={{ fontSize: 13, color: "#8A8780", marginTop: 2 }}>
                                Des opportunités à saisir
                            </div>
                        </div>
                    </div>

                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconGlobe />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">50+</div>
                            <div className="home-stats-panel__label">Entreprises</div>
                            <div style={{ fontSize: 13, color: "#8A8780", marginTop: 2 }}>
                                Nous font confiance au quotidien
                            </div>
                        </div>
                    </div>

                    <div className="home-stats-panel__item">
                        <div className="home-stats-panel__icon">
                            <IconShieldCheck />
                        </div>
                        <div>
                            <div className="home-stats-panel__value">98%</div>
                            <div className="home-stats-panel__label">Taux de satisfaction</div>
                            <div style={{ fontSize: 13, color: "#8A8780", marginTop: 2 }}>
                                Des recruteurs satisfaits de nos services
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <br />
            <br />
        </>
    );
}