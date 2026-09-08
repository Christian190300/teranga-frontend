import { useEffect, useState } from "react";
import talent1 from "../../assets/img.png";
import {
    IconUsers,
    IconBriefcase,
    IconGlobe,
    IconShieldCheck,
    IconSearch,
    IconMapPin,
    IconDocument
} from "./icons";
import { listerOffresPubliques } from "../../api/offreService";
import "./Hero.css";

export function Hero() {
    const [totalOffres, setTotalOffres] = useState<number | null>(null);

    // États du formulaire de recherche
    const [keyword, setKeyword] = useState("");
    const [ville, setVille] = useState("");
    const [contrat, setContrat] = useState("");

    useEffect(() => {
        listerOffresPubliques(0, 1)
            .then((data) => {
                setTotalOffres(data.totalElements ?? data.content?.length ?? 0);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération du nombre d'offres :", err);
            });
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ keyword, ville, contrat });
    };

    return (
        <section className="ts-hero">
            {/* --- HAUT DE PAGE : TITRE & PHOTO --- */}
            <div className="ts-hero__top">
                {/* Textes */}
                <div className="ts-hero__text-col">
                    <span className="ts-hero__eyebrow">Emploi au Sénégal</span>

                    <h1 className="ts-hero__title">
                        Trouvez l'emploi qui vous correspond <span className="ts-hero__title-accent">au Sénégal</span>
                    </h1>

                    <p className="ts-hero__subtitle">
                        Des opportunités réelles auprès des entreprises qui recrutent.
                        <br className="desktop-only" />
                        Construisez aujourd'hui le demain de votre carrière.
                    </p>
                </div>

                {/* Photo & Badge flottant */}
                <div className="ts-hero__media-col">
                    <div className="ts-hero__photo-frame">
                        <img src={talent1} alt="Professionnel au travail" className="ts-hero__photo" />

                        <div className="ts-hero__floating-badge">
                            <div className="ts-hero__floating-badge-icon">
                                <IconBriefcase />
                            </div>
                            <div className="ts-hero__floating-badge-text">
                                Des centaines d'opportunités vous attendent !
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BARRE DE RECHERCHE --- */}
            <div className="ts-searchbar-wrap">
                <form className="ts-searchbar" onSubmit={handleSearch}>
                    <h3 className="ts-searchbar__title-mobile">Rechercher un emploi</h3>

                    {/* Mot-clé */}
                    <div className="ts-search-field">
                        <div className="ts-search-field__icon">
                            <IconSearch />
                        </div>
                        <div className="ts-search-field__body">
                            <label className="ts-search-field__label">Métier, compétence ou mot-clé</label>
                            <input
                                type="text"
                                placeholder="Commercial, Comptable..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Ville */}
                    <div className="ts-search-field">
                        <div className="ts-search-field__icon">
                            <IconMapPin />
                        </div>
                        <div className="ts-search-field__body">
                            <label className="ts-search-field__label">Ville</label>
                            <input
                                type="text"
                                placeholder="Dakar, Thiès..."
                                value={ville}
                                onChange={(e) => setVille(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type de contrat */}
                    <div className="ts-search-field">
                        <div className="ts-search-field__icon">
                            <IconDocument />
                        </div>
                        <div className="ts-search-field__body">
                            <label className="ts-search-field__label">Type de contrat</label>
                            <select value={contrat} onChange={(e) => setContrat(e.target.value)}>
                                <option value="">Tous les contrats</option>
                                <option value="cdi">CDI</option>
                                <option value="cdd">CDD</option>
                                <option value="stage">Stage</option>
                                <option value="freelance">Freelance</option>
                            </select>
                        </div>
                    </div>

                    {/* Bouton */}
                    <button type="submit" className="ts-searchbar__submit">
                        Rechercher
                    </button>
                </form>
            </div>

            {/* --- STATISTIQUES --- */}
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
                </div>
            </div>
        </section>
    );
}