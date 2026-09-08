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

    // États de recherche
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
            <div className="ts-hero__container">
                {/* --- HAUT : TEXTE + IMAGE --- */}
                <div className="ts-hero__top">
                    {/* Colonne Gauche : Titre + Sous-titre */}
                    <div className="ts-hero__text-col">
                        <span className="ts-hero__eyebrow">
                            <span className="ts-hero__dot"></span> Emploi au Sénégal
                        </span>

                        <h1 className="ts-hero__title">
                            Trouvez l'emploi qui vous correspond <span className="ts-hero__title-accent">au Sénégal</span>
                        </h1>

                        <p className="ts-hero__subtitle">
                            Des opportunités réelles auprès des entreprises qui recrutent. Construisez votre carrière dès aujourd'hui.
                        </p>
                    </div>

                    {/* Colonne Droite : Photo + Badge */}
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

                        {/* Champ Mot-clé */}
                        <div className="ts-search-field">
                            <div className="ts-search-field__icon">
                                <IconSearch />
                            </div>
                            <div className="ts-search-field__body">
                                <label className="ts-search-field__label">Métier, compétence...</label>
                                <input
                                    type="text"
                                    placeholder="Commercial, Comptable..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Champ Ville */}
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

                        {/* Champ Type de contrat */}
                        <div className="ts-search-field">
                            <div className="ts-search-field__icon">
                                <IconDocument />
                            </div>
                            <div className="ts-search-field__body">
                                <label className="ts-search-field__label">Contrat</label>
                                <select value={contrat} onChange={(e) => setContrat(e.target.value)}>
                                    <option value="">Tous les contrats</option>
                                    <option value="cdi">CDI</option>
                                    <option value="cdd">CDD</option>
                                    <option value="stage">Stage</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        {/* Bouton submit */}
                        <button type="submit" className="ts-searchbar__submit">
                            Rechercher
                        </button>
                    </form>
                </div>

                {/* --- STATISTIQUES --- */}
                <div className="ts-stats">
                    <div className="ts-stats__grid">
                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconUsers />
                            </div>
                            <div className="ts-stats__content">
                                <span className="ts-stats__value">500+</span>
                                <span className="ts-stats__label">Talents inscrits</span>
                            </div>
                        </div>

                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconBriefcase />
                            </div>
                            <div className="ts-stats__content">
                                <span className="ts-stats__value">
                                    {totalOffres !== null ? totalOffres : "—"}
                                </span>
                                <span className="ts-stats__label">Offres actives</span>
                            </div>
                        </div>

                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconGlobe />
                            </div>
                            <div className="ts-stats__content">
                                <span className="ts-stats__value">50+</span>
                                <span className="ts-stats__label">Entreprises</span>
                            </div>
                        </div>

                        <div className="ts-stats__item">
                            <div className="ts-stats__icon">
                                <IconShieldCheck />
                            </div>
                            <div className="ts-stats__content">
                                <span className="ts-stats__value">98%</span>
                                <span className="ts-stats__label">Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}