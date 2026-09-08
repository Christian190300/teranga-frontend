import candidatImg from "../../assets/img_1.png";
import recruteurImg from "../../assets/img_2.png";
import "./CtaCards.css";

export function CtaCards() {
    return (
        <section className="ts-cta">
            {/* --- Carte Candidats --- */}
            <div className="ts-cta-card ts-cta-card--candidat">
                <div className="ts-cta-card__content">
                    <span className="ts-cta-card__label">Candidats</span>
                    <h3 className="ts-cta-card__title">
                        Créez votre profil et soyez visible auprès des recruteurs
                    </h3>
                    <p className="ts-cta-card__text">
                        Postulez facilement et suivez vos candidatures en un seul espace.
                    </p>
                    <a href="/inscription" className="ts-cta-card__btn ts-cta-card__btn--navy">
                        Créer mon profil
                    </a>
                </div>
                <div className="ts-cta-card__media">
                    <img src={candidatImg} alt="Candidate consultant son profil sur une tablette" />
                </div>
            </div>

            {/* --- Carte Entreprises --- */}
            <div className="ts-cta-card ts-cta-card--entreprise">
                <div className="ts-cta-card__content">
                    <span className="ts-cta-card__label">Entreprises</span>
                    <h3 className="ts-cta-card__title">
                        Trouvez les talents dont vous avez besoin
                    </h3>
                    <p className="ts-cta-card__text">
                        Publiez vos offres et recrutez les meilleurs profils au Sénégal.
                    </p>
                    <a href="/recruteur/offres/nouvelle" className="ts-cta-card__btn ts-cta-card__btn--gold">
                        Publier une offre
                    </a>
                </div>
                <div className="ts-cta-card__media">
                    <img src={recruteurImg} alt="Espace de bureau pour les recruteurs" />
                </div>
            </div>
        </section>
    );
}