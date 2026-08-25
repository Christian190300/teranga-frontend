import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import talent1 from "../../assets/talent-1.jpg";
import { IconUsers, IconBriefcase, IconGlobe, IconShieldCheck } from "./icons";
import { listerOffresPubliques } from "../../api/offreService";
import "./Hero.css";

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
        <section className="ts-hero">
            <div className="ts-hero__top">
                {/* Colonne texte */}
                <div className="ts-hero__text-col">
                    <h1 className="ts-hero__title">
                        Trouvez
                        <br />
                        votre prochain
                        <br />
                        <span className="ts-hero__title-accent">emploi</span>
                    </h1>
                    <span className="ts-hero__underline" />

                    <p className="ts-hero__subtitle">
                        Des centaines d'opportunités
                        <br />
                        vous attendent au Sénégal.
                    </p>

                    <div className="ts-hero__actions">
                        <Link to="/inscription?role=candidat" className="ts-btn ts-btn--primary">
                            <IconUsers />
                            Trouver un emploi
                        </Link>
                        <Link to="/inscription?role=recruteur" className="ts-btn ts-btn--secondary">
                            <IconBriefcase />
                            Publier une offre
                        </Link>
                    </div>
                </div>

                {/* Colonne photo — bleed jusqu'au bord de l'écran, aucune zone morte possible */}
                <div className="ts-hero__media-col">
                    <img src={talent1} alt="Professionnelle sénégalaise" className="ts-hero__photo" />
                </div>
            </div>

            {/* Carte de stats — chevauche le bas du hero, reste dans un conteneur centré */}
            <div className="ts-stats">
                <div className="ts-stats__inner">
                    <div className="ts-stats__grid">
                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconUsers />
                            </div>
                            <div>
                                <div className="ts-stats__value">500+</div>
                                <div className="ts-stats__label">Talents inscrits</div>
                                <div className="ts-stats__desc">Des professionnels prêts à l'emploi</div>
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
                                <div className="ts-stats__desc">Des opportunités à saisir</div>
                            </div>
                        </div>

                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconGlobe />
                            </div>
                            <div>
                                <div className="ts-stats__value">50+</div>
                                <div className="ts-stats__label">Entreprises</div>
                                <div className="ts-stats__desc">Nous font confiance au quotidien</div>
                            </div>
                        </div>

                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconShieldCheck />
                            </div>
                            <div>
                                <div className="ts-stats__value">98%</div>
                                <div className="ts-stats__label">Taux de satisfaction</div>
                                <div className="ts-stats__desc">Des recruteurs satisfaits de nos services</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}