import { Link } from "react-router-dom";
import "./finalCta.css";

export function FinalCTA() {
    return (
        <section className="final-cta">
            <div className="final-cta__container">
                <div className="final-cta__content">
                    <span className="final-cta__eyebrow">
                        <span className="final-cta__eyebrow-line" />
                        Talent Sénégal
                    </span>

                    <h2 className="final-cta__title">
                        Donnez une nouvelle dimension
                        <span> à votre avenir.</span>
                    </h2>

                    <p className="final-cta__text">
                        Que vous soyez à la recherche d'une opportunité ou du
                        talent qui fera la différence, Talent Sénégal vous
                        accompagne à chaque étape.
                    </p>

                    <div className="final-cta__actions">
                        <Link
                            to="/inscription?role=candidat"
                            className="final-cta__btn final-cta__btn--primary"
                        >
                            <span>Créer mon profil</span>
                            <span className="final-cta__btn-icon" aria-hidden="true">
                                →
                            </span>
                        </Link>

                        <Link
                            to="/offres"
                            className="final-cta__btn final-cta__btn--secondary"
                        >
                            Découvrir les opportunités
                        </Link>
                    </div>

                    <div className="final-cta__trust">
                        <span>✓</span>
                        Inscription gratuite
                        <span className="final-cta__separator" />
                        <span>✓</span>
                        Sans engagement
                        <span className="final-cta__separator" />
                        <span>✓</span>
                        Simple et rapide
                    </div>
                </div>

                <div className="final-cta__visual" aria-hidden="true">
                    <div className="final-cta__circle final-cta__circle--outer" />
                    <div className="final-cta__circle final-cta__circle--middle" />
                    <div className="final-cta__circle final-cta__circle--inner">
                        <span>TS</span>
                    </div>
                </div>
            </div>
        </section>
    );
}